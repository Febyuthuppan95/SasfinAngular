import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, Input, ElementRef } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UUID } from 'angular2-uuid';
import { VOCListResponse } from 'src/app/models/HttpResponses/VOC';
import { CompanyService } from 'src/app/services/Company.Service';
import { Router } from '@angular/router';
import { DialogOverrideComponent } from '../../dialog-override/dialog-override.component';
import { FormSad500LineUpdatedComponent } from './form-sad500-line-updated/form-sad500-line-updated.component';
import {DeletelineDialogComponent} from '../../../../../layouts/capture-layout/deleteline-dialog/deleteline-dialog.component';
import { Location } from '@angular/common';
import { DialogGotoLineComponent } from '../../dialog-goto-line/dialog-goto-line.component';

@AutoUnsubscribe()
@Component({
  selector: 'app-form-sad500-updated',
  templateUrl: './form-sad500-updated.component.html',
  styleUrls: ['./form-sad500-updated.component.scss'],
})
export class FormSad500UpdatedComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private captureService: CaptureService,
              private userService: UserService,
              private snackbarService: HelpSnackbar,
              private eventService: EventService,
              private objectHelpService: ObjectHelpService,
              private dialog: MatDialog,
              private snackbar: MatSnackBar,
              private companyService: CompanyService,
              private router: Router,
              private location: Location) {}

  public form = new FormGroup({
    userID: new FormControl(null),
    SAD500ID: new FormControl(null),
    serialNo: new FormControl(null, [Validators.required]),
    lrn: new FormControl(null, [Validators.required]),
    totalCustomsValue: new FormControl(null, [Validators.required]),
    cpcID: new FormControl(-1, [Validators.required]),
    waybillNo: new FormControl(null, [Validators.required]),
    supplierRef: new FormControl(null),
    mrn: new FormControl(null, [Validators.required]),
    attachmentStatusID: new FormControl(null),
    importersCode: new FormControl(null, [Validators.required]),
    fileRef: new FormControl(null),
    containerNumbers: new FormControl(null),
    transAtArrival: new FormControl(null),
    totalDuty: new FormControl(null),

    lrnOBit: new FormControl(false),
    lrnOReason: new FormControl(null),

    mrnOBit: new FormControl(false),
    mrnOReason: new FormControl(null),

    importersCodeOBit: new FormControl(false),
    importersCodeOReason: new FormControl(null),

    fileRefOBit: new FormControl(false),
    fileRefOReason: new FormControl(null),

    totalDutyOBit: new FormControl(false),
    totalDutyOReason: new FormControl(null),

    totalCustomsValueOBit: new FormControl(false),
    totalCustomsValueOReason: new FormControl(null),

    serialNoOBit: new FormControl(false),
    serialNoOReason: new FormControl(null),

    supplierRefOBit: new FormControl(false),
    supplierRefOReason: new FormControl(null),

    waybillNoOBit: new FormControl(false),
    waybillNoOReason: new FormControl(null),

    transAtArrivalOBit: new FormControl(false),
    transAtArrivalOReason: new FormControl(null),

    containerNumbersOBit: new FormControl(false),
    containerNumbersOReason: new FormControl(null),
    isDeleted: new FormControl(0),

    // VOC
    vocID: new FormControl(null),
    referenceNo: new FormControl(null),
    reason: new FormControl(null),
  });

  public attachmentStatus: number;
  public transactionStatus: number;

  public attachmentLabel: string;
  public transactionLabel: string;
  public lines: any[];
  public lineErrors: any[] = [];
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
  public showErrors = false;

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
  private lineForm: FormSad500LineUpdatedComponent;

  @ViewChild('startForm', { static: false })
  private startForm: ElementRef;

  @Input() capture: any;

  public init() {
    if (this.capture) {
      this.attachmentID = this.capture.attachmentID;
      this.transactionID = this.capture.transactionID;
      this.attachmentLabel = this.capture.docType;
      this.transactionLabel = this.capture.transactionType;
      this.isExport = this.capture.transactionType === 'Export' ? true : false;

      if (this.capture.docType === 'VOC') {
        this.isVOC = true;
      }

      if (this.isExport) {
        this.form.controls.referenceNo.setValidators([Validators.required]);
        this.form.updateValueAndValidity();
      }

      if (this.isVOC) {
        this.form.controls.reason.setValidators([Validators.required]);
        this.form.updateValueAndValidity();
      }

      this.load();
    }
  }

  public submissionEvent = (escalation, saveProgress, escalationResolved) => this.submit(this.form, escalation, saveProgress, escalationResolved);

  ngOnInit() {
    this.paginationControl.valueChanges.subscribe((value) => {
      if (value && value !== null && value == '') {
        if (value > this.lines ? this.lines.length : -1) {
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
            command: (e) =>  this.nextLine()
          },
          {
            key: 'alt + ,',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: (e) => this.prevLine()
          },
          {
            key: 'alt + c',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => { this.cancelLine(); }
          },
          {
            key: 'alt + v',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => {
              if(this.attachmentStatus !== 5) {
                this.deleteLinePrompt();
              }
            }
          },
          {
            key: 'alt + m',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => {
              this.displayLines = false;
              setTimeout(() => this.startForm.nativeElement.focus());
            }
          },
          {
            key: 'alt + j',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: (e) => {
              this.dialog.open(DialogGotoLineComponent, {
                data: this.lines ? this.lines.length : 0,
                width: '256'
              }).afterClosed().subscribe((num: number) => {
                if (num) {
                  this.activeIndex = num - 1;
                  this.activeLine = this.lines[this.activeIndex];
                  this.paginationControl.setValue(this.activeIndex + 1, { emitEvent: false });
                  this.refresh();
                }
              });
            }
          },
          {
            key: 'alt + n',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => {
              if (this.attachmentStatus !== 5) {
                this.activeLine = null;
                this.activeIndex = -1;
                this.refresh();
              }
            }
          },
          {
            key: 'alt + k',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: (e) => this.eventService.focusForm.next(),
          },
          {
            key: 'alt + s',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => {
                {
                  if (!this.dialogOpen && this.attachmentStatus !== 5) {
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
              key: 'alt + a',
              preventDefault: true,
              allowIn: [AllowIn.Textarea, AllowIn.Input],
              command: e => {
                if (this.displayLines && this.attachmentStatus !== 5) {
                  this.eventService.submitLines.next();
                }
              }
            },
            {
              key: 'alt + c',
              preventDefault: true,
              allowIn: [AllowIn.Textarea, AllowIn.Input],
              command: e => {
                if (this.displayLines) {
                  this.cancelLine();
                }
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
      console.log(vocRequest);

      await this.captureService.vocList(vocRequest).then(
        (res: VOCListResponse) => {
          console.log(res);
          if (res.rowCount !== 0) {
            this.originalSAD500ID = res.vocs[0].originalID;
            this.form.controls.referenceNo.setValue(res.vocs[0].referenceNo);
            this.form.controls.reason.setValue(res.vocs[0].reason);
            this.form.controls.vocID.setValue(res.vocs[0].vocID);
            this.form.controls.SAD500ID.setValue(res.vocs[0].sad500ID);

            if (res.attachmentErrors.attachmentErrors ? res.attachmentErrors.attachmentErrors.length : 0 > 0) {
              this.errors = res.attachmentErrors.attachmentErrors;

            }
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

      this.attachmentStatus = null;

      if (res !== null) {
        const response: any = res;
        console.log(response);
        response.userID = request.userID;
        response.cpcID = +response.cpc;
        response.SAD500ID = request.specificID;
        response.attachmentStatusID = response.statusID;
        response.referenceNo = response.rebateCode;

        this.attachmentStatus = response.attachmentStatusID;
        this.transactionStatus = response.transactionStatusID;

        if (this.attachmentStatus === 5 && this.transactionStatus == 10) {
          this.form.disable();
        }

        this.form.patchValue(response);
        this.form.controls.userID.setValue(this.currentUser.userID);
        this.form.controls.cpcID.setValue(response.cpcID);
        this.form.controls.totalCustomsValueOBit.setValue(response.totalCustomValueOBit);
        this.form.controls.totalCustomsValueOReason.setValue(response.totalCustomValueOReason);
        console.log(`CPC ID: ${response.cpcID}`);
        console.log(this.form.value);
        this.form.updateValueAndValidity();

        if (!this.isVOC) {
          this.errors = res.attachmentErrors.attachmentErrors;
        }
        else {
          res.attachmentErrors.attachmentErrors.forEach((err)=>{
            this.errors.push(err);
          })
        }

        if (this.errors ? this.errors.length : 0 > 0 && this.isVOC) {
          Object.keys(this.form.controls).forEach(key => {
            this.errors.forEach((error) => {
              if (key.toUpperCase() === error.fieldName.toUpperCase()) {
                if (!this.form.controls[`${key}OBit`].value) {
                  this.form.controls[key].setErrors({incorrect: true});
                  this.form.controls[key].markAsTouched();
                }
              }

              if (error.fieldName.toUpperCase() == 'IMPORTERCODE') {
                this.form.controls.importersCode.setErrors({
                  incorrect: true,
                });
                this.form.controls.importersCode.markAsTouched();
              }
            });
          });
        }

        Object.keys(this.form.controls).forEach(key => {
          if (key.indexOf('ODate') !== -1) {
            if (this.form.controls[key].value !== null || this.form.controls[key].value) {
              this.form.controls[key].setValue(null);
            }
          }
        });

        if (res.attachmentErrors.attachmentErrors ? res.attachmentErrors.attachmentErrors.length : 0 > 0 && !this.isVOC) {
          Object.keys(this.form.controls).forEach(key => {
            res.attachmentErrors.attachmentErrors.forEach((error) => {
              if (key.toUpperCase() === error.fieldName.toUpperCase()) {
                if (!this.form.controls[`${key}OBit`].value) {
                  this.form.controls[key].setErrors({incorrect: true});
                  this.form.controls[key].markAsTouched();
                }
              }

              if (error.fieldName.toUpperCase() == 'IMPORTERCODE') {
                this.form.controls.importersCode.setErrors({
                  incorrect: true,
                });
                this.form.controls.importersCode.markAsTouched();
              }
            });
          });
        }

        this.form.updateValueAndValidity();
        setTimeout(() => {
          this.loader = false;
          setTimeout(() => {
            if (this.startForm) {
              this.startForm.nativeElement.focus()
            }
          }, 100);
        }, 200);

        await this.loadLines();
      } else {
        this.loader = false;
        this.snackbar.open('Failed to retrieve capture data', '', { duration: 3000 });
      }
      }, (err) => {
        this.loader = false;
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
        console.log(res);
        let pre_processed_lines: any[] = res.lines;
        this.lineErrors = res.attachmentErrors.attachmentErrors;
        console.log(this.lineErrors);

        pre_processed_lines.forEach((line) => {
          line.isLocal = false;
          line.specificSAD500LineID = line.sad500LineID;
          line.sad500ID = line.sad500ID;
          line.uniqueIdentifier = UUID.UUID();
          line.errors = res.attachmentErrors.attachmentErrors.filter(x => x.attachmentID === line.sad500LineID);
        });
        console.log(this.lines);
        if (this.lines)
        {
          let count = 0;
          this.lines = this.lines.filter(x =>
            x.isLocal === true)
          /*this.lines.forEach((line) => {
            if (!line.isLocal){
              this.lines.splice(count,1);
              count--;
            }
            count++;
          })*/

          console.log(this.lines);
          pre_processed_lines = pre_processed_lines.concat(this.lines);
        }

        this.lines = pre_processed_lines;
        console.log(this.lines);
        if (this.lines ? this.lines.length : 0 > 0) {
          this.activeIndex = 0;
          this.activeLine = this.lines[this.activeIndex];
          this.paginationControl.setValue(1, { emitEvent: false });
        } else {
          this.lines = [];
          this.newLine(true);
        }
      });
  }

  getError(key: string): string {
    return this.errors.find(x => x.fieldName.toUpperCase() === key.toUpperCase()) ? this.errors.find(x => x.fieldName.toUpperCase() === key.toUpperCase()).errorDescription : '';
  }

  async submit(form: FormGroup, escalation?: boolean, saveProgress?: boolean, escalationResolved?: boolean) {
    form.markAllAsTouched();

    if (!this.loader){
      if ((form.valid && this.lines ? this.lines.length : 0 > 0) || escalation || saveProgress || escalationResolved) {
        this.loader = true;
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
            lrn: requestModel.lrn,
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
          delete requestModel.reason;
          delete requestModel.originalID;
          delete requestModel.replacedByID;
        }

        if (!this.isExport) {
          delete requestModel.referenceNo;
        }

        requestModel.containerNumbers = requestModel.containerNumbers == null ? '' : requestModel.containerNumbers;
        requestModel.lrnOReason = requestModel.lrnOReason == null ? '' : requestModel.lrnOReason;
        requestModel.referenceNo = requestModel.referenceNo == null ? '' : requestModel.referenceNo;
        requestModel.transAtArrival = requestModel.transAtArrival == null ? '' : requestModel.transAtArrival;
        requestModel.mrnOReason = requestModel.mrnOReason == null ? '' : requestModel.mrnOReason;
        requestModel.importersCodeOReason = requestModel.importersCodeOReason == null ? '' : requestModel.importersCodeOReason;
        requestModel.fileRefOReason = requestModel.fileRefOReason == null ? '' : requestModel.fileRefOReason;
        requestModel.totalDutyOReason = requestModel.totalDutyOReason == null ? '' : requestModel.totalDutyOReason;
        requestModel.totalCustomValueOReason = requestModel.totalCustomsValueOReason == null ? '' : requestModel.totalCustomsValueOReason;
        requestModel.totalCustomValueOBit = requestModel.totalCustomsValueOBit == null ? '' : requestModel.totalCustomsValueOBit;
        requestModel.serialNoOReason = requestModel.serialNoOReason == null ? '' : requestModel.serialNoOReason;
        requestModel.supplierRefOReason = requestModel.supplierRefOReason == null ? '' : requestModel.supplierRefOReason;
        requestModel.waybillNoOReason = requestModel.waybillNoOReason == null ? '' : requestModel.waybillNoOReason;
        requestModel.transAtArrivalOReason = requestModel.transAtArrivalOReason == null ? '' : requestModel.transAtArrivalOReason;
        requestModel.containerNumbersOReason = requestModel.containerNumbersOReason == null ? '' : requestModel.containerNumbersOReason;

        console.log('SAD500 RequestModel');
        console.log(requestModel);

        await this.captureService.sad500Update(requestModel).then(
          async (res: Outcome) => {

            await this.saveLines(this.lines, async (line) => {
              let sad500LineID = line.specificSAD500LineID;
              line.isDeleted = 0;
              line.sad500ID = this.isVOC ? this.originalSAD500ID : form.controls.SAD500ID.value;
              line.userID = this.currentUser.userID;

              if (line.isLocal) {
                await this.captureService.sad500LineAdd(line).then(
                  (res: any) =>  {
                  console.log(res);
                  sad500LineID = res.createdID;
                },(msg) => {
                    console.log(msg);
                    this.snackbar.open('Failed to create line', '', { duration: 3000 })
                  });
              }

              if (line.duties && sad500LineID !== null && sad500LineID) {
                const duties = line.duties.filter(x => x.isLocal === true);

                await this.saveLineDuty(duties, async (duty) => {
                  const dutyRequest = {
                    userID: this.currentUser.userID,
                    dutyID: duty.dutyTaxTypeID,
                    sad500LineID,
                    value: duty.value
                  };

                  await this.captureService.sad500LineDutyAdd(dutyRequest);
                });
              }
          });

            if (res.outcome === 'SUCCESS') {
              if (saveProgress) {
                this.snackbar.open('Progress Saved', '', { duration: 3000 });
                this.displayLines = false;
                this.lines = null;
                this.load();
              } else {
                this.notify.successmsg(res.outcome, res.outcomeMessage);
                //if (this.currentUser.designation === 'Consultant') {
                //  this.router.navigate(['escalations']);
                //} else {
                  this.location.back();
                //}
              }
              this.loader = false;
            } else {
              this.notify.errorsmsg(res.outcome, res.outcomeMessage);
              this.loader = false;
            }
          }
        );
      } else {
        this.snackbar.open('Please fill in header details as well as have at least one line', '', {duration: 3000});
        this.findInvalidControls(form);
      }
    }
    else {
      this.snackbar.open('Page is submitting', '', {duration: 3000});
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
  async queueLine($event: any) {
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
      this.cancelLine();

      this.newLine(true);
      this.snackbar.open('Line added to queue', '', {duration: 3000});
    } else {
      $event.isLocal = false;
      const original = this.lines[this.lines.indexOf(target)];

      console.log(target);
      console.log(this.form.controls.SAD500ID.value);
      $event.sad500LineID = target.sad500LineID;
      $event.specificSAD500LineID = target.sad500LineID;
      //$event.sad500ID = this.isVOC ? this.form.controls.SAD500ID.value : original.SAD500ID;
      console.log(this.originalSAD500ID);
      console.log($event);

      console.log(original);
      if (this.isVOC) {
        if ($event.sad500ID === this.form.controls.SAD500ID.value) {
          //Line update
          //$event.sad500ID = this.form.controls.SAD500ID.value;
          await this.captureService.sad500LineUpdate($event).then((res: any) => {
            this.snackbar.open('Line updated', '', {duration: 3000});
            console.log(res);
            if ($event.duties && $event.sad500LineID !== null && $event.sad500LineID) {
              const duties = $event.duties.filter(x => x.isLocal === true);

              this.saveLineDuty(duties, async (duty) => {
                const dutyRequest = {
                  userID: this.currentUser.userID,
                  dutyID: duty.dutyTaxTypeID,
                  sad500LineID: $event.sad500LineID,
                  value: duty.value
                };

                await this.captureService.sad500LineDutyAdd(dutyRequest);
              });
            }
          },
          (msg) => this.snackbar.open('Failed to update line', '', { duration: 3000 }));
        } else {
          //line add
          $event.replacedByLineID = null;
          $event.originalLineID = target.sad500LineID;
          $event.sad500ID = this.form.controls.SAD500ID.value;
          //$event.replacedByLineID = original.sad500LineID;
          await this.captureService.sad500LineAdd($event).then((res: any) => {
            this.snackbar.open('Line updated', '', {duration: 3000});
            console.log(res);
            if ($event.duties && $event.sad500LineID !== null && $event.sad500LineID) {
              const duties = $event.duties.filter(x => x.isLocal === true);

              this.saveLineDuty(duties, async (duty) => {
                const dutyRequest = {
                  userID: this.currentUser.userID,
                  dutyID: duty.dutyTaxTypeID,
                  sad500LineID: $event.sad500LineID,
                  value: duty.value
                };

                await this.captureService.sad500LineDutyAdd(dutyRequest);
              });
            }
          },
          (msg) => this.snackbar.open('Failed to update line ' + msg, '', { duration: 3000 }))
        }
      }
      else {
        $event.isDeleted = 0;
        $event.sad500ID = this.isVOC ? this.originalSAD500ID : this.form.controls.SAD500ID.value;
        $event.userID = this.currentUser.userID;

        await this.captureService.sad500LineUpdate($event).then((res: any) => {
          this.snackbar.open('Line updated', '', {duration: 3000});
          if ($event.duties && $event.sad500LineID !== null && $event.sad500LineID) {
            const duties = $event.duties.filter(x => x.isLocal === true);

            this.saveLineDuty(duties, async (duty) => {
              const dutyRequest = {
                userID: this.currentUser.userID,
                dutyID: duty.dutyTaxTypeID,
                sad500LineID: $event.sad500LineID,
                value: duty.value
              };

              await this.captureService.sad500LineDutyAdd(dutyRequest);
            });
          }
          },
             (msg) => this.snackbar.open('Failed to update line', '', { duration: 3000 }));
      }

      this.lines[this.lines.indexOf(target)] = $event;
      this.activeLine = $event;
      this.loadLines()
      this.refresh();
    }

  }

  async saveLineDuty(duties: any, callback) {
    for (let index = 0; index < (duties ? duties.length : 0); index++) {
      await callback(duties[index], index, duties);
    }
  }

  async saveLines(lines: any[], callback) {
    for (let index = 0; index < (lines ? lines.length : 0); index++) {
      await callback(lines[index], index, lines);
    }
  }

  prevLine() {
    if (this.activeIndex >= 1) {
      this.activeIndex--;
      if (this.lineForm) {
        this.lineForm.resetForm();
      }
      this.activeLine = this.lines[this.activeIndex];
      this.paginationControl.setValue(this.activeIndex + 1, { emitEvent: false });

      this.refresh();

    }
  }

  nextLine() {
    this.activeIndex++;

    if (this.activeIndex < (this.lines ? this.lines.length : 0)) {

      if (this.lineForm) {
        this.lineForm.resetForm();
      }
      this.activeLine = this.lines[this.activeIndex];
      this.paginationControl.setValue(this.activeIndex + 1, { emitEvent: false });

      this.refresh();
    } else {
      this.activeIndex--;
    }
  }

  specificLine(index: number) {
    this.activeLine = this.lines[index];
    this.refresh();
  }

  newLine(norefresh) {
    this.activeLine = null;
    this.activeIndex = -1;

    if (!norefresh) {
      this.refresh();
    }
  }

  deleteLinePrompt() {
    this.dialog.open(DeletelineDialogComponent).afterClosed().subscribe( (status: boolean) => {
      if (status) {
        this.deleteLine();
      }
    });
  }

  async deleteLine() {
    const targetLine = this.lines[this.activeIndex];
    targetLine.isDeleted = 1;
    targetLine.saD500ID = this.form.controls.SAD500ID.value;
    targetLine.userID = this.currentUser.userID;

    if (!targetLine.isLocal) {
      await this.captureService.sad500LineUpdate(targetLine);
    }

    if ((this.lines ? this.lines.length : 0) === 1) {
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

    this.refresh();
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

    this.refresh();
  }

  cancelLine() {
    this.activeLine = null;
    this.activeIndex = 0;
    if (this.lines) {
      if (this.lines.length > 0) {
        this.activeLine = this.lines[this.activeIndex];
      }
    }

    this.refresh();
  }

  ngOnDestroy(): void {}

  // @override methods
  overrideDialog(key, label) {

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
    this.form.updateValueAndValidity();
  }

  undoOverride(key: string) {
    this.form.controls[`${key}OBit`].setValue(false);
    this.form.controls[`${key}OReason`].setValue(null);

    if (this.errors ? this.errors.length > 0 : false) {
      this.errors.forEach((error) => {
        if (key.toUpperCase() === error.fieldName.toUpperCase()) {
          this.form.controls[key].setErrors({incorrect: true});
          this.form.controls[key].markAsTouched();
        }
      });
    }
  }

  refresh(time?) {
    this.displayLines = false;
    this.loader = true;
    setTimeout(() => {
      this.displayLines = true;
      this.loader = false;
    }, time ? time : 500);
  }
}
