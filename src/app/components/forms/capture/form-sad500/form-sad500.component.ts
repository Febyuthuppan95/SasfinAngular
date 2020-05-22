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
import { SPSAD500LineList, SAD500Line, SADLineCaptureThatSHOULDWorks } from 'src/app/models/HttpResponses/SAD500Line';
import { AllowIn, KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { SubmitDialogComponent } from 'src/app/layouts/capture-layout/submit-dialog/submit-dialog.component';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { CompanyService } from 'src/app/services/Company.Service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-form-sad500',
  templateUrl: './form-sad500.component.html',
  styleUrls: ['./form-sad500.component.scss']
})
export class FormSAD500Component implements OnInit, AfterViewInit, OnDestroy {
  disabledwaybillNo: boolean;
  waybillNoOReason: string;
  disabledserialNo: boolean;
  serialNoOReason: string;
  disabledPCC: boolean;
  PCCOReason: string;
  disabledsupplierRef: boolean;
  supplierRefOReason: string;
  disabledtotalCustomsValue: boolean;
  totalCustomsValueOReason: string;
  disabledLRN: boolean;
  LRNOReason: string;
  disabledMRN: boolean;
  MRNOReason: string;
  disabledCPC: boolean;
  CPCOReason: string;
  disabledimportersCode: boolean;
  importersCodeOReason: string;
  disabledfileRef: boolean;
  fileRefOReason: string;
  totalCustomsDutyOReason: string;
  disabledtotalCustomsDuty: boolean;
  SADOriginalID: number;
  LinesValid = false;
  vocStatus = false;

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

reason: string;
referenceNo: string;


voccontrol1 = new FormControl(null, [Validators.required]);
voccontrol2 = new FormControl(null, [Validators.required]);
voccontrol3 = new FormControl(null, [Validators.required]);


SADForm = new FormGroup({
  sadcontrol1: new FormControl(null, [Validators.required]),
  sadcontrol1a: new FormControl(null),
  sadcontrol2: new FormControl(null, [Validators.required]),
  sadcontrol2a: new FormControl(null),
  sadcontrol3: new FormControl(null, [Validators.required]),
  sadcontrol3a: new FormControl(null),
  sadcontrol4: new FormControl(null, [Validators.required]),
  sadcontrol4a: new FormControl(null),
  sadcontrol5: new FormControl(null, [Validators.required]),
  sadcontrol5a: new FormControl(null),
  sadcontrol6: new FormControl(null, [Validators.required]),
  sadcontrol6a: new FormControl(null),
  sadcontrol7: new FormControl(null, [Validators.required]),
  sadcontrol7a: new FormControl(null),
  sadcontrol8: new FormControl(null, [Validators.required]),
  sadcontrol8a: new FormControl(null),
  sadcontrol9: new FormControl(null, [Validators.required]),
  sadcontrol9a: new FormControl(null),
  sadcontrol10: new FormControl(null, [Validators.required]),
  sadcontrol10a: new FormControl(null),
  sadcontrol11: new FormControl(null, [Validators.required]),
  sadcontrol11a: new FormControl(null),
  sadcontrol12: new FormControl(null, [Validators.required])
});


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
              {
                if (!this.dialogOpen) {
                  this.dialogOpen = true;
                  this.dialog.open(SubmitDialogComponent).afterClosed().subscribe((status: boolean) => {
                    this.dialogOpen = false;
                    if (status) {
                      this.saveLines();
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
      if (res.rowCount !== 0) {
        this.vocSAD500ID = res.vocs[0].sad500ID;
        this.SADOriginalID = res.vocs[0].originalID;
        this.reason = res.vocs[0].reason;
        this.referenceNo = res.vocs[0].referenceNo;
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

    if (this.attachmentType === 'VOC') { // Save VOC Header
      this.vocStatus = true;
      if (this.voccontrol1.valid && this.voccontrol2.valid && this.voccontrol3.valid && this.LinesValid) {
        const VOCrequestModel = {
          userID: this.currentUser.userID,
          vocID: this.attachmentID,
          referenceNo: this.referenceNo,
          reason: this.reason,
          mrn: this.form.MRN.value,
          attachmentStatusID: 3,
          isDeleted: 0,
        };

        this.captureService.vocUpdate(VOCrequestModel).then(
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
      } else {
        this.snackbar.open(`Please fill in the all VOC header data`, '', {
          duration: 3000,
          panelClass: ['capture-snackbar-error'],
          horizontalPosition: 'center',
        });
      }
    } else {
      this.vocStatus = true;
    }
    if (this.SADForm.valid && this.LinesValid && this.vocStatus) {
      const requestModel = {
        userID: this.currentUser.userID,
        SAD500ID: this.attachmentType === 'VOC' ? this.vocSAD500ID : this.attachmentID,
        serialNo: this.form.serialNo.value,
        lrn: this.form.LRN.value,
        rebateCode: this.form.rebateCode.value,
        totalCustomsValue: this.form.totalCustomsValue.value,
        pcc: this.form.PCC.value,
        cpc: this.form.CPC.value,
        waybillNo: this.form.waybillNo.value,
        supplierRef: this.form.supplierRef.value,
        mrn: this.form.MRN.value,
        attachmentStatusID: 3,
        importersCode: this.form.importersCode.value,
        fileRef: this.form.fileRef.value,
        totalDuty: this.form.totalCustomsDuty.value,
        isDeleted: 0,

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
          console.log(JSON.stringify(msg));
          this.notify.errorsmsg('Failure', 'Cannot reach server');
        }
      );
    } else {
      if (this.LinesValid && !this.SADForm.valid) {
        this.snackbar.open(`Please fill in the all header data`, '', {
          duration: 3000,
          panelClass: ['capture-snackbar-error'],
          horizontalPosition: 'center',
        });
      }
    }

    this.vocStatus = false;

  }

  updateLine(obj: SAD500Line) {
    const requestModel = {
      userID: this.currentUser.userID,
      sad500ID: this.attachmentType === 'VOC' ? this.vocSAD500ID : this.attachmentID,
      specificSAD500LineID: obj.sad500LineID,
      unitOfMeasureID: obj.unitOfMeasureID,
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

          this.snackbar.open(`Line #${this.lineQueue.length} added to queue`, '', {
            duration: 3000,
            panelClass: ['capture-snackbar'],
            horizontalPosition: 'center',
          });

          this.loadLines();
          this.lines = -1;
          this.focusLineData = null;
        }
      },
      (msg) => {
        console.log(JSON.stringify(msg));
        this.notify.errorsmsg('Failure', 'Cannot reach server');
      }
    );
  }

  loadCapture() {
    this.captureService.sad500Get({
      userID: this.currentUser.userID,
      specificID: this.attachmentType === 'VOC' ? this.vocSAD500ID : this.attachmentID,
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
        this.form.importersCode.value = res.importersCode;

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
    const requestModel = {
      userID: this.currentUser.userID,
      transactionID: this.transactionID,
      sad500ID: this.attachmentType === 'VOC' ? this.SADOriginalID : this.attachmentID,
      specificSAD500LineID: -1,
      filter:  '',
      orderBy: '',
      orderByDirection: '',
      rowStart: 1,
      rowEnd: 1000000,
    };

    this.captureService.sad500LineList(requestModel).then(
      (res: SPSAD500LineList) => {
        console.log('res');
        console.log(res.lines);
        this.sad500CreatedLines = res.lines;
        if (this.sad500CreatedLines.length > 0) {
          this.LinesValid = true;
        }

        this.lines = this.sad500CreatedLines.length -1;
        if (this.lines > -1) {
            this.focusLineData = this.sad500CreatedLines[this.lines - 1];
        }
      },
      (msg) => {
        console.log(JSON.stringify(msg));
      }
    );
  }

  addToQueue(obj: SAD500LineCreateRequest) {
    obj.userID = this.currentUser.userID;
    obj.sad500ID = this.attachmentType === 'VOC' ? this.vocSAD500ID : this.attachmentID;
    obj.isPersist = false;

    this.lineQueue.push(obj);
    this.sad500CreatedLines.push(obj);

    this.focusLineForm = !this.focusLineForm;
    this.focusLineData = null;
    this.lines = -1;

    this.snackbar.open(`Line #${this.lineQueue.length} added to queue`, '', {
      duration: 3000,
      panelClass: ['capture-snackbar'],
      horizontalPosition: 'center',
    });
  }

  saveLines(obj?: SAD500LineCreateRequest) {

    if (this.LinesValid && this.SADForm.valid) {

      if (obj !== null && obj !== undefined) {

        delete obj.isPersist;
        delete obj.rowNum;
        delete obj.saved;
        delete obj.failed;
        delete obj.updateSubmit;


        const perfect = {
          userID: this.currentUser.userID,
          sad500ID: this.vocSAD500ID,
          tariffID: obj.tariffID = -1 ? null : obj.tariffID,
          unitOfMeasureID: obj.unitOfMeasureID,
          originalLineID: obj.sad500LineID,
          cooID: obj.cooID,
          replacedByLineID: -1,
          lineNo: obj.lineNo,
          customsValue: obj.customsValue,
          previousDeclaration: obj.previousDeclaration,
          quantity: obj.quantity,
          duty: obj.duty,
          supplyUnit: obj.supplyUnit,

          lineNoOBit: obj.lineNoOBit,
          lineNoOUserID: obj.lineNoOUserID,
          lineNoODate: obj.lineNoODate,
          lineNoOReason: obj.lineNoOReason,

          customsValueOBit: obj.customsValueOBit,
          customsValueOUserID: obj.customsValueOUserID,
          customsValueODate: obj.customsValueODate,
          customsValueOReason: obj.customsValueOReason,

          quantityOBit: obj.quantityOBit,
          quantityOUserID: obj.quantityOUserID,
          quantityODate: obj.quantityODate,
          quantityOReason: obj.quantityOReason,

          previousDeclarationOBit: obj.previousDeclarationOBit,
          previousDeclarationOUserID: obj.previousDeclarationOUserID,
          previousDeclarationODate: obj.previousDeclarationODate,
          previousDeclarationOReason: obj.previousDeclarationOReason,

          dutyOBit: obj.dutyOBit,
          dutyOUserID: obj.dutyOUserID,
          dutyODate: obj.dutyODate,
          dutyOReason: obj.dutyOReason,

          vatOBit: obj.vatOBit,
          vatOUserID: obj.vatOUserID,
          vatODate: obj.vatODate,
          vatOReason: obj.vatOReason,

          supplyUnitOBit: obj.supplyUnitOBit,
          supplyUnitOUserID: obj.supplyUnitOUserID,
          supplyUnitODate: obj.supplyUnitODate,
          supllyUnitOReason: obj.supllyUnitOReason,
        };

        this.captureService.sad500LineAdd(perfect).then(
          (res: { outcome: string; outcomeMessage: string; createdID: number }) => {
            if (res.outcome === 'SUCCESS') {
              this.snackbar.open(`Line added successfully`, '', {
                duration: 3000,
                panelClass: ['capture-snackbar'],
                horizontalPosition: 'center',
            });
              const currentLine = obj;

              if (currentLine.duties) {
                if (currentLine.duties.length > 0) {
                  currentLine.duties.forEach((duty) => duty.sad500Line = res.createdID);
                  this.dutyIndex = 0;
                  this.saveLineDuty(currentLine.duties[0]);
                }
              }
            } else {
              console.log('Line not saved');
            }
          },
          (msg) => {
            console.log(JSON.stringify(msg));
          }
        );
      } else {
        if (this.lineIndex < this.lineQueue.length && this.attachmentType !== 'VOC') {

          const lineCreate: any = this.lineQueue[this.lineIndex];
          delete lineCreate.isPersist;
          const perfect: SADLineCaptureThatSHOULDWorks = lineCreate;
          this.captureService.sad500LineAdd(perfect).then(
            (res: { outcome: string; outcomeMessage: string; createdID: number }) => {
              if (res.outcome === 'SUCCESS') {

                const currentLine = this.lineQueue[this.lineIndex];

                if (currentLine.duties) {
                  if (currentLine.duties.length > 0) {
                    currentLine.duties.forEach((duty) => duty.sad500Line = res.createdID);
                    this.dutyIndex = 0;
                    this.saveLineDuty(currentLine.duties[0]);
                  } else {
                    this.nextLineAsync();
                  }
                } else {
                  this.nextLineAsync();
                }
              } else {
                console.log('Line not saved');
              }
            },
            (msg) => {
              console.log(JSON.stringify(msg));
            }
          );
        } else {
          this.submit();
        }
      }
    } else if (!this.LinesValid && this.SADForm.valid) {
      this.snackbar.open(`Please fill in the all line data`, '', {
        duration: 3000,
        panelClass: ['capture-snackbar-error'],
        horizontalPosition: 'center',
      });
    } else if (!this.LinesValid && !this.SADForm.valid) {
      this.snackbar.open(`Please fill in the all header and line data`, '', {
        duration: 3000,
        panelClass: ['capture-snackbar-error'],
        horizontalPosition: 'center',
      });
    } else if (this.LinesValid && !this.SADForm.valid) {
      this.snackbar.open(`Please fill in the all header data`, '', {
        duration: 3000,
        panelClass: ['capture-snackbar-error'],
        horizontalPosition: 'center',
      });
    }
  }

  CathLinesValid(linestatus: boolean) {
    this.LinesValid = linestatus;
  }

  saveLineDuty(line: Duty) {
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
  cancelLine() {
    this.focusLineData = null;
    console.log(this.sad500CreatedLines.length);
    this.lines = this.sad500CreatedLines.length - 1;
    this.focusLineData = this.sad500CreatedLines[this.lines];
}

  OverridewaybillNoClick() {
    this.form.waybillNo.OUserID = this.currentUser.userID;
    this.form.waybillNo.OBit = true;
    this.form.waybillNo.ODate = new Date();
    this.disabledwaybillNo = false;
    this.waybillNoOReason = '';
  }

  OverridewaybillNoExcept() {
    // this.form.importersCode.OReason = reason;
    this.disabledwaybillNo = true;
  }

  UndoOverridewaybillNo() {
    this.form.waybillNo.OUserID = null;
    this.form.waybillNo.OBit = null;
    this.form.waybillNo.ODate = null;
    this.form.waybillNo.OReason = null;
    this.waybillNoOReason = '';
    this.disabledwaybillNo = false;
  }

  OverrideserialNoClick() {
    this.form.serialNo.OUserID = this.currentUser.userID;
    this.form.serialNo.OBit = true;
    this.form.serialNo.ODate = new Date();
    this.disabledserialNo = false;
    this.serialNoOReason = '';
  }

  OverrideserialNoExcept() {
    // this.form.importersCode.OReason = reason;
    this.disabledserialNo = true;
  }

  UndoOverrideserialNo() {
    this.form.serialNo.OUserID = null;
    this.form.serialNo.OBit = null;
    this.form.serialNo.ODate = null;
    this.form.serialNo.OReason = null;
    this.serialNoOReason = '';
    this.disabledserialNo = false;
  }

  OverridePCCClick() {
    this.form.PCC.OUserID = this.currentUser.userID;
    this.form.PCC.OBit = true;
    this.form.PCC.ODate = new Date();
    this.disabledPCC = false;
    this.PCCOReason = '';
  }

  OverridePCCExcept() {
    // this.form.importersCode.OReason = reason;
    this.disabledPCC = true;
  }

  UndoOverridePCC() {
    this.form.PCC.OUserID = null;
    this.form.PCC.OBit = null;
    this.form.PCC.ODate = null;
    this.form.PCC.OReason = null;
    this.PCCOReason = '';
    this.disabledPCC = false;
  }

  OverridesupplierRefClick() {
    this.form.supplierRef.OUserID = this.currentUser.userID;
    this.form.supplierRef.OBit = true;
    this.form.supplierRef.ODate = new Date();
    this.disabledsupplierRef = false;
    this.supplierRefOReason = '';
  }

  OverridesupplierRefExcept() {
    // this.form.importersCode.OReason = reason;
    this.disabledsupplierRef = true;
  }

  UndoOverridesupplierRef() {
    this.form.supplierRef.OUserID = null;
    this.form.supplierRef.OBit = null;
    this.form.supplierRef.ODate = null;
    this.form.supplierRef.OReason = null;
    this.supplierRefOReason = '';
    this.disabledsupplierRef = false;
  }

  OverridetotalCustomsValueClick() {
    this.form.totalCustomsValue.OUserID = this.currentUser.userID;
    this.form.totalCustomsValue.OBit = true;
    this.form.totalCustomsValue.ODate = new Date();
    this.disabledtotalCustomsValue = false;
    this.totalCustomsValueOReason = '';
  }

  OverridetotalCustomsValueExcept() {
    // this.form.importersCode.OReason = reason;
    this.disabledtotalCustomsValue = true;
  }

  UndoOverridetotalCustomsValue() {
    this.form.totalCustomsValue.OUserID = null;
    this.form.totalCustomsValue.OBit = null;
    this.form.totalCustomsValue.ODate = null;
    this.form.totalCustomsValue.OReason = null;
    this.totalCustomsValueOReason = '';
    this.disabledtotalCustomsValue = false;
  }

  OverrideLRNClick() {
    this.form.LRN.OUserID = this.currentUser.userID;
    this.form.LRN.OBit = true;
    this.form.LRN.ODate = new Date();
    this.disabledLRN = false;
    this.LRNOReason = '';
  }

  OverrideLRNExcept() {
    // this.form.importersCode.OReason = reason;
    this.disabledLRN = true;
    console.log(this.form.LRN);
  }

  UndoOverrideLRN() {
    this.form.LRN.OUserID = null;
    this.form.LRN.OBit = null;
    this.form.LRN.ODate = null;
    this.form.LRN.OReason = null;
    this.LRNOReason = '';
    this.disabledLRN = false;
  }

  OverrideMRNClick() {
    this.form.MRN.OUserID = this.currentUser.userID;
    this.form.MRN.OBit = true;
    this.form.MRN.ODate = new Date();
    this.disabledMRN = false;
    this.MRNOReason = '';
  }

  OverrideMRNExcept() {
    // this.form.importersCode.OReason = reason;
    this.disabledMRN = true;
    console.log(this.form.MRN);
  }

  UndoOverrideMRN() {
    this.form.MRN.OUserID = null;
    this.form.MRN.OBit = null;
    this.form.MRN.ODate = null;
    this.form.MRN.OReason = null;
    this.MRNOReason = '';
    this.disabledMRN = false;
  }

  OverrideCPCClick() {
    this.form.CPC.OUserID = this.currentUser.userID;
    this.form.CPC.OBit = true;
    this.form.CPC.ODate = new Date();
    this.disabledCPC = false;
    this.CPCOReason = '';
  }

  OverrideCPCExcept() {
    // this.form.importersCode.OReason = reason;
    this.disabledCPC = true;
    console.log(this.form.CPC);
  }

  UndoOverrideCPC() {
    this.form.CPC.OUserID = null;
    this.form.CPC.OBit = null;
    this.form.CPC.ODate = null;
    this.form.CPC.OReason = null;
    this.CPCOReason = '';
    this.disabledCPC = false;
  }

  OverrideimportersCodeClick() {
    this.form.importersCode.OUserID = this.currentUser.userID;
    this.form.importersCode.OBit = true;
    this.form.importersCode.ODate = new Date();
    this.disabledimportersCode = false;
    this.importersCodeOReason = '';
  }

  OverrideimportersCodeExcept() {
    // this.form.importersCode.OReason = reason;
    this.disabledimportersCode = true;
    console.log(this.form.importersCode);
  }

  UndoOverrideimportersCode() {
    this.form.importersCode.OUserID = null;
    this.form.importersCode.OBit = null;
    this.form.importersCode.ODate = null;
    this.form.importersCode.OReason = null;
    this.importersCodeOReason = '';
    this.disabledimportersCode = false;
  }

  OverridefileRefClick() {
    this.form.fileRef.OUserID = this.currentUser.userID;
    this.form.fileRef.OBit = true;
    this.form.fileRef.ODate = new Date();
    this.disabledfileRef = false;
    this.fileRefOReason = '';
  }

  OverridefileRefExcept() {
    // this.form.importersCode.OReason = reason;
    this.disabledfileRef = true;
    console.log(this.form.fileRef);
  }

  UndoOverridefileRef() {
    this.form.fileRef.OUserID = null;
    this.form.fileRef.OBit = null;
    this.form.fileRef.ODate = null;
    this.form.fileRef.OReason = null;
    this.fileRefOReason = '';
    this.disabledfileRef = false;
  }

  OverridetotalCustomsDutyClick() {
    this.form.totalCustomsDuty.OUserID = this.currentUser.userID;
    this.form.totalCustomsDuty.OBit = true;
    this.form.totalCustomsDuty.ODate = new Date();
    this.disabledtotalCustomsDuty = false;
    this.totalCustomsDutyOReason = '';
  }

  OverridetotalCustomsDutyExcept() {
    // this.form.importersCode.OReason = reason;
    this.disabledtotalCustomsDuty = true;
    console.log(this.form.totalCustomsDuty);
  }

  UndoOverridetotalCustomsDuty() {
    this.form.totalCustomsDuty.OUserID = null;
    this.form.totalCustomsDuty.OBit = null;
    this.form.totalCustomsDuty.ODate = null;
    this.form.totalCustomsDuty.OReason = null;
    this.totalCustomsDutyOReason = '';
    this.disabledtotalCustomsDuty = false;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
