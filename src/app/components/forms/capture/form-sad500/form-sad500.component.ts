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
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  reason: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  serialNo: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  LRN: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  PCC: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  totalCustomsValue: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  waybillNo: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  supplierRef: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  MRN: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  CPC: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  CPCC: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  totalCustomsDuty: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  fileRef: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  rebateCode: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  importersCode: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
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
      rebateCode: this.form.rebateCode.value,
      importerdCode: this.form.importersCode.value,

      lrnOBit: this.form.LRN.OBit,
      lrnOUserID: this.form.LRN.OUserID,
      lrnODate: this.form.LRN.ODate,
      lrnOReason: this.form.LRN.OReason,

      mrnOBit: this.form.MRN.OBit,
      mrnOUserID: this.form.MRN.OUserID,
      mrnODate: this.form.MRN.ODate,
      mrnOReason: this.form.MRN.OReason,

      cpcOBit: this.form.CPC.OBit,
      cpcOUserID: this.form.CPC.OUserID,
      cpcODate: this.form.CPC.ODate,
      cpcOReason: this.form.CPC.OReason,

      importersCodeOBit: this.form.importersCode.OBit,
      importersCodeOUserID: this.form.importersCode.OUserID,
      importersCodeODate: this.form.importersCode.ODate,
      importersCodeOReason: this.form.importersCode.OReason,

      fileRefOBit: this.form.fileRef.OBit,
      fileRefOUserID: this.form.fileRef.OUserID,
      fileRefODate: this.form.fileRef.ODate,
      fileRefOReason: this.form.fileRef.OReason,

      totalDutyOBit: this.form.totalCustomsDuty.OBit,
      totalDutyOUserID: this.form.totalCustomsDuty.OUserID,
      totalDutyODate: this.form.totalCustomsDuty.ODate,
      totalDutyOReason: this.form.totalCustomsDuty.OReason,
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
    this.captureService.sad500Get({
      specificID: this.attachmentType === 'VOC' ? this.vocSAD500ID : this.attachmentID,
      userID: this.currentUser.userID,
      transactionID: this.transactionID,
      fileType: this.attachmentType === 'VOC' ? 'VOC' : 'SAD',
    }).then(
      (res: SAD500Get) => {
        this.form.MRN.value = res.mrn;
        this.form.serialNo.value = res.serialNo;
        this.form.totalCustomsValue.value = res.totalCustomsValue;
        this.form.waybillNo.value = res.waybillNo;
        this.form.supplierRef.value = res.supplierRef;
        this.form.LRN.value = res.lrn;
        this.form.PCC.value = res.pcc;
        this.form.CPC.value = res.cpc;
        this.form.fileRef.value = res.fileRef;
        this.form.rebateCode.value = res.rebateCode;
        this.form.totalCustomsDuty.value = res.totalDuty;

        this.form.waybillNo.OBit = res.waybillNoOBit;
        this.form.waybillNo.OUserID = res.waybillNoOUserID;
        this.form.waybillNo.ODate = res.waybillNoODate;
        this.form.waybillNo.OReason = res.waybillNoOReason;

        this.form.serialNo.OBit = res.serialNoOBit;
        this.form.serialNo.OUserID = res.serialNoOUserID;
        this.form.serialNo.ODate = res.serialNoODate;
        this.form.serialNo.OReason = res.serialNoOReason;

        this.form.PCC.OBit = res.pccOBit;
        this.form.PCC.OUserID = res.pccOUserID;
        this.form.PCC.ODate = res.pccODate;
        this.form.PCC.OReason = res.pccOReason;

        this.form.supplierRef.OBit = res.supplierRefOBit;
        this.form.supplierRef.OUserID = res.supplierRefOUserID;
        this.form.supplierRef.ODate = res.supplierRefODate;
        this.form.supplierRef.OReason = res.supplierRefOReason;

        this.form.totalCustomsValue.OBit = res.totalCustomValueOBit;
        this.form.totalCustomsValue.OUserID = res.totalCustomValueOUserID;
        this.form.totalCustomsValue.ODate = res.totalCustomValueODate;
        this.form.totalCustomsValue.OReason = res.totalCustomValueOReason;

        this.form.LRN.OBit = res.lrnOBit;
        this.form.LRN.OUserID = res.lrnOUserID;
        this.form.LRN.ODate = res.lrnODate;
        this.form.LRN.OReason = res.lrnOReason;

        this.form.MRN.OBit = res.mrnOBit;
        this.form.MRN.OUserID = res.mrnOUserID;
        this.form.MRN.ODate = res.mrnODate;
        this.form.MRN.OReason = res.mrnOReason;

        this.form.CPC.OBit = res.cpcOBit;
        this.form.CPC.OUserID = res.cpcOUserID;
        this.form.CPC.ODate = res.cpcODate;
        this.form.CPC.OReason = res.cpcOReason;

        this.form.importersCode.OBit = res.importersCodeOBit;
        this.form.importersCode.OUserID = res.importersCodeOUserID;
        this.form.importersCode.ODate = res.importersCodeODate;
        this.form.importersCode.OReason = res.importersCodeOReason;

        this.form.fileRef.OBit = res.fileRefOBit;
        this.form.fileRef.OUserID = res.fileRefOUserID;
        this.form.fileRef.ODate = res.fileRefODate;
        this.form.fileRef.OReason = res.fileRefOReason;

        this.form.totalCustomsDuty.OBit = res.totalDutyOBit;
        this.form.totalCustomsDuty.OUserID = res.totalDutyOUserID;
        this.form.totalCustomsDuty.OReason = res.totalDutyOReason;
        this.form.totalCustomsDuty.OReason = res.totalDutyOReason;

        if (res.attachmentErrors.attachmentErrors.length > 0) {
          res.attachmentErrors.attachmentErrors.forEach(error => {
            if (error.fieldName === 'ImporterCode') {
              this.form.importersCode.error = error.errorDescription;
            } else if (error.fieldName === 'WaybillNo') {
              this.form.waybillNo.error = error.errorDescription;
            } else if (error.fieldName === 'SupplierRef') {
              this.form.supplierRef.error = error.errorDescription;
            } else if (error.fieldName === 'SerialNo') {
              this.form.serialNo.error = error.errorDescription;
            } else if (error.fieldName === 'PCC') {
              this.form.PCC.error = error.errorDescription;
            } else if (error.fieldName === 'TotalCustomsValue') {
              this.form.totalCustomsValue.error = error.errorDescription;
            } else if (error.fieldName === 'LRN') {
              this.form.LRN.error = error.errorDescription;
            } else if (error.fieldName === 'MRN') {
              this.form.MRN.error = error.errorDescription;
            } else if (error.fieldName === 'CPC') {
              this.form.CPC.error = error.errorDescription;
            } else if (error.fieldName === 'FileRef') {
              this.form.fileRef.error = error.errorDescription;
            } else if (error.fieldName === 'TotalCustomsDuty') {
              this.form.totalCustomsDuty.error = error.errorDescription;
            }
          });
      }
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
