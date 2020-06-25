import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Input } from '@angular/core';
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
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';
import { DialogOverrideComponent } from '../../dialog-override/dialog-override.component';
import { CRNList } from 'src/app/models/HttpResponses/CRNGet';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@AutoUnsubscribe()
@Component({
  selector: 'app-form-crn',
  templateUrl: './form-crn.component.html',
  styleUrls: ['./form-crn.component.scss']
})
export class FormCrnComponent implements OnInit, AfterViewInit, OnDestroy {
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
  customsReleaseID: new FormControl(null, [Validators.required]),
  fileRef: new FormControl(null),
  totalCustomsValue: new FormControl(null, [Validators.required]),
  totalDuty: new FormControl(null),
  serialNo: new FormControl(null),
  lrn: new FormControl(null, [Validators.required]),
  importersCode: new FormControl(null),
  pcc: new FormControl(null),
  fob: new FormControl(null),
  waybillNo: new FormControl(null, [Validators.required]),
  supplierRef: new FormControl(null),
  mrn: new FormControl(null, [Validators.required]),
  ediStatusID: new FormControl(null, [Validators.required]),
  attachmentStatusID: new FormControl(null),
  isDeleted: new FormControl(0),
  serialNoOBit: new FormControl(null),
  serialNoOUserID: new FormControl(null),
  serialNoODate: new FormControl(null),
  serialNoOReason: new FormControl(null),
  lrnOBit: new FormControl(null),
  lrnOUserID: new FormControl(null),
  lrnODate: new FormControl(null),
  lrnOReason: new FormControl(null),
  importersCodeOBit: new FormControl(null),
  importersCodeOUserID: new FormControl(null),
  importersCodeODate: new FormControl(null),
  importersCodeOReason: new FormControl(null),
  pccOBit: new FormControl(null),
  pccOUserID: new FormControl(null),
  pccODate: new FormControl(null),
  pccOReason: new FormControl(null),
  fobOBit: new FormControl(null),
  fobOUserID: new FormControl(null),
  fobODate: new FormControl(null),
  fobOReason: new FormControl(null),
  waybillNoOBit: new FormControl(null),
  waybillNoOUserID: new FormControl(null),
  waybillNoODate: new FormControl(null),
  waybillNoOReason: new FormControl(null),
  fileRefOBit: new FormControl(null),
  fileRefOUserID: new FormControl(null),
  fileRefODate: new FormControl(null),
  fileRefOReason: new FormControl(null),
  totalCustomsValueOBit: new FormControl(null),
  totalCustomsValueOUserID: new FormControl(null),
  totalCustomsValueODate: new FormControl(null),
  totalCustomsValueOReason: new FormControl(null),
  totalDutyOBit: new FormControl(null),
  totalDutyOUserID: new FormControl(null),
  totalDutyODate: new FormControl(null),
  totalDutyOReason: new FormControl(null),
  mrnOBit: new FormControl(null),
  mrnOUserID: new FormControl(null),
  mrnODate: new FormControl(null),
  mrnOReason: new FormControl(null),
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
private $unsubscribe = new Subject();

@ViewChild(NotificationComponent, { static: true })
private notify: NotificationComponent;

@Input() capture: any;

public init() {
  if (this.capture) {
    this.attachmentID = this.capture.attachmentID;
    this.transactionID = this.capture.transactionID;
    this.attachmentLabel = 'Customs Release Notification';
    this.transactionLabel = this.capture.transactionType;
    this.load();
  }
}
public submissionEvent = (escalation, saveProgress, escalationResolved) => this.submit(this.form, escalation, saveProgress, escalationResolved);

ngOnInit() {
  // this.transactionService.observerCurrentAttachment()
  // .pipe(takeUntil(this.$unsubscribe))
  // .subscribe((capture: any) => {
  //   if (capture) {
  //     this.attachmentID = capture.attachmentID;
  //     this.transactionID = capture.transactionID;
  //     this.attachmentLabel = 'Customs Release Notification';
  //     this.transactionLabel = capture.transactionType;
  //     this.load();
  //   }
  // });

  // this.eventService.observeCaptureEvent()
  // .pipe(takeUntil(this.$unsubscribe))
  // .subscribe((escalation?: boolean) => this.submit(this.form, escalation));
}

ngAfterViewInit(): void {
  setTimeout(() => {
      this.shortcuts = [
        {
          key: 'alt + /',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: () => alert('Focus form')
        },
        {
          key: 'alt + s',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: () => {
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
            command: () => {
              this.toggelHelpBar();
            }
        }];
  });
}

async load() {
  const requestModel = {
    userID: this.currentUser.userID,
    crnID: this.attachmentID,
    transactionID: this.transactionID,
    filter: '',
    rowStart: 1,
    rowEnd: 15,
    orderBy: '',
    orderByDirection: '',
  };

  await this.captureService.customsReleaseGet(requestModel).then(async (res: CRNList) => {
    const response: any = res.customs[0];
    response.customsReleaseID = res.customs[0].customReleaseID;
    response.attachmentStatusID = response.statusID;
    response.pcc = res.customs[0].pcc;

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

async submit(form: FormGroup, escalation?: boolean, saveProgress?: boolean, escalationResolved?: boolean) {
  form.markAllAsTouched();

  if (form.valid || escalation) {
    const requestModel: any = form.value;
    requestModel.attachmentStatusID = escalation ? 7 : (escalationResolved ? 8 : (saveProgress && requestModel.attachmentStatusID === 7 ? 7 : (saveProgress ? 2 : 3)));
    requestModel.userID = this.currentUser.userID;

    this.transactionService.customsReleaseUpdate(requestModel).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          if (saveProgress) {
            this.snackbar.open('Progress Saved', '', { duration: 3000 });
            this.load();
          } else {
            this.notify.successmsg(res.outcome, res.outcomeMessage);
            this.companyService.setCapture({ capturestate: true });
            this.router.navigateByUrl('transaction/capturerlanding');
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

ngOnDestroy(): void {
  console.log('Destroyed CRN');
  this.$unsubscribe.complete();
}

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
