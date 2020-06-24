import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { SAD500Get } from 'src/app/models/HttpResponses/SAD500Get';
import { CaptureService } from 'src/app/services/capture.service';
import { UserService } from 'src/app/services/user.Service';
import { SPSAD500LineList } from 'src/app/models/HttpResponses/SAD500Line';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { EventService } from 'src/app/services/event.service';
import { ShortcutInput, KeyboardShortcutsComponent, AllowIn } from 'ng-keyboard-shortcuts';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { SubmitDialogComponent } from 'src/app/layouts/capture-layout/submit-dialog/submit-dialog.component';
import { ObjectHelpService } from 'src/app/services/ObjectHelp.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { UUID } from 'angular2-uuid';
import { DialogOverrideComponent } from '../dialog-override/dialog-override.component';
import { VOCListResponse } from 'src/app/models/HttpResponses/VOC';
import { CompanyService } from 'src/app/services/Company.Service';
import { Router } from '@angular/router';

@AutoUnsubscribe()
@Component({
  selector: 'app-form-sad500-updated',
  templateUrl: './form-sad500-updated.component.html',
  styleUrls: ['./form-sad500-updated.component.scss'],
})
export class FormSad500UpdatedComponent implements OnInit, OnDestroy, AfterViewInit {
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

  public form: FormGroup;
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

  private attachmentID: number;
  private transactionID: number;
  private currentUser = this.userService.getCurrentUser();
  private dialogOpen = false;
  private originalSAD500ID: number;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild(KeyboardShortcutsComponent, { static: true })
  private keyboard: KeyboardShortcutsComponent;

  ngOnInit() {
    this.form = new FormGroup({
      userID: new FormControl(this.currentUser.userID, [Validators.required]),
      SAD500ID: new FormControl(null, [Validators.required]),
      serialNo: new FormControl(null, [Validators.required]),
      lrn: new FormControl(null, [Validators.required]),
      totalCustomsValue: new FormControl(0, [Validators.required]),
      cpcID: new FormControl(null, [Validators.required]),
      waybillNo: new FormControl(null, [Validators.required]),
      supplierRef: new FormControl(null, [Validators.required]),
      mrn: new FormControl(null, [Validators.required]),
      attachmentStatusID: new FormControl(null),
      importersCode: new FormControl(null, [Validators.required]),
      fileRef: new FormControl(null, [Validators.required]),
      totalDuty: new FormControl(0, [Validators.required]),
      lrnOBit: new FormControl(false),
      lrnOUserID: new FormControl(null),
      lrnODate: new FormControl(null),
      lrnOReason: new FormControl(null),
      mrnOBit: new FormControl(false),
      mrnOUserID: new FormControl(null),
      mrnODate: new FormControl(null),
      mrnOReason: new FormControl(null),
      importersCodeOBit: new FormControl(false),
      importersCodeOUserID: new FormControl(null),
      importersCodeODate: new FormControl(null),
      importersCodeOReason: new FormControl(null),
      fileRefOBit: new FormControl(false),
      fileRefOUserID: new FormControl(null),
      fileRefODate: new FormControl(null),
      fileRefOReason: new FormControl(null),
      totalDutyOBit: new FormControl(false),
      totalDutyOUserID: new FormControl(null),
      totalDutyODate: new FormControl(null),
      totalDutyOReason: new FormControl(null),
      isDeleted: new FormControl(0),

      // VOC
      vocID: new FormControl(null),
      referenceNo: new FormControl(null),
      reason: new FormControl(null),
    });

    this.transactionService.observerCurrentAttachment()
    .subscribe((capture: any) => {
      if (capture) {
        this.attachmentID = capture.attachmentID;
        this.transactionID = capture.transactionID;
        this.attachmentLabel = capture.docType;
        this.transactionLabel = capture.transactionType;
        if (capture.docType === 'VOC') {
          this.isVOC = true;
          this.form.controls.referenceNo.setValidators([Validators.required]);
          this.form.controls.reason.setValidators([Validators.required]);
          this.form.updateValueAndValidity();
          this.load();
        } else {
          this.load();
        }
      }
    });

    this.eventService.observeCaptureEvent()
    .subscribe((escalation?: boolean) => this.submit(this.form, escalation));
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
    if (this.isVOC) {
      const vocRequest = {
        userID: this.currentUser.userID,
        vocID: this.attachmentID,
        transactionID: this.transactionID,
        filter: '',
        orderBy: '',
        orderByDirection: '',
        rowStart: 1,
        rowEnd: 10
      };

      await this.captureService.vocList(vocRequest).then(
        (res: VOCListResponse) => {
          console.log(res);
          if (res.rowCount !== 0) {
            console.log(res.vocs[0]);
            this.originalSAD500ID = res.vocs[0].originalID;
            this.form.controls.referenceNo.setValue(res.vocs[0].referenceNo);
            this.form.controls.reason.setValue(res.vocs[0].reason);
            this.form.controls.vocID.setValue(res.vocs[0].vocID);
            this.form.controls.SAD500ID.setValue(res.vocs[0].sad500ID);
          } else {
            this.notify.errorsmsg('FAILURE', 'Could not retrieve SAD500 record');
          }
        },
        (msg) => {
          this.notify.errorsmsg('FAILURE', 'Could not retrieve SAD500 record');
        });
    }

    const request = {
      userID: this.currentUser.userID,
      specificID: this.isVOC ? this.form.controls.SAD500ID.value : this.attachmentID,
      transactionID: this.transactionID,
      fileType: this.attachmentLabel === 'VOC' ? 'VOC' : 'SAD',
    };

    this.captureService.sad500Get(request).then(async (res: SAD500Get) => {
      const response: any = res;
      console.log(response);
      response.userID = request.userID;
      response.cpcID = response.cpc;
      response.SAD500ID = request.specificID;
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
      await this.loadLines();
    });
  }

  async loadLines() {
    const requestModel = {
      userID: this.currentUser.userID,
      transactionID: this.transactionID,
      sad500ID: this.isVOC ? this.originalSAD500ID : this.attachmentID,
      specificSAD500LineID: -1,
      filter:  '',
      orderBy: '',
      orderByDirection: '',
      rowStart: 1,
      rowEnd: 1000000,
    };

    this.captureService.sad500LineList(requestModel).then(
      (res: SPSAD500LineList) => {
        this.lines = res.lines;
        this.lines.forEach((line) => {
          line.isLocal = false;
          line.specificSAD500LineID = line.sad500LineID;
          line.sad500ID = this.form.controls.SAD500ID.value;
          line.uniqueIdentifier = UUID.UUID();
          line.errors = res.attachmentErrors.attachmentErrors.filter(x => x.attachmentID === line.sad500LineID);
        });

        if (this.lines.length > 0) {
            this.activeLine = this.lines[this.activeIndex];
        }
      });
  }

  getError(key: string): string {
    return this.errors.find(x => x.fieldName.toUpperCase() === key.toUpperCase()).errorDescription;
  }

  async submit(form: FormGroup, escalation?: boolean) {
    if ((form.valid && this.lines.length > 0) || escalation) {
      const requestModel = form.value;
      requestModel.attachmentStatusID = 3;

      if (this.isVOC) {
        const vocRequest = {
          userID: this.currentUser.userID,
          vocID: requestModel.vocID,
          referenceNo: requestModel.referenceNo,
          reason: requestModel.reason,
          mrn: requestModel.mrn,
          isDeleted: false,
          attachmentStatusID: 3,
        };

        console.log(vocRequest);

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
      }

      await this.captureService.sad500Update(requestModel).then(
        async (res: Outcome) => {
          await this.saveLines(this.lines, async (line) => {
            let sad500LineID = line.sad500LineID;
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
              await this.saveLineDuty(line.duties.filter(x => x.isLocal === true), async (duty) => {
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
            this.notify.successmsg(res.outcome, res.outcomeMessage);
            this.companyService.setCapture({ capturestate: true });
            this.router.navigateByUrl('transaction/capturerlanding');
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
    const target = this.lines.find(x => x.uniqueIdentifier === $event.uniqueIdentifier);
    $event.userID = this.currentUser.userID;

    if (!target) {
      $event.isLocal = true;
      this.lines.push($event);
      this.snackbar.open('Line added to queue', '', {duration: 3000});
    } else {
      $event.isLocal = false;
      const original = this.lines[this.lines.indexOf(target)];
      $event.specificSAD500LineID = original.specificSAD500LineID;
      $event.sad500LineID = original.specificSAD500LineID;
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
      this.activeLine = this.lines[this.activeIndex];
    }
  }

  nextLine() {
    if (this.activeIndex < this.lines.length - 1) {
      this.activeIndex++;
      this.activeLine = this.lines[this.activeIndex];

    }

    if (this.activeIndex === -1) {
      this.activeIndex++;
      this.activeLine = this.lines[this.activeIndex];
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

    this.lines.splice(this.lines.indexOf(targetLine), 1);
    this.activeLine = null;
    this.activeIndex = -1;
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
  overrideDialog(key, label) {
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