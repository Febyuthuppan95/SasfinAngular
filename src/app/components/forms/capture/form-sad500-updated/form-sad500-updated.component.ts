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
import { MatDialog } from '@angular/material';

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
              private dialog: MatDialog) {}

  public form: FormGroup;
  public attachmentLabel: string;
  public transactionLabel: string;
  public lines: any[];
  public activeLine: any;
  public activeIndex: any;
  public displayLines = false;
  public errors: any[] = [];
  public shortcuts: ShortcutInput[] = [];
  public help = false;
  public isVOC = false;

  private attachmentID: number;
  private transactionID: number;
  private currentUser = this.userService.getCurrentUser();
  private dialogOpen = false;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild(KeyboardShortcutsComponent, { static: true })
  private keyboard: KeyboardShortcutsComponent;

  ngOnInit() {
    this.form = new FormGroup({
      userID: new FormControl(null, [Validators.required]),
      SAD500ID: new FormControl(null, [Validators.required]),
      serialNo: new FormControl(null, [Validators.required]),
      lrn: new FormControl(null, [Validators.required]),
      rebateCode: new FormControl(null),
      totalCustomsValue: new FormControl(0, [Validators.required]),
      cpc: new FormControl(null, [Validators.required]),
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
      isDeleted: new FormControl(false)
    });

    this.form.controls.cpc.valueChanges.subscribe((val) => {
      console.log(val);
    });

    this.transactionService.observerCurrentAttachment()
    .subscribe((capture: any) => {
      if (capture) {
        this.attachmentID = capture.attachmentID;
        this.transactionID = capture.transactionID;
        this.attachmentLabel = capture.docType;
        this.transactionLabel = capture.transactionType;
        if (capture.docType === 'VOC') {
          // this.vocGet();
          this.isVOC = true;
          this.form.controls.rebateCode.setValidators([Validators.required]);
          this.form.updateValueAndValidity();
        } else {
          this.load();
        }
      }
    });

    this.eventService.observeCaptureEvent()
    .subscribe((escalation?: boolean) => this.submit(this.form, escalation));

  }

  ngAfterViewInit(): void {
    this.shortcuts.push(
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
            alert('Focus form');
            this.activeLine = null;
            this.activeIndex = -1;
          }
        },
        {
          key: 'alt + n',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => {
            alert('Focus form');
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
                      // this.saveLines();
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

            // if (this.displayLines) {
            //   // this.sad500Tooltip.hide();
            //   // this.sadLinesTooltip.show();
            //   // setTimeout(() => { this.sadLinesTooltip.hide(); } , 1000);
            // } else {
            //   this.sadLinesTooltip.hide();
            //   this.sad500Tooltip.show();
            //   setTimeout(() => { this.sad500Tooltip.hide(); } , 1000);
            // }
          }
        },
        {
            key: 'ctrl + alt + h',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => {
              //  this.toggelHelpBar();
            }
        }
    );
  }

  async load() {
    const request = {
      userID: this.currentUser.userID,
      specificID: this.attachmentID,
      transactionID: this.transactionID,
      fileType: this.attachmentLabel === 'VOC' ? 'VOC' : 'SAD',
    };

    this.captureService.sad500Get(request).then(async (res: SAD500Get) => {
      const response: any = res;
      response.userID = request.userID;
      response.SAD500ID = request.specificID;
      response.attachmentStatusID = response.statusID;

      this.form.patchValue(response);
      this.errors = res.attachmentErrors.attachmentErrors;

      if (res.attachmentErrors.attachmentErrors.length > 0) {
        Object.keys(this.form.controls).forEach(key => {
          res.attachmentErrors.attachmentErrors.forEach((error) => {
            if (key === error.fieldName) {
              this.form.controls[key].setErrors({incorrect: true});
            }
          });
        });
      }

      await this.loadLines();
    });
  }

  getError(key: string): string {
    return this.errors.find(x => x.fieldName === key).errorDescription;
  }

  async loadLines() {
    const requestModel = {
      userID: this.currentUser.userID,
      transactionID: this.transactionID,
      sad500ID: this.attachmentID,
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
        this.lines = res.lines;
        this.activeIndex = this.lines.length - 1;
        if (this.activeIndex > -1) {
            this.activeLine = this.lines[this.activeIndex - 1];
        }
      });
  }

  submit(form: FormGroup, escalation?: boolean) {
      const requestModel = form.value;
      this.captureService.sad500Update(requestModel).then(
        (res: Outcome) => {
          console.log(res);

          if (res.outcome === 'SUCCESS') {
            // this.notify.successmsg(res.outcome, res.outcomeMessage);
            // this.companyService.setCapture({ capturestate: true });
            // this.router.navigateByUrl('transaction/capturerlanding');
          } else {
            // this.notify.errorsmsg(res.outcome, res.outcomeMessage);
          }
        },
        (msg) => {
          console.log(JSON.stringify(msg));
          // this.notify.errorsmsg('Failure', 'Cannot reach server');
        }
      );
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

  // Line Controls

  queueLine($event: any) {
    this.lines.push($event);
  }

  // saveLines(obj: FormGroup, escalation) {
  //     if (obj !== null && obj !== undefined) {
  //       const perfect = obj.value;

  //       this.captureService.sad500LineAdd(perfect).then(
  //         (res: { outcome: string; outcomeMessage: string; createdID: number }) => {
  //           console.log();
  //         });
  //     } else {
  //       if (this.lineIndex < this.lineQueue.length && this.attachmentType !== 'VOC') {
  //         const lineCreate: any = this.lineQueue[this.lineIndex];
  //         delete lineCreate.isPersist;
  //         const perfect: SADLineCaptureThatSHOULDWorks = lineCreate;
  //         this.captureService.sad500LineAdd(perfect).then(
  //           (res: { outcome: string; outcomeMessage: string; createdID: number }) => {
  //             if (res.outcome === 'SUCCESS') {

  //               const currentLine = this.lineQueue[this.lineIndex];

  //               if (currentLine.duties) {
  //                 if (currentLine.duties.length > 0) {
  //                   currentLine.duties.forEach((duty) => duty.sad500Line = res.createdID);
  //                   this.dutyIndex = 0;
  //                   this.saveLineDuty(currentLine.duties[0]);
  //                 } else {
  //                   this.nextLineAsync();
  //                 }
  //               } else {
  //                 this.nextLineAsync();
  //               }
  //             } else {
  //               console.log('Line not saved');
  //             }
  //           },
  //           (msg) => {
  //             console.log(JSON.stringify(msg));
  //           }
  //         );
  //       } else {
  //         this.submit(escalation);
  //       }
  //     }
  // }

  saveLineDuty(line: any) {
    this.captureService.sad500LineDutyAdd({
      userID: this.currentUser.userID,
      dutyID: line.dutyTaxTypeID,
      sad500LineID: line.sad500Line,
      value: line.value
    }).then(
      (res: Outcome) => {},
    );
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

  cancelLine() {
    this.activeLine = null;
    console.log(this.lines.length);
    this.activeIndex = this.lines.length - 1;
    this.activeLine = this.lines[this.activeIndex];
  }

  ngOnDestroy(): void {}
}
