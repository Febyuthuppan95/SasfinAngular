import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Input, ElementRef } from '@angular/core';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { CaptureService } from 'src/app/services/capture.service';
import { UserService } from 'src/app/services/user.Service';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { EventService } from 'src/app/services/event.service';
import { ObjectHelpService } from 'src/app/services/ObjectHelp.service';
import { CompanyService } from 'src/app/services/Company.Service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ShortcutInput, KeyboardShortcutsComponent, AllowIn } from 'ng-keyboard-shortcuts';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { SubmitDialogComponent } from 'src/app/layouts/capture-layout/submit-dialog/submit-dialog.component';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';
import { DialogOverrideComponent } from '../../dialog-override/dialog-override.component';
import { WaybillListResponse } from 'src/app/models/HttpResponses/Waybill';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AttachmentError } from 'src/app/models/HttpResponses/AttachmentErrorResponse';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@AutoUnsubscribe()
@Component({
  selector: 'app-form-way',
  templateUrl: './form-way.component.html',
  styleUrls: ['./form-way.component.scss']
})
export class FormWayComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private captureService: CaptureService,
              private userService: UserService,
              private snackbarService: HelpSnackbar,
              private objectHelpService: ObjectHelpService,
              private dialog: MatDialog,
              private snackbar: MatSnackBar,
              private companyService: CompanyService,
              private router: Router) {}

form = new FormGroup({
  userID: new FormControl(null),
  waybillID: new FormControl(null),
  waybillNo: new FormControl(null, [Validators.required]),
  attachmentStatusID: new FormControl(null),
  isDeleted: new FormControl(0),
  waybillNoOBit: new FormControl(null),
  waybillNoOReason: new FormControl(null),
  transAtArrival: new FormControl(null),
  transAtArrivalOBit: new FormControl(null),
  transAtArrivalOReason: new FormControl(null),
  containerNo: new FormControl(null),
  containerNoOBit: new FormControl(null),
  containerNoOReason: new FormControl(null),
});

public attachmentLabel: string;
public transactionLabel: string;
public errors: AttachmentError[] = [];
public shortcuts: ShortcutInput[];
public help = false;
public loader = true;
public showErrors = false;

private attachmentID: number;
private transactionID: number;
private currentUser = this.userService.getCurrentUser();
private dialogOpen = false;

@ViewChild(NotificationComponent, { static: true })
private notify: NotificationComponent;

@ViewChild(KeyboardShortcutsComponent, { static: true })
private keyboard: KeyboardShortcutsComponent;

@ViewChild('startForm', { static: false })
private startForm: ElementRef;

@Input() capture: any;

public init() {
  if (this.capture) {
    this.attachmentID = this.capture.attachmentID;
    this.transactionID = this.capture.transactionID;
    this.attachmentLabel = 'Waybill';
    this.transactionLabel = this.capture.transactionType;
    this.load();
  }
}

public submissionEvent = (escalation, saveProgress, escalationResolved) =>
this.submit(this.form, escalation, saveProgress, escalationResolved)

ngOnInit() {}

ngAfterViewInit(): void {
  setTimeout(() => {
      this.shortcuts = [
        {
          key: 'alt + s',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => {
            if (!this.dialogOpen) {
              this.dialogOpen = true;
              this.dialog.open(SubmitDialogComponent).afterClosed().subscribe((status: boolean) => {
                this.dialogOpen = false;
                if (status) {
                  this.submit(this.form);
                }
              });
            }
          }
        },
        {
          key: 'alt + m',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => {
            setTimeout(() => this.startForm.nativeElement.focus());
          }
        },
        {
            key: 'ctrl + alt + h',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => {
              this.toggelHelpBar();
            }
        },
        {
          key: 'alt + t',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => {
            this.showErrors = !this.showErrors;
          }
        }];
  });
}

async load() {
  const requestModel = {
    userID: this.currentUser.userID,
    waybillID: this.attachmentID,
    transactionID: this.transactionID,
    rowStart: 1,
    rowEnd: 15,
    orderBy: '',
    orderDirection: 'DESC',
    filter: ''
  };

  await this.captureService.waybillList(requestModel).then(async (res: WaybillListResponse) => {
    this.loader = false;

    if (res.waybills.length > 0) {

    const response: any = res.waybills[0];
    response.waybillID = res.waybills[0].waybillID;
    response.attachmentStatusID = response.statusID;

    this.form.patchValue(response);
    this.form.controls.userID.setValue(this.currentUser.userID);
    this.errors = res.attachmentErrors.attachmentErrors;

    Object.keys(this.form.controls).forEach(key => {
      if (key.indexOf('ODate') !== -1) {
        if (this.form.controls[key].value !== null || this.form.controls[key].value) {
          this.form.controls[key].setValue(null);
        }
      }
    });

    if (res.attachmentErrors.attachmentErrors.length > 0) {
      Object.keys(this.form.controls).forEach(key => {
        res.attachmentErrors.attachmentErrors.forEach((error) => {
          if (key.toUpperCase() === error.fieldName.toUpperCase()) {
            if (!this.form.controls[`${key}OBit`].value) {
              this.form.controls[key].setErrors({incorrect: true});
              this.form.controls[key].markAsTouched();
            }
          }
        });
      });
    }

    this.form.updateValueAndValidity();
    setTimeout(() => this.startForm.nativeElement.focus(), 100);

  } else {
    this.snackbar.open('Failed to retrieve capture data', '', { duration: 3000 });
  }
  }, (err) => {
    this.loader = false;
  });
}

toggelHelpBar() {
  this.help = !this.help;
  this.objectHelpService.toggleHelp(this.help);
}

updateHelpContext(slug: string) {
  const newContext: SnackbarModel = {
    display: true,
    slug
  };

  this.snackbarService.setHelpContext(newContext);
}

findInvalidControls(form: FormGroup) {
  const invalid = [];
  const controls = form.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
          invalid.push(name);
      }
  }

  console.log(invalid);
}

getError(key: string): string {
  return this.errors.find(x => x.fieldName.toUpperCase() === key.toUpperCase()) ? this.errors.find(x => x.fieldName.toUpperCase() === key.toUpperCase()).errorDescription : '';
}

async submit(form: FormGroup, escalation?: boolean, saveProgress?: boolean, escalationResolved?: boolean) {
  form.markAllAsTouched();

  if (form.valid || escalation || saveProgress || escalationResolved) {
    const requestModel: any = form.value;
    // tslint:disable-next-line: max-line-length
    requestModel.attachmentStatusID = escalation ? 7 : (escalationResolved ? 8 : (saveProgress && requestModel.attachmentStatusID === 7 ? 7 : (saveProgress ? 2 : 3)));
    requestModel.userID = this.currentUser.userID;

    await this.captureService.waybillUpdate(requestModel).then(
      async (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          // await this.updateErrors(this.errors);

          if (saveProgress) {
            this.snackbar.open('Progress Saved', '', { duration: 3000 });
            this.load();
          } else {
            this.notify.successmsg(res.outcome, res.outcomeMessage);
            if (this.currentUser.designation === 'Consultant') {
              this.router.navigate(['escalations']);
            } else {
              this.companyService.setCapture({ capturestate: true });
              this.router.navigateByUrl('transaction/capturerlanding');
            }
          }
      } else {
        this.notify.errorsmsg(res.outcome, res.outcomeMessage);
      }
    },
      (msg) => {
        console.log(JSON.stringify(msg));
        this.notify.errorsmsg('Failure', 'Cannot reach server');
      }
    );
  } else {
    this.snackbar.open('Please fill in header details', '', {duration: 3000});
    this.findInvalidControls(form);
  }
}

// async updateErrors(errors: AttachmentError[]): Promise<void> {
//   await this.captureService.updateAttachmentErrors({
//     userID: this.currentUser.userID,
//     attachmentErrors: errors.map(x => {
//       return {
//         attachmentErrorID: x.attachmentErrorID
//       };
//      })
//   });
// }

ngOnDestroy(): void {}

overrideDialog(key: string, label) {
  this.dialog.open(DialogOverrideComponent, {
    width: '512px',
    data: {
      label
    }
  }).afterClosed().subscribe((val) => {
    if (val) {
      this.override(key, val);
    }
  });
}

override(key: string, reason: string) {
  this.form.controls[`${key}OBit`].setValue(true);
  this.form.controls[`${key}OReason`].setValue(reason);
  this.form.controls[key].setErrors(null);
}

undoOverride(key: string) {
  this.form.controls[`${key}OBit`].setValue(false);
  this.form.controls[`${key}OReason`].setValue(null);

  if (this.errors.length > 0) {
    this.errors.forEach((error) => {
      if (key.toUpperCase() === error.fieldName.toUpperCase()) {
        if (!this.form.controls[`${key}OBit`].value) {
          this.form.controls[key].setErrors({incorrect: true});
          this.form.controls[key].markAsTouched();
        }
      }
    });
  }
}
}
