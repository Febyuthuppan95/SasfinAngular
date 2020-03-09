import { VOCListResponse } from 'src/app/models/HttpResponses/VOC';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Router } from '@angular/router';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { CaptureService } from 'src/app/services/capture.service';
import { SAD500Get } from 'src/app/models/HttpResponses/SAD500Get';
import { SAD500LineCreateRequest, SAD500LineUpdateModel, Duty } from 'src/app/models/HttpRequests/SAD500Line';
import { MatDialog, MatTooltip, MatSnackBar } from '@angular/material';
import { SPSAD500LineList, SAD500Line } from 'src/app/models/HttpResponses/SAD500Line';
import { AllowIn, KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { SubmitDialogComponent } from 'src/app/layouts/capture-layout/submit-dialog/submit-dialog.component';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { CompanyService } from 'src/app/services/Company.Service';
@Component({
  selector: 'app-form-sad500',
  templateUrl: './form-sad500.component.html',
  styleUrls: ['./form-sad500.component.scss']
})
export class FormSAD500Component implements OnInit, AfterViewInit, OnDestroy {

  constructor(private themeService: ThemeService, private userService: UserService, private transactionService: TransactionService,
              private router: Router, private captureService: CaptureService, private dialog: MatDialog,
              private eventService: EventService, private snackbar: MatSnackBar, private snackbarService: HelpSnackbar,
              private companyService: CompanyService) { }

shortcuts: ShortcutInput[] = [];

@ViewChild(NotificationComponent, { static: true })
private notify: NotificationComponent;

@ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;

@ViewChild('sadLinesTooltip', {static : false})
sadLinesTooltip: MatTooltip;

@ViewChild('sad500Tooltip', {static : false})
sad500Tooltip: MatTooltip;

currentUser = this.userService.getCurrentUser();
attachmentID: number;
linePreview = -1;
lines = -1;
focusMainForm: boolean;
focusLineForm: boolean;
focusLineData: SAD500Line = null;
private unsubscribe$ = new Subject<void>();

currentTheme: string;
loader: boolean;

sad500LineQueue: SAD500LineCreateRequest[] = [];
sad500CreatedLines: SAD500Line[] = [];
lineState: string;
lineErrors: SAD500Line[] = [];
toggleLines = false;
vocSAD500ID = -1;
form = {
  referenceNo: {
    value: null,
    error: null
  },
  reason: {
    value: null,
    error: null
  },
  serialNo: {
    value: null,
    error: null,
  },
  LRN: {
    value: null,
    error: null,
  },
  PCC: {
    value: null,
    error: null,
  },
  totalCustomsValue: {
    value: null,
    error: null,
  },
  waybillNo: {
    value: null,
    error: null,
  },
  supplierRef: {
    value: null,
    error: null,
  },
  MRN: {
    value: null,
    error: null,
  },
  CPC: {
    value: null,
    error: null,
  },
  CPCC: {
    value: null,
    error: null,
  },
  totalCustomsDuty: {
    value: null,
    error: null
  },
  fileRef: {
    value: null,
    error: null
  },
  rebateCode: {
    value: null,
    error: null
  }
};

lineQueue: SAD500LineCreateRequest[] = [];
lineIndex = 0;
dutyIndex = 0;
transactionID = 0;
attachmentType = '';
dialogOpen = false;

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(value => this.currentTheme = value);

    this.eventService.observeCaptureEvent()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(() => this.saveLines());

    this.transactionService.observerCurrentAttachment()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((curr: { transactionID: number, attachmentID: number, docType: string }) => {
      console.log(curr);
      if (curr !== null || curr !== undefined) {
        this.attachmentID = curr.attachmentID;
        this.transactionID = curr.transactionID;
        this.attachmentType = curr.docType;
        if (curr.docType === 'VOC') {
          this.vocGet();
        } else {
          this.loadCapture();
          this.loadLines();
        }
      }
    });
  }

  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
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
          command: e => this.focusLineForm = !this.focusLineForm
        },
        {
          key: 'alt + m',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => {
            this.focusMainForm = !this.focusMainForm;
            this.focusLineData = null;
            this.lines = -1;
          }
        },
        {
          key: 'alt + n',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => {
            this.focusLineForm = !this.focusLineForm;
            this.focusLineData = null;
            this.lines = -1;
          }
        },
        {
          key: 'alt + s',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => {
            if (!this.toggleLines) {
              {
                if (!this.dialogOpen) {
                  this.dialogOpen = true;
                  this.dialog.open(SubmitDialogComponent).afterClosed().subscribe((status: boolean) => {
                    this.dialogOpen = false;
                    if (status) {
                      this.submit();
                    }
                  });
                }
              }
            }
          }
        },
        {
          key: 'alt + l',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => {
            this.toggleLines = !this.toggleLines;

            if (this.toggleLines) {
              this.sad500Tooltip.hide();
              this.sadLinesTooltip.show();
              setTimeout(() => { this.sadLinesTooltip.hide(); } , 1000);
            } else {
              this.sadLinesTooltip.hide();
              this.sad500Tooltip.show();
              setTimeout(() => { this.sad500Tooltip.hide(); } , 1000);
            }
          }
        },
    );
  }
  // vocGet() {
  //   const requestModel = {
  //     userID: this.currentUser.userID,

  //   }
  // }
  vocGet = () => this.captureService.vocList({
    userID: this.currentUser.userID,
    vocID: this.attachmentID,
    transactionID: this.transactionID,
    filter: '',
    orderBy: '',
    orderByDirection: '',
    rowStart: 1,
    rowEnd: 10
  }).then(
    (res: VOCListResponse) => {
      console.log(res);
      if (res.rowCount !== 0) {
        this.vocSAD500ID = res.vocs[0].sad500ID;
        this.loadCapture();
        this.loadLines();
      } else {
        this.notify.errorsmsg('FAILURE', 'Could not retrieve SAD500 record');
      }
    },
    (msg) => {
      this.notify.errorsmsg('FAILURE', 'Could not retrieve SAD500 record');
    })
  submit() {
    const requestModel = {
      userID: this.currentUser.userID,
      specificSAD500ID: this.attachmentType === 'VOC' ? this.vocSAD500ID : this.attachmentID,
      serialNo: this.form.serialNo.value,
      lrn: this.form.LRN.value,
      pcc: this.form.PCC.value,
      cpc: this.form.CPC.value,
      originalID: -1,
      replacedByID: -1,
      waybillNo: this.form.waybillNo.value,
      supplierRef: this.form.supplierRef.value,
      totalCustomsValue: this.form.totalCustomsValue.value,
      totalDuty: this.form.totalCustomsDuty.value,
      mrn: this.form.MRN.value,
      isDeleted: 0,
      attachmentStatusID: 3,
      fileRef: this.form.fileRef.value,
      rebateCode: this.form.rebateCode.value
    };
    if (this.attachmentType === 'VOC') { // Save VOC Header
      // First Create new SAD500 record

      // this.captureService.sad500Create(requestModel).then(
      //   (res: Outcome) => {
      //     if (res.outcome === 'SUCCESS') {
      //       this.notify.successmsg(res.outcome, res.outcomeMessage);
  
      //       this.companyService.setCapture({ capturestate: true });
      //       this.router.navigateByUrl('transaction/capturerlanding');
      //     } else {
      //       this.notify.errorsmsg(res.outcome, res.outcomeMessage);
      //     }
      //   },
      //   (msg) => {
      //     this.notify.errorsmsg('Failure', 'Cannot reach server');
      //   }
      // );
      this.captureService.vocUpdate({userID: this.currentUser.userID}).then(
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
          this.notify.errorsmsg('Failure', 'Cannot reach server');
        }
      );
    } else {
      this.captureService.sad500Update(requestModel).then(
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
          this.notify.errorsmsg('Failure', 'Cannot reach server');
        }
      );
    }
  }

  updateLine(obj: SAD500Line) {
    this.lineState = 'Saving';
    const requestModel = {
      userID: this.currentUser.userID,
      sad500ID: this.attachmentType === 'VOC' ? this.vocSAD500ID : this.attachmentID,
      specificSAD500LineID: obj.sad500LineID,
      // unitOfMeasure: obj.unitOfMeasure,
      unitOfMeasureID: obj.unitOfMeasureID,
      // tariff: obj.tariff,
      tariffID: obj.tariffID,
      quantity: obj.quantity,
      customsValue: obj.customsValue,
      isDeleted: 0,
      lineNo: obj.lineNo,
      cooID: -1,
      supplyUnit: '',
      replacedByLineID: -1,
      orginalLineID: -1
    };

    this.captureService.sad500LineUpdate(requestModel).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.loadLines();
          this.lineState = 'Updated successfully';
          this.lines = -1;
          this.focusLineData = null;
          setTimeout(() => this.lineState = '', 3000);
        }
      },
      (msg) => {
        this.notify.errorsmsg('Failure', 'Cannot reach server');
        this.lineState = 'Update failed';

        setTimeout(() => this.lineState = '', 3000);
      }
    );
  }

  loadCapture() {
    console.log(this.vocSAD500ID);
    this.captureService.sad500Get({
      specificID: this.attachmentType === 'VOC' ? this.vocSAD500ID : this.attachmentID,
      userID: this.currentUser.userID,
      transactionID: this.transactionID
    }).then(
      (res: SAD500Get) => {
        this.form.MRN.value = res.mrn;
        this.form.MRN.error = res.mrnError;
        this.form.serialNo.value = res.serialNo;
        this.form.serialNo.error = res.serialNoError;
        this.form.totalCustomsValue.value = res.totalCustomsValue;
        this.form.totalCustomsValue.error = res.totalCustomsValueError;
        this.form.waybillNo.value = res.waybillNo;
        this.form.waybillNo.error = res.waybillNoError;
        this.form.supplierRef.value = res.supplierRef;
        this.form.supplierRef.error = res.supplierRefError;
        this.form.LRN.value = res.lrn;
        this.form.LRN.error = res.lrnError;
        this.form.PCC.value = res.pcc;
        this.form.PCC.error = res.pccError;
        this.form.CPC.value = res.cpc;
        this.form.CPC.error = res.cpcError;
        this.form.fileRef.value = res.fileRef;
        this.form.fileRef.error = res.fileRefError;
        this.form.rebateCode.value = res.rebateCode;
        this.form.rebateCode.error = res.rebateCodeError;
        this.form.totalCustomsDuty.value = res.totalDuty;
        this.form.totalCustomsDuty.error = res.totalDutyError;

      },
      (msg) => {
      }
    );
  }

  loadLines() {
    // tslint:disable-next-line: max-line-length
    this.captureService.sad500LineList({ userID: this.currentUser.userID, sad500ID: this.attachmentType === 'VOC' ? this.vocSAD500ID : this.attachmentID,
    specificSAD500LineID: -1 }).then(
      (res: SPSAD500LineList) => {
        this.sad500CreatedLines = res.lines;
        // this.lines = this.sad500CreatedLines.length;
        console.log(this.lines);
        if (this.lines > -1) {
          this.focusLineData = this.sad500CreatedLines[this.lines];
        }
        this.lineErrors = res.lines.filter(x => x.lineNoError !== null
          || x.quantityError !== null
          || x.unitOfMeasureError !== null || x.tariffError !== null);
      },
      (msg) => {
      }
    );
  }
  // loadLineDuty() {
  //   this.captureService.sad500LineDutyList({}).then(
  //     (res: SAD500LineDutyList) => {

  //     },
  //     (msg) => {

  //     }
  //   )
  // }
  addToQueue(obj: SAD500LineCreateRequest) {
    obj.userID = this.currentUser.userID;
    obj.sad500ID = this.attachmentType === 'VOC' ? this.vocSAD500ID : this.attachmentID;
    obj.isPersist = false;

    this.lineQueue.push(obj);
    this.sad500CreatedLines.push(obj);
    // this.lineState = 'Line added to queue';
    this.focusLineForm = !this.focusLineForm;
    this.focusLineData = null;
    this.lines = -1;
    // setTimeout(() => this.lineState = '', 3000);
    this.snackbar.open(`Line #${this.lineQueue.length} added to queue`, '', {
      duration: 3000,
      panelClass: ['capture-snackbar'],
      horizontalPosition: 'center',
    });
  }

  saveLines() {
    if (this.lineIndex < this.lineQueue.length) {
      this.captureService.sad500LineAdd(this.lineQueue[this.lineIndex]).then(
        (res: { outcome: string; outcomeMessage: string; createdID: number }) => {
          if (res.outcome === 'SUCCESS') {
            console.log('Line saved');
            const currentLine = this.lineQueue[this.lineIndex];
            currentLine.duties.forEach((duty) => duty.sad500Line = res.createdID);
            this.dutyIndex = 0;
            if (currentLine.duties.length > 0) {
              this.saveLineDuty(currentLine.duties[0]);
            } else {
              this.nextLineAsync();
            }
          } else {
            console.log('Line not saved');
          }
        },
        (msg) => {
          console.log('Client Error');
        }
      );
    } else {
      this.submit();
    }
  }


  saveLineDuty(line: Duty) {
    console.log(line);
    this.captureService.sad500LineDutyAdd({
      userID: this.currentUser.userID,
      dutyID: line.dutyTaxTypeID,
      sad500LineID: line.sad500Line,
      value: line.value
    }).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.nextDutyAsync(this.lineQueue[this.lineIndex]);
          console.log('Line Duty Saved');
        } else {
          console.log('Line Duty Not Saved');
        }
      },
      (msg) => {
        console.log('Line Duty Client Error');
      }
    );
  }

  nextLineAsync() {
    this.lineIndex++;

    if (this.lineIndex < this.lineQueue.length) {
      this.saveLines();
    } else {
      this.loader = false;
      this.submit();
    }
  }

  nextDutyAsync(currentSAD: SAD500LineCreateRequest) {
    this.dutyIndex++;

    if (this.dutyIndex < currentSAD.duties.length) {
      const pendingDuty = currentSAD.duties[this.dutyIndex];
      pendingDuty.sad500Line = currentSAD.sad500LineID;

      this.saveLineDuty(pendingDuty);
    } else {
      this.nextLineAsync();
    }
  }

  revisitSAD500Line(item: SAD500LineCreateRequest, i?: number) {
    console.log(item);
    this.lines = i;
  }

  prevLine() {
    if (this.lines >= 1) {
      this.lines--;
      this.focusLineData = this.sad500CreatedLines[this.lines];
    }
  }

  nextLine() {
    if (this.lines < this.sad500CreatedLines.length - 1) {
      this.lines++;
      this.focusLineData = this.sad500CreatedLines[this.lines];
      
    }

    if (this.lines === -1) {
      this.lines++;
      this.focusLineData = this.sad500CreatedLines[this.lines];
    }
    console.log(this.focusLineData);
  }

  specificLine(index: number) {
    this.focusLineData = this.sad500CreatedLines[index];
  }

  newLine() {
    this.focusLineForm = !this.focusLineForm;
    this.focusLineData = null;
    this.lines = -1;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
