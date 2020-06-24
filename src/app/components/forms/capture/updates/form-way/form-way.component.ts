import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { CaptureService } from 'src/app/services/capture.service';
import { UserService } from 'src/app/services/user.Service';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { EventService } from 'src/app/services/event.service';
import { ObjectHelpService } from 'src/app/services/ObjectHelp.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CompanyService } from 'src/app/services/Company.Service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShortcutInput, KeyboardShortcutsComponent, AllowIn } from 'ng-keyboard-shortcuts';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { SubmitDialogComponent } from 'src/app/layouts/capture-layout/submit-dialog/submit-dialog.component';
import { ICIListResponse } from 'src/app/models/HttpResponses/ICI';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';
import { DialogOverrideComponent } from '../../dialog-override/dialog-override.component';
import { WaybillListResponse } from 'src/app/models/HttpResponses/Waybill';

@Component({
  selector: 'app-form-way',
  templateUrl: './form-way.component.html',
  styleUrls: ['./form-way.component.scss']
})
export class FormWayComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private transactionService: TransactionService,
              private captureService: CaptureService,
              private userService: UserService,
              private snackbarService: HelpSnackbar,
              private eventService: EventService,
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
  waybillNoOUserID: new FormControl(null),
  waybillNoODate: new FormControl(null),
  waybillNoOReason: new FormControl(null),
});

public attachmentLabel: string;
public transactionLabel: string;
public errors: any[] = [];
public shortcuts: ShortcutInput[];
public help = false;

private attachmentID: number;
private transactionID: number;
private currentUser = this.userService.getCurrentUser();
private dialogOpen = false;

@ViewChild(NotificationComponent, { static: true })
private notify: NotificationComponent;

@ViewChild(KeyboardShortcutsComponent, { static: true })
private keyboard: KeyboardShortcutsComponent;

ngOnInit() {
  this.transactionService.observerCurrentAttachment()
  .subscribe((capture: any) => {
    if (capture) {
      this.attachmentID = capture.attachmentID;
      this.transactionID = capture.transactionID;
      this.attachmentLabel = 'Waybill';
      this.transactionLabel = capture.transactionType;
      this.load();
    }
  });

  this.eventService.observeCaptureEvent()
  .subscribe((escalation?: boolean) => this.submit(this.form, escalation));
}

ngAfterViewInit(): void {
  setTimeout(() => {
      this.shortcuts = [
        {
          key: 'alt + /',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => alert('Focus form')
        },
        {
          key: 'alt + s',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => {
              {
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
          }
        },
        {
            key: 'ctrl + alt + h',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => {
              this.toggelHelpBar();
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
    const response: any = res.waybills[0];
    response.waybillID = res.waybills[0].waybillID;
    response.attachmentStatusID = response.statusID;

    this.form.patchValue(response);
    this.form.controls.userID.setValue(this.currentUser.userID);
    this.errors = res.attachmentErrors.attachmentErrors;

    if (res.attachmentErrors.attachmentErrors.length > 0) {
      Object.keys(this.form.controls).forEach(key => {
        res.attachmentErrors.attachmentErrors.forEach((error) => {
          if (key.toUpperCase() === error.fieldName.toUpperCase()) {
            this.form.controls[key].setErrors({incorrect: true});
            this.form.controls[key].markAsTouched();
          }
        });
      });
    }

    this.form.updateValueAndValidity();
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
  return this.errors.find(x => x.fieldName.toUpperCase() === key.toUpperCase()).errorDescription;
}

async submit(form: FormGroup, escalation?: boolean) {
  form.markAllAsTouched();

  if (form.valid || escalation) {
    const requestModel: any = form.value;
    requestModel.attachmentStatusID = escalation ? 7 : 3;

    this.captureService.waybillUpdate(requestModel).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
        this.notify.successmsg(res.outcome, res.outcomeMessage);
        this.companyService.setCapture({ capturestate: true });
        this.router.navigateByUrl('transaction/capturerlanding');
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
  this.form.controls[`${key}OUserID`].setValue(this.currentUser.userID);
  this.form.controls[`${key}ODate`].setValue(new Date());
  this.form.controls[`${key}OBit`].setValue(true);
  this.form.controls[`${key}OReason`].setValue(reason);
  this.form.controls[key].setErrors(null);
}

undoOverride(key: string) {
  this.form.controls[`${key}OUserID`].setValue(null);
  this.form.controls[`${key}ODate`].setValue(new Date());
  this.form.controls[`${key}OBit`].setValue(false);
  this.form.controls[`${key}OReason`].setValue(null);

  if (this.errors.length > 0) {
    this.errors.forEach((error) => {
      if (key.toUpperCase() === error.fieldName.toUpperCase()) {
        this.form.controls[key].setErrors({incorrect: true});
        this.form.controls[key].markAsTouched();
      }
    });
  }
}
}
