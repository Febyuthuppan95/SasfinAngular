import { ValidateService } from 'src/app/services/Validation.Service';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { SnackbarModel } from './../../../../models/StateModels/SnackbarModel';
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Router } from '@angular/router';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { CaptureService } from 'src/app/services/capture.service';
import { MatDialog, MatTooltip, MatSnackBar } from '@angular/material';
import {
  AllowIn,
  KeyboardShortcutsComponent,
  ShortcutInput,
} from 'ng-keyboard-shortcuts';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { SubmitDialogComponent } from 'src/app/layouts/capture-layout/submit-dialog/submit-dialog.component';
import {
  CustomsWorksheetListResponse,
  CustomsWorksheet,
} from 'src/app/models/HttpResponses/CustomsWorksheet';
import { CustomWorksheetLineReq } from 'src/app/models/HttpRequests/CustomWorksheetLine';
// tslint:disable-next-line: max-line-length
import {
  CustomWorksheetLinesResponse,
  CustomWorksheetLine,
  CWSLineCaptureThatSHOULDWorks,
} from 'src/app/models/HttpResponses/CustomWorksheetLine';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ObjectHelpService } from 'src/app/services/ObjectHelp.service';
import { UUID } from 'angular2-uuid';
@Component({
  selector: 'app-form-custom-worksheet',
  templateUrl: './form-custom-worksheet.component.html',
  styleUrls: ['./form-custom-worksheet.component.scss'],
})
export class FormCustomWorksheetComponent
  implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private themeService: ThemeService,
    private userService: UserService,
    private transactionService: TransactionService,
    private router: Router,
    private captureService: CaptureService,
    private dialog: MatDialog,
    private eventService: EventService,
    private snackbar: MatSnackBar,
    private snackbarService: HelpSnackbar,
    validateService: ValidateService,
    private objectHelpService: ObjectHelpService
  ) {}

  shortcuts: ShortcutInput[] = [];

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild(KeyboardShortcutsComponent, { static: true })
  private keyboard: KeyboardShortcutsComponent;

  @ViewChild('sadLinesTooltip', { static: false })
  sadLinesTooltip: MatTooltip;

  @ViewChild('sad500Tooltip', { static: false })
  sad500Tooltip: MatTooltip;

  CWSForm = new FormGroup({
    control1: new FormControl(null),
    control1a: new FormControl(null),
    control2: new FormControl(null, [Validators.required]),
    control2a: new FormControl(null),
    control3: new FormControl(null, [Validators.nullValidator]),
    control3a: new FormControl(null),
  });

  LinesValid: boolean;
  currentUser = this.userService.getCurrentUser();
  attachmentID: number;
  transactionID: number;
  linePreview = -1;
  lines = -1;
  focusMainForm: boolean;
  focusLineForm: boolean;
  focusLineData: CustomWorksheetLine = null;
  private unsubscribe$ = new Subject<void>();

  currentTheme: string;
  loader: boolean;
  help = true;
  lineQueue: CustomWorksheetLine[] = [];
  linesCreated: CustomWorksheetLine[] = [];
  lineState: string;
  lineErrors: CustomWorksheetLine[] = [];
  toggleLines = false;

  disabledfileRef: boolean;
  fileRefOReason: string;
  disabledWay: boolean;
  waybillNoOReason: string;
  disabledLRN: boolean;
  LRNOReason: string;

  form = {
    LRN: {
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
    waybillNo: {
      value: null,
      error: null,
      OBit: null,
      OUserID: null,
      ODate: null,
      OReason: null,
    },
  };

  lineIndex = 0;
  dialogOpen = false;

  ngOnInit() {
    console.log('worksheet');
    this.themeService
      .observeTheme()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => (this.currentTheme = value));

    this.eventService
      .observeCaptureEvent()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((escalation?: boolean) => this.saveLines(escalation));

    this.transactionService
      .observerCurrentAttachment()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((curr: { transactionID: number; attachmentID: number }) => {
        if (curr !== null || curr !== undefined) {
          this.attachmentID = curr.attachmentID;
          this.transactionID = curr.transactionID;
          this.loadCapture();
          this.loadLines();
        }
      });
  }

  ngAfterViewInit(): void {
    this.shortcuts.push(
      {
        key: 'alt + .',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => this.nextLine(),
      },
      {
        key: 'alt + ,',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => this.prevLine(),
      },
      {
        key: 'alt + /',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => (this.focusLineForm = !this.focusLineForm),
      },
      {
        key: 'alt + m',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => {
          this.focusMainForm = !this.focusMainForm;
          this.focusLineData = null;
          this.lines = -1;
        },
      },
      {
        key: 'alt + n',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => {
          this.focusLineForm = !this.focusLineForm;
          this.focusLineData = null;
          this.lines = -1;
        },
      },
      {
        key: 'alt + s',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => {
          {
            if (!this.dialogOpen) {
              this.dialogOpen = true;
              this.dialog
                .open(SubmitDialogComponent)
                .afterClosed()
                .subscribe((status: boolean) => {
                  this.dialogOpen = false;
                  if (status) {
                    this.saveLines();
                  }
                });
            }
          }
        },
      },
      {
        key: 'alt + l',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => {
          this.toggleLines = !this.toggleLines;

          if (this.toggleLines) {
            this.sad500Tooltip.hide();
            this.sadLinesTooltip.show();
            setTimeout(() => {
              this.sadLinesTooltip.hide();
            }, 1000);
          } else {
            this.sadLinesTooltip.hide();
            this.sad500Tooltip.show();
            setTimeout(() => {
              this.sad500Tooltip.hide();
            }, 1000);
          }
        },
      },
      {
        key: 'ctrl + alt + h',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => {
          this.toggelHelpBar();
        },
      }
    );
  }
  toggelHelpBar() {
    this.help = !this.help;
    this.objectHelpService.toggleHelp(this.help);
  }

  submit(escalation?: boolean) {
    if ((this.LinesValid && this.CWSForm.valid) || escalation) {
      const requestModel = {
        userID: this.currentUser.userID,
        customworksheetID: this.attachmentID,
        transactionID: this.transactionID,
        fileRef: this.form.fileRef.value,
        lrn: this.form.LRN.value,
        isDeleted: 0,
        attachmentStatusID: escalation ? 7 : 3,
        waybillNo: this.form.waybillNo.value,

        waybillNoOBit: this.form.waybillNo.OBit,
        waybillNoOUserID: this.form.waybillNo.OUserID,
        waybillNoODate: new Date(this.form.waybillNo.ODate),
        waybillNoOReason: this.form.waybillNo.OReason,

        lrnOBit: this.form.LRN.OBit,
        lrnOUserID: this.form.LRN.OUserID,
        lrnODate: new Date(this.form.LRN.ODate),
        lrnOReason: this.form.LRN.OReason,

        fileRefOBit: this.form.fileRef.OBit,
        fileRefOUserID: this.form.fileRef.OUserID,
        fileRefODate: new Date(this.form.fileRef.ODate),
        fileRefOReason: this.form.fileRef.OReason,
      };

      console.log(requestModel);

      this.captureService.customWorksheetUpdate(requestModel).then(
        (res: Outcome) => {
          if (res.outcome === 'SUCCESS') {
            this.notify.successmsg(res.outcome, res.outcomeMessage);
            this.router.navigate(['transaction/capturerlanding']);
          } else {
            this.notify.errorsmsg(res.outcome, res.outcomeMessage);
          }
        },
        (msg) => {
          console.log(msg);
          this.notify.errorsmsg('Failure', 'Cannot reach server');
        }
      );
    } else {
      this.snackbar.open(`Please fill in the all header data`, '', {
        duration: 3000,
        panelClass: ['capture-snackbar-error'],
        horizontalPosition: 'center',
      });
    }
  }

  updateLine(obj: CustomWorksheetLineReq) {
    const updateModel = {
      userID: this.currentUser.userID,
      customsWorksheetID: this.attachmentID,
      currencyID: obj.currencyID,
      unitOfMeasureID: obj.unitOfMeasureID,
      cooID: obj.cooID,
      tariffID: obj.tariffID,
      invoiceNo: obj.invoiceNo,
      commonFactor: obj.commonFactor,
      hsQuantity: obj.hsQuantity,
      foreignInv: obj.foreignInv,
      custVal: obj.custVal,
      duty: obj.duty,
      prodCode: obj.prodCode,
      supplyUnit: obj.supplyUnit,
    };

    this.captureService.customWorksheetLineAdd(updateModel).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.snackbar.open(
            `Line #${this.lineQueue.length} added to queue`,
            '',
            {
              duration: 3000,
              panelClass: ['capture-snackbar'],
              horizontalPosition: 'center',
            }
          );

          this.loadLines();
          this.lines = -1;
          this.focusLineData = null;
        }
      },
      (msg) => {
        this.notify.errorsmsg('Failure', 'Cannot reach server');
      }
    );
  }

  loadCapture() {
    this.captureService
      .customWorksheetList({
        customsWorksheetID: this.attachmentID,
        userID: this.currentUser.userID,
        transactionID: this.transactionID,
        rowStart: 1,
        rowEnd: 15,
        filter: '',
        orderBy: '',
        orderByDirection: '',
      })
      .then(
        (res: CustomsWorksheetListResponse) => {
          console.log(res);
          if (res.customsWorksheets.length === 1) {
            this.form.LRN.value = res.customsWorksheets[0].lrn;
            this.form.LRN.error = res.customsWorksheets[0].lrnError;
            this.CWSForm.controls.control1.setValue(res.customsWorksheets[0].lrn);

            this.form.fileRef.value = res.customsWorksheets[0].fileRef;
            this.form.fileRef.error = res.customsWorksheets[0].fileRefError;
            this.CWSForm.controls.control2.setValue(res.customsWorksheets[0].fileRef);

            this.form.waybillNo.value = res.customsWorksheets[0].waybillNo;
            this.form.waybillNo.error = res.customsWorksheets[0].waybillNoError;
            this.CWSForm.controls.control3.setValue(res.customsWorksheets[0].waybillNo);

            this.form.waybillNo.OBit = res.customsWorksheets[0].waybillNoOBit;
            this.form.waybillNo.OUserID =
              res.customsWorksheets[0].waybillNoOUserID;
            this.form.waybillNo.ODate = res.customsWorksheets[0].waybillNoODate;
            this.form.waybillNo.OReason =
              res.customsWorksheets[0].waybillNoOReason;

            this.form.fileRef.OBit = res.customsWorksheets[0].fileRefOBit;
            this.form.fileRef.OUserID = res.customsWorksheets[0].fileRefOUserID;
            this.form.fileRef.ODate = res.customsWorksheets[0].fileRefODate;
            this.form.fileRef.OReason = res.customsWorksheets[0].fileRefOReason;

            this.form.LRN.OBit = res.customsWorksheets[0].lrnOBit;
            this.form.LRN.OUserID = res.customsWorksheets[0].lrnOUserID;
            this.form.LRN.ODate = res.customsWorksheets[0].lrnODate;
            this.form.LRN.OReason = res.customsWorksheets[0].lrnOReason;

            if (res.attachmentErrors.attachmentErrors.length > 0) {
              res.attachmentErrors.attachmentErrors.forEach((error) => {
                if (error.fieldName === 'WaybillNo') {
                  this.form.waybillNo.error = error.errorDescription;
                } else if (error.fieldName === 'LRN') {
                  this.form.LRN.error = error.errorDescription;
                } else if (error.fieldName === 'FileRef') {
                  this.form.fileRef.error = error.errorDescription;
                }
              });
            }
          }
        },
        (msg) => {}
      );
  }

  loadLines() {
    this.captureService
      .customWorksheetLineList({
        userID: this.currentUser.userID,
        customsWorksheetID: this.attachmentID,
        rowStart: 1,
        rowEnd: 1000,
        orderBy: '',
        orderByDirection: '',
        filter: '',
        transactionID: this.transactionID,
      })
      .then(
        (res: CustomWorksheetLinesResponse) => {
          if (res.lines.length > 0) {
            this.LinesValid = true;
          }
          this.linesCreated = res.lines;
          this.lines = this.linesCreated.length - 1;
          if (this.lines > -1) {
            this.focusLineData = this.linesCreated[this.lines - 1];
          }
        },
        (msg) => {}
      );
  }

  addToQueue(obj: CustomWorksheetLine) {
    obj.generatedID = UUID.UUID();
    obj.customWorksheetID = this.attachmentID;
    obj.isPersistant = false;
    obj.userID = this.currentUser.userID;

    this.lineQueue.push(obj);
    this.linesCreated.push(obj);
    this.focusLineForm = !this.focusLineForm;
    this.focusLineData = null;
    this.lines = -1;

    console.log(obj);

    this.snackbar.open(`Line #${this.lineQueue.length} added to queue`, '', {
      duration: 3000,
      panelClass: ['capture-snackbar'],
      horizontalPosition: 'center',
    });
  }

  saveLines(escalation?: boolean) {
    if ((this.LinesValid && this.CWSForm.valid) || escalation) {
      if (this.lineIndex < this.lineQueue.length) {
        const lineCreate: any = this.lineQueue[this.lineIndex];
        delete lineCreate.isPersist;
        const perfect: CWSLineCaptureThatSHOULDWorks = {
          userID: this.currentUser.userID,
          customsWorksheetID: this.attachmentID,
          currencyID: lineCreate.currencyID,
          unitOfMeasureID: lineCreate.unitOfMeasureID,
          cooID: lineCreate.cooID,
          tariffID: lineCreate.tariffID,
          invoiceNo: lineCreate.invoiceNo,
          commonFactor: lineCreate.commonFactor,
          hsQuantity: lineCreate.hsQuantity,
          foreignInv: lineCreate.foreignInv,
          custVal: lineCreate.custVal,
          duty: lineCreate.duty,
          prodCode: lineCreate.prodCode,
          supplyUnit: lineCreate.supplyUnit,
        };

        console.log(perfect);

        this.captureService.customWorksheetLineAdd(perfect).then(
          (res: {
            outcome: string;
            outcomeMessage: string;
            createdID: number;
          }) => {
            if (res.outcome === 'SUCCESS') {
              this.nextLineAsync();
            }
          },
          (msg) => {
            console.log(`Client Error: ${JSON.stringify(JSON.stringify(msg))}`);
          }
        );
      } else {
        this.submit(escalation);
      }
    } else if (!this.LinesValid && this.CWSForm.valid) {
      this.snackbar.open(`Please fill in the all line data`, '', {
        duration: 3000,
        panelClass: ['capture-snackbar-error'],
        horizontalPosition: 'center',
      });
    } else if (!this.LinesValid && !this.CWSForm.valid) {
      this.snackbar.open(`Please fill in the all header and line data`, '', {
        duration: 3000,
        panelClass: ['capture-snackbar-error'],
        horizontalPosition: 'center',
      });
    } else if (this.LinesValid && !this.CWSForm.valid) {
      this.snackbar.open(`Please fill in the all header data`, '', {
        duration: 3000,
        panelClass: ['capture-snackbar-error'],
        horizontalPosition: 'center',
      });
    }
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

  revisitSAD500Line(item: CustomWorksheetLineReq, i?: number) {
    this.lines = i;
  }

  prevLine() {
    if (this.lines >= 1) {
      this.lines--;
      this.focusLineData = this.linesCreated[this.lines];
    }
  }

  nextLine() {
    if (this.lines < this.linesCreated.length - 1) {
      this.lines++;
      this.focusLineData = this.linesCreated[this.lines];
    }

    if (this.lines === -1) {
      this.lines++;
      this.focusLineData = this.linesCreated[this.lines];
    }
  }

  specificLine(index: number) {
    this.focusLineData = this.linesCreated[index];
  }

  newLine() {
    this.focusLineForm = !this.focusLineForm;
    this.focusLineData = null;
    this.lines = -1;
  }

  deleteLine() {
    this.lineQueue = this.lineQueue.filter((x) => x.generatedID !== this.focusLineData.generatedID);
    this.linesCreated = this.linesCreated.filter((x) => x.generatedID !== this.focusLineData.generatedID);
    this.focusLineForm = false;
    this.focusLineData = null;
    this.lines = -1;
  }

  cancelLine() {
    this.focusLineData = null;
    this.lines = this.linesCreated.length - 1;
    this.focusLineData = this.linesCreated[this.lines];
  }

  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug,
    };

    this.snackbarService.setHelpContext(newContext);
  }

  CathLinesValid(linestatus: boolean) {
    this.LinesValid = linestatus;
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
  }

  UndoOverridefileRef() {
    this.form.fileRef.OUserID = null;
    this.form.fileRef.OBit = null;
    this.form.fileRef.ODate = null;
    this.form.fileRef.OReason = null;
    this.fileRefOReason = '';
    this.disabledfileRef = false;
  }

  OverrideWaybillClick() {
    this.form.waybillNo.OUserID = this.currentUser.userID;
    this.form.waybillNo.OBit = true;
    this.form.waybillNo.ODate = new Date();
    this.disabledWay = false;
    this.waybillNoOReason = '';
  }

  OverrideWaybillExcept() {
    this.disabledWay = true;
  }

  UndoOverrideWaybill() {
    this.form.waybillNo.OUserID = null;
    this.form.waybillNo.OBit = null;
    this.form.waybillNo.ODate = null;
    this.form.waybillNo.OReason = null;
    this.waybillNoOReason = '';
    this.disabledWay = false;
  }

  OverrideLRNClick() {
    this.form.LRN.OUserID = this.currentUser.userID;
    this.form.LRN.OBit = true;
    this.form.LRN.ODate = new Date();
    this.disabledLRN = false;
    this.LRNOReason = '';
  }

  OverrideLRNExcept() {
    this.disabledLRN = true;
  }

  UndoOverrideLRN() {
    this.form.LRN.OUserID = null;
    this.form.LRN.OBit = null;
    this.form.LRN.ODate = null;
    this.form.LRN.OReason = null;
    this.LRNOReason = '';
    this.disabledLRN = false;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
