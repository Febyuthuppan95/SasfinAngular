import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Input, ElementRef } from '@angular/core';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { CaptureService } from 'src/app/services/capture.service';
import { UserService } from 'src/app/services/user.Service';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { EventService } from 'src/app/services/event.service';
import { ObjectHelpService } from 'src/app/services/ObjectHelp.service';
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
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

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
              private router: Router,
              private location: Location) {}

form = new FormGroup({
  // Form Fields
  userID: new FormControl(null),
  customsReleaseID: new FormControl(null),
  fileRef: new FormControl(null),
  totalCustomsValue: new FormControl(null, [Validators.required]),
  totalDuty: new FormControl(null),
  serialNo: new FormControl(null),
  lrn: new FormControl(null, [Validators.required]),
  importersCode: new FormControl(null),
  pccID: new FormControl(null),
  fob: new FormControl(null),
  waybillNo: new FormControl(null, [Validators.required]),
  supplierRef: new FormControl(null),
  mrn: new FormControl(null, [Validators.required]),
  ediStatusID: new FormControl(null, [Validators.required]),
  attachmentStatusID: new FormControl(null),
  isDeleted: new FormControl(0),

  // Override Properties
  serialNoOBit: new FormControl(false),
  serialNoOReason: new FormControl(null),
  serialNoError: new FormControl(null),

  lrnOBit: new FormControl(false),
  lrnOReason: new FormControl(null),
  lrnError: new FormControl(null),

  importersCodeOBit: new FormControl(false),
  importersCodeOReason: new FormControl(null),
  importersCodeError: new FormControl(null),

  waybillNoOBit: new FormControl(false),
  waybillNoOReason: new FormControl(null),
  waybillNoError: new FormControl(null),

  fileRefOBit: new FormControl(false),
  fileRefOReason: new FormControl(null),
  fileRefError: new FormControl(null),

  totalCustomsValueOBit: new FormControl(false),
  totalCustomsValueOReason: new FormControl(null),
  totalCustomsValueError: new FormControl(null),

  totalDutyOBit: new FormControl(false),
  totalDutyOReason: new FormControl(null),
  totalDutyError: new FormControl(null),

  mrnOBit: new FormControl(false),
  mrnOReason: new FormControl(null),
  mrnError: new FormControl(null),
});

public attachmentLabel: string;
public transactionLabel: string;
public errors: any[] = [];
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

@ViewChild('startForm', { static: false })
private startForm: ElementRef;

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
// tslint:disable-next-line: max-line-length
public submissionEvent = (escalation, saveProgress, escalationResolved) => this.submit(this.form, escalation, saveProgress, escalationResolved);

ngOnInit() {}

ngAfterViewInit(): void {
  setTimeout(() => {
      this.shortcuts = [
        {
          key: 'alt + /',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: () => console.log('Deprecated')
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
            command: () => {
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
    crnID: this.attachmentID,
    transactionID: this.transactionID,
    filter: '',
    rowStart: 1,
    rowEnd: 15,
    orderBy: '',
    orderByDirection: '',
  };

  await this.captureService.customsReleaseGet(requestModel).then(async (res: CRNList) => {
    if (res.customs.length > 0) {
      const response: any = res.customs[0];
      response.customsReleaseID = res.customs[0].customReleaseID;
      response.attachmentStatusID = response.statusID;
      response.pccID = res.customs[0].pcc;

      this.form.patchValue(response);
      this.form.controls.userID.setValue(this.currentUser.userID);
      this.form.updateValueAndValidity();

      this.errors = res.attachmentErrors.attachmentErrors;

      Object.keys(this.form.controls).forEach(key => {
        this.errors.forEach((error) => {
          if (error.fieldName.toUpperCase() === 'TOTALCUSTOMSVALUE') {
            this.form.controls.totalCustomsValue.setErrors({incorrect: true});
            this.form.controls.totalCustomsValue.markAsTouched();
            this.form.controls.totalCustomsValueError.setValue(this.getError('totalCustomsValue'));
          }

          if (error.fieldName.toUpperCase() === 'TOTALDUTY') {
            this.form.controls.totalDuty.setErrors({incorrect: true});
            this.form.controls.totalDuty.markAsTouched();
            this.form.controls.totalDutyError.setValue(this.getError('totalDuty'));
          }

          if (error.fieldName.toUpperCase() === 'IMPORTERCODE') {
            this.form.controls.importersCode.setErrors({incorrect: true});
            this.form.controls.importersCode.markAsTouched();
            this.form.controls.importersCodeError.setValue(this.getError('importercode'));
          }

          if (error.fieldName.toUpperCase() === 'FILEREF') {
            this.form.controls.fileRef.setErrors({incorrect: true});
            this.form.controls.fileRef.markAsTouched();
            this.form.controls.fileRefError.setValue(this.getError('fileRef'));
          }

          if (error.fieldName.toUpperCase() === 'LRN') {
            this.form.controls.lrn.setErrors({incorrect: true});
            this.form.controls.lrn.markAsTouched();
            this.form.controls.lrnError.setValue(this.getError('lrn'));
          }

          if (error.fieldName.toUpperCase() === 'MRN') {
            this.form.controls.mrn.setErrors({incorrect: true});
            this.form.controls.mrn.markAsTouched();
            this.form.controls.mrnError.setValue(this.getError('mrn'));
          }

          if (error.fieldName.toUpperCase() === 'WAYBILLNO') {
            this.form.controls.waybillNo.setErrors({incorrect: true});
            this.form.controls.waybillNo.markAsTouched();
            this.form.controls.waybillNoError.setValue(this.getError('waybillNo'));
          }

          if (error.fieldName.toUpperCase() === 'SERIALNO') {
            this.form.controls.serialNo.setErrors({incorrect: true});
            this.form.controls.serialNo.markAsTouched();
            const error = this.getError('serialNo');
            this.form.controls.serialNoError.setValue(error);
          }
        });
      });

      setTimeout(() => this.loader = false, 100);
    } else {
      this.loader = false;
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

            if (this.currentUser.designation === 'Consultant') {
              this.router.navigate(['escalations']);
            } else {
              this.location.back();
            }
          }

        } else {
          this.notify.errorsmsg(res.outcome, res.outcomeMessage);
        }
    },
      (msg) => {
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
    autoFocus: true,
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
