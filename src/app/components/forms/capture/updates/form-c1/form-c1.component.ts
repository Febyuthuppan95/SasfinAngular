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
import { FormC1LinesComponent } from './form-c1-lines/form-c1-lines.component';
import { SubmitDialogComponent } from 'src/app/layouts/capture-layout/submit-dialog/submit-dialog.component';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { ListReadResponse } from '../../form-invoice/form-invoice-lines/form-invoice-lines.component';
import { DialogOverrideComponent } from '../../dialog-override/dialog-override.component';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-form-c1',
  templateUrl: './form-c1.component.html',
  styleUrls: ['./form-c1.component.scss']
})
export class FormC1Component implements OnInit, OnDestroy, AfterViewInit {
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
              private apiService: ApiService) {}

  public form = new FormGroup({
    userID: new FormControl(null),
    SupplierC1ID: new FormControl(null, [Validators.required]),
    PeriodYear: new FormControl(null, [Validators.required]),
    QuarterID: new FormControl(null, [Validators.required]),
    CompanyID: new FormControl(null, [Validators.required]),
    SupplierName: new FormControl(null, [Validators.required])
  });

  public attachmentLabel: string;
  public transactionLabel: string;
  public lines: any[];
  public activeLine: any;
  public activeIndex = 0;
  public displayLines = false;
  public errors: any[] = [];
  public shortcuts: ShortcutInput[];
  public help = false;
  public isVOC = false;
  public isExport = false;
  public paginationControl = new FormControl(1);
  public loader = true;

  private attachmentID: number;
  private transactionID: number;
  private currentUser = this.userService.getCurrentUser();
  private dialogOpen = false;
  private originalSAD500ID: number;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild(KeyboardShortcutsComponent, { static: true })
  private keyboard: KeyboardShortcutsComponent;

  @ViewChild('lineForm', { static: false })
  private lineForm: FormC1LinesComponent;

  @Input() capture: any;

  public init() {
    if (this.capture) {
      this.attachmentID = this.capture.attachmentID;
      this.transactionID = this.capture.transactionID;
      this.attachmentLabel = this.capture.docType;
      this.transactionLabel = this.capture.transactionType;
      this.load();
    }
  }
  public submissionEvent = (escalation, saveProgress, escalationResolved) => this.submit(this.form, escalation, saveProgress, escalationResolved);

  ngOnInit() {
    this.paginationControl.valueChanges.subscribe((value) => {
      if (value && value !== null && value == '') {
        if (value > this.lines.length) {
          value = this.lines.length;
          this.paginationControl.setValue(this.lines.length);
        } else if (value <= 0) {
          this.paginationControl.setValue(1);
        } else {
          this.activeIndex = value - 1;
          this.activeLine = this.lines[this.activeIndex];
        }
      } else {
        this.paginationControl.setValue(1);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
        this.shortcuts = [
          {
            key: 'alt + .',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => this.nextLine()
          },
          {
            key: 'alt + ,',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => this.prevLine()
          },
          {
            key: 'alt + /',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => alert('Focus form')
          },
          {
            key: 'alt + m',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => {
              this.activeLine = null;
              this.activeIndex = -1;
            }
          },
          {
            key: 'alt + n',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => {
              this.activeLine = null;
              this.activeIndex = -1;
            }
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
            key: 'alt + l',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => {
              this.displayLines = !this.displayLines;
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
              key: 'alt + a',
              preventDefault: true,
              allowIn: [AllowIn.Textarea, AllowIn.Input],
              command: e => {
                if (this.displayLines) {
                  this.eventService.submitLines.next();
                }
              }
            }];
    });
  }

  public findInvalidControls(form: FormGroup) {
    const invalid = [];
    const controls = form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }

    console.log(invalid);
  }

  async load() {
 

    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        SupplierC1ID: this.attachmentID,
        TransactionID: this.transactionID,
      },
      requestProcedure: 'SupplierC1List'
    };
    console.log(model);
    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/536/read`, model).then(
      async (res: ListReadResponse) => {
      this.loader = false;

      if (res.data !== null) {
      const response: SupplierC1 = res.data[0];
      console.log(response);
      // response.SupplierName = request.userID;
      // response.cpcID = response.cpc;
      // response.SAD500ID = request.specificID;
      // response.attachmentStatusID = response.statusID;

      this.form.patchValue(response);
      this.form.controls.userID.setValue(this.currentUser.userID);
      // this.errors = res.attachmentErrors.attachmentErrors;

      // Object.keys(this.form.controls).forEach(key => {
      //   if (key.indexOf('ODate') !== -1) {
      //     if (this.form.controls[key].value !== null || this.form.controls[key].value) {
      //       this.form.controls[key].setValue(null);
      //     }
      //   }
      // });

      // if (res.attachmentErrors.attachmentErrors.length > 0) {
      //   Object.keys(this.form.controls).forEach(key => {
      //     res.attachmentErrors.attachmentErrors.forEach((error) => {
      //       if (key.toUpperCase() === error.fieldName.toUpperCase()) {
      //         this.form.controls[key].setErrors({incorrect: true});
      //         this.form.controls[key].markAsTouched();
      //       }
      //     });
      //   });
      // }

      this.form.updateValueAndValidity();
      await this.loadLines();
    } else {
      this.snackbar.open('Failed to retrieve capture data', '', { duration: 3000 });
    }
    }, (err) => {
      this.loader = false;
    });
  }

  async loadLines() {

    const model = {
      requestParams: {
        userID: this.currentUser.userID,
      SupplierC1ID: this.form.controls.SupplierC1ID.value,
      transactionID: this.transactionID,
      filter:  '',
      orderBy: '',
      orderByDirection: '',
      rowStart: 1,
      rowEnd: 1000000,
      },
      requestProcedure: 'SupplierC1LinesList'
    };
    console.log(model);
    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/536/read`, model).then(
      async (res: ListReadResponse) => {
        this.lines = res.data;
        this.lines.forEach((line) => {
          line.isLocal = true;
          line.SupplierC1LineID = line.SupplierC1LineID;
          line.SupplierC1ID = this.form.controls.SupplierC1ID.value,
          line.uniqueIdentifier = UUID.UUID();
        });

        if (this.lines.length > 0) {
          this.activeIndex = 0;
          this.activeLine = this.lines[this.activeIndex];
          this.paginationControl.setValue(1, { emitEvent: false });
        } else {
          this.lines = [];
          this.newLine();
        }
      });
  }

  // getError(key: string): string {
  //   return this.errors.find(x => x.fieldName.toUpperCase() === key.toUpperCase()).errorDescription;
  // }

  /**TODO */
  async submit(form: FormGroup, escalation?: boolean, saveProgress?: boolean, escalationResolved?: boolean) {
    form.markAllAsTouched();

    if ((form.valid && this.lines.length > 0) || escalation) {
      const requestModel = form.value;
      requestModel.attachmentStatusID = escalation ? 7 : (escalationResolved ? 8 : (saveProgress && requestModel.attachmentStatusID === 7 ? 7 : (saveProgress ? 2 : 3)));
      requestModel.userID = this.currentUser.userID;

      if (this.isVOC) {
        const vocRequest = {
          userID: this.currentUser.userID,
          vocID: requestModel.vocID,
          referenceNo: requestModel.referenceNo,
          reason: requestModel.reason,
          mrn: requestModel.mrn,
          isDeleted: false,
          attachmentStatusID: escalation ? 7 : 3,
        };

        await this.captureService.vocUpdate(vocRequest).then(
          (res: Outcome) => {
            if (res.outcome === 'SUCCESS') {
              this.notify.successmsg(res.outcome, res.outcomeMessage);
            } else {
              this.notify.errorsmsg(res.outcome, res.outcomeMessage);
            }
          },
          (msg) => {
            this.notify.errorsmsg('Failure', 'Cannot reach server');
          }
        );
      }

      if (!this.isVOC) {
        delete requestModel.vocID;
        delete requestModel.referenceNo;
        delete requestModel.reason;
        delete requestModel.originalID;
        delete requestModel.replacedByID;
      }

      console.log(requestModel);

      await this.captureService.sad500Update(requestModel).then(
        async (res: Outcome) => {
          await this.saveLines(this.lines, async (line) => {
            let sad500LineID = line.specificSAD500LineID;
            line.isDeleted = 0;
            line.sad500ID = this.isVOC ? this.originalSAD500ID : form.controls.SAD500ID.value;
            line.userID = this.currentUser.userID;

            if (line.isLocal) {
              await this.captureService.sad500LineAdd(line).then((res: any) =>  {
                console.log(res); sad500LineID = res.createdID; }, (msg) => console.log(JSON.stringify(msg)));
            } else {
              await this.captureService.sad500LineUpdate(line).then((res) => console.log(res), (msg) => console.log(JSON.stringify(msg)));
            }

            if (line.duties && sad500LineID !== null && sad500LineID) {
              const duties = line.duties.filter(x => x.isLocal === true);

              console.log(duties);
              await this.saveLineDuty(duties, async (duty) => {
                const dutyRequest = {
                  userID: this.currentUser.userID,
                  dutyID: duty.dutyTaxTypeID,
                  sad500LineID,
                  value: duty.value
                };

                // tslint:disable-next-line: max-line-length
                await this.captureService.sad500LineDutyAdd(dutyRequest)
                .then(
                  (res) => console.log(res),
                  (msg) => console.log(JSON.stringify(msg)));
              });
            }
          });

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
        (msg) => console.log(JSON.stringify(msg))
      );
    } else {
      this.snackbar.open('Please fill in header details as well as have at least one line', '', {duration: 3000});
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

  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
  }

  toggelHelpBar() {
    this.help = !this.help;
    this.objectHelpService.toggleHelp(this.help);
  }

  // [Line Controls]
  queueLine($event: any) {
    let target = null;

    if (this.lines) {
      if (this.lines.length > 0) {
        target = this.lines.find(x => x.uniqueIdentifier === $event.uniqueIdentifier);
      }
    } else {
      this.lines = [];
    }

    $event.userID = this.currentUser.userID;

    if (!target) {
      $event.isLocal = true;
      this.lines.push($event);
      this.snackbar.open('Line added to queue', '', {duration: 3000});
    } else {
      $event.isLocal = false;
      const original = this.lines[this.lines.indexOf(target)];
      $event.specificSAD500LineID = original.specificSAD500LineID;
      $event.sad500ID = this.isVOC ? this.originalSAD500ID : original.SAD500ID;

      if (this.isVOC) {
        $event.originalLineID = original.specificSAD500LineID;
      }

      this.lines[this.lines.indexOf(target)] = $event;
      this.snackbar.open('Line queued to update', '', {duration: 3000});
    }

    this.cancelLine();
  }

  async saveLineDuty(duties: any, callback) {
    for (let index = 0; index < duties.length; index++) {
      await callback(duties[index], index, duties);
    }
  }

  async saveLines(lines: any[], callback) {
    for (let index = 0; index < lines.length; index++) {
      await callback(lines[index], index, lines);
    }
  }

  prevLine() {
    if (this.activeIndex >= 1) {
      this.activeIndex--;
      this.lineForm.resetForm();
      this.activeLine = this.lines[this.activeIndex];
      this.paginationControl.setValue(this.activeIndex + 1, { emitEvent: false });

      this.displayLines = false;
      this.loader = true;
      setTimeout(() => {
        this.displayLines = true;
        this.loader = false;
      }, 1000);
    }
  }

  nextLine() {
    if (this.activeIndex < this.lines.length) {
      this.activeIndex++;
      this.lineForm.resetForm();
      this.activeLine = this.lines[this.activeIndex];
      this.paginationControl.setValue(this.activeIndex + 1, { emitEvent: false });

      this.displayLines = false;
      this.loader = true;
      setTimeout(() => {
        this.displayLines = true;
        this.loader = false;
      }, 1000);
    }
  }

  specificLine(index: number) {
    this.activeLine = this.lines[index];
  }

  newLine() {
    this.activeLine = null;
    this.activeIndex = -1;
  }

  async deleteLine() {
    const targetLine = this.lines[this.activeIndex];
    targetLine.isDeleted = 1;
    targetLine.saD500ID = this.form.controls.SAD500ID.value;

    if (!targetLine.isLocal) {
      await this.captureService.sad500LineUpdate(targetLine);
    }

    if (this.lines.length === 1) {
      this.lines = [];
      this.activeLine = null;
      this.activeIndex = -1;
      this.paginationControl.setValue(1, { emitEvent: false });
    } else {
      this.lines.splice(this.lines.indexOf(targetLine), 1);
      this.activeIndex = 0;
      this.activeLine = this.lines[this.activeIndex];
      this.paginationControl.setValue(1, { emitEvent: false });
    }
  }

  async deleteDuty() {
    const targetLine = this.lines.find(x => x !== this.lines[this.activeIndex]);
    targetLine.isDeleted = 1;
    targetLine.saD500ID = this.form.controls.SAD500ID.value;

    if (!targetLine.isLocal) {
      await this.captureService.sad500LineUpdate(targetLine);
    }

    this.lines.splice(this.lines.indexOf(targetLine), 1);
    this.activeLine = null;
    this.activeIndex = -1;
  }

  cancelLine() {
    this.activeLine = null;
    this.activeIndex = 0;
    this.activeLine = this.lines[this.activeIndex];
  }

  ngOnDestroy(): void {}

  // @override methods
  // overrideDialog(key, label) {
  //   this.dialog.open(DialogOverrideComponent, {
  //     width: '512px',
  //     data: {
  //       label
  //     }
  //   }).afterClosed().subscribe((val) => {
  //     if (val) {
  //       this.override(key, val);
  //     }
  //   });
  // }

  // override(key: string, reason: string) {
  //   this.form.controls[`${key}OUserID`].setValue(this.currentUser.userID);
  //   this.form.controls[`${key}ODate`].setValue(new Date());
  //   this.form.controls[`${key}OBit`].setValue(true);
  //   this.form.controls[`${key}OReason`].setValue(reason);
  //   this.form.controls[key].setErrors(null);
  // }

  // undoOverride(key: string) {
  //   this.form.controls[`${key}OUserID`].setValue(null);
  //   this.form.controls[`${key}ODate`].setValue(new Date());
  //   this.form.controls[`${key}OBit`].setValue(false);
  //   this.form.controls[`${key}OReason`].setValue(null);

  //   if (this.errors.length > 0) {
  //     this.errors.forEach((error) => {
  //       if (key.toUpperCase() === error.fieldName.toUpperCase()) {
  //         this.form.controls[key].setErrors({incorrect: true});
  //         this.form.controls[key].markAsTouched();
  //       }
  //     });
  //   }
  // }
}


export class SupplierC1 {
  TransactionID: number;
  CompanyID: number;
  SupplierName: string;
  CertificateNo: string;
  AttachmentStatusID: number;
  AttachmentStatus: string;
}

export class SupplierC1Line {
  LineNo: number;
  ItemID: number;
  ItemName: string;
  ItemDescription: string;
  UOM: string;
  UOMID: number;
  UnitPrice: number;
  ImportedComponentValue?: number;
}