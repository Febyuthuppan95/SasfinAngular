import { ValidateService } from 'src/app/services/Validation.Service';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { SnackbarModel } from './../../../../models/StateModels/SnackbarModel';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Router } from '@angular/router';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { CaptureService } from 'src/app/services/capture.service';
import { MatDialog, MatTooltip, MatSnackBar } from '@angular/material';
import { AllowIn, KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { SubmitDialogComponent } from 'src/app/layouts/capture-layout/submit-dialog/submit-dialog.component';
import { CustomsWorksheetListResponse, CustomsWorksheet } from 'src/app/models/HttpResponses/CustomsWorksheet';
import { CustomWorksheetLineReq } from 'src/app/models/HttpRequests/CustomWorksheetLine';
import { CustomWorksheetLinesResponse } from 'src/app/models/HttpResponses/CustomWorksheetLine';
@Component({
  selector: 'app-form-custom-worksheet',
  templateUrl: './form-custom-worksheet.component.html',
  styleUrls: ['./form-custom-worksheet.component.scss']
})
export class FormCustomWorksheetComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private themeService: ThemeService, private userService: UserService, private transactionService: TransactionService,
              private router: Router, private captureService: CaptureService, private dialog: MatDialog,
              private eventService: EventService, private snackbar: MatSnackBar,
              private snackbarService: HelpSnackbar, validateService: ValidateService) { }

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
transactionID: number;
linePreview = -1;
lines = -1;
focusMainForm: boolean;
focusLineForm: boolean;
focusLineData: CustomWorksheetLineReq = null;
private unsubscribe$ = new Subject<void>();

currentTheme: string;
loader: boolean;

lineQueue: CustomWorksheetLineReq[] = [];
linesCreated: CustomWorksheetLineReq[] = [];
lineState: string;
lineErrors: CustomWorksheetLineReq[] = [];
toggleLines = false;

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
  }
};

lineIndex = 0;
dialogOpen = false;

  ngOnInit() {

    console.log('worksheet');
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(value => this.currentTheme = value);

    this.eventService.observeCaptureEvent()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(() => this.saveLines());

    this.transactionService.observerCurrentAttachment()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((curr: { transactionID: number, attachmentID: number }) => {
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

  submit() {
    const requestModel = {
      userID: this.currentUser.userID,
      customworksheetID: this.attachmentID,
      transactionID: this.transactionID,
      fileRef: this.form.fileRef.value,
      lrn: this.form.LRN.value,
      isDeleted: 0,
      attachmentStatusID: 3,
      waybillNo: this.form.waybillNo.value,

      waybillNoOBit: this.form.waybillNo.OBit,
      waybillNoOUserID: this.form.waybillNo.OUserID,
      waybillNoODate: this.form.waybillNo.ODate,
      waybillNoOReason: this.form.waybillNo.OReason,

      lrnOBit: this.form.LRN.OBit,
      lrnOUserID: this.form.LRN.OUserID,
      lrnODate: this.form.LRN.ODate,
      lrnOReason: this.form.LRN.OReason,

      fileRefOBit: this.form.fileRef.OBit,
      fileRefOUserID: this.form.fileRef.OUserID,
      fileRefODate: this.form.fileRef.ODate,
      fileRefOReason: this.form.fileRef.OReason,
    };

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
        console.log(JSON.stringify(msg));
        this.notify.errorsmsg('Failure', 'Cannot reach server');
      }
    );
  }

  updateLine(obj: CustomWorksheetLineReq) {
    this.captureService.customWorksheetLineAdd(obj).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
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
    this.captureService.customWorksheetList({
      customsWorksheetID: this.attachmentID,
      userID: this.currentUser.userID,
      transactionID: this.transactionID,
      rowStart: 1,
      rowEnd: 10,
      filter: '',
      orderBy: '',
      orderByDirection: '',
    }).then(
      (res: CustomsWorksheetListResponse) => {
        if (res.customsWorksheets.length === 1) {
          this.form.LRN.value = res.customsWorksheets[0].lrn;
          this.form.LRN.error = res.customsWorksheets[0].lrnError;
          this.form.fileRef.value = res.customsWorksheets[0].fileRef;
          this.form.fileRef.error = res.customsWorksheets[0].fileRefError;
          this.form.waybillNo.value = res.customsWorksheets[0].waybillNo;
          this.form.waybillNo.error = res.customsWorksheets[0].waybillNoError;

          this.form .waybillNo.OBit = res.customsWorksheets[0].waybillNoOBit;
          this.form .waybillNo.OUserID = res.customsWorksheets[0].waybillNoOUserID;
          this.form .waybillNo.ODate = res.customsWorksheets[0].waybillNoODate;
          this.form .waybillNo.OReason = res.customsWorksheets[0].waybillNoOReason;

          this.form .fileRef.OBit = res.customsWorksheets[0].fileRefOBit;
          this.form .fileRef.OUserID = res.customsWorksheets[0].fileRefOUserID;
          this.form .fileRef.ODate = res.customsWorksheets[0].fileRefODate;
          this.form .fileRef.OReason = res.customsWorksheets[0].fileRefOReason;

          this.form.LRN.OBit = res.customsWorksheets[0].lrnOBit;
          this.form.LRN.OUserID = res.customsWorksheets[0].lrnOUserID;
          this.form.LRN.ODate = res.customsWorksheets[0].lrnODate;
          this.form.LRN.OReason = res.customsWorksheets[0].lrnOReason;

        }
      },
      (msg) => {}
    );
  }

  loadLines() {
    this.captureService.customWorksheetLineList({
      userID: this.currentUser.userID,
      customsWorksheetID: this.attachmentID,
      rowStart: 1,
      rowEnd: 1000,
      orderBy: '',
      orderByDirection: '',
      filter: ''
      }).then((res: CustomWorksheetLinesResponse) => {
        this.linesCreated = res.lines;
        this.lines = this.linesCreated.length;
        if (this.lines > -1) {
          this.focusLineData = this.linesCreated[this.lines - 1];
        }

        // this.lineErrors = res.lines.filter(x => x.commonFactor !== null
        //   || x.quantityError !== null
        //   || x.unitOfMeasureError !== null || x.tariffError !== null);
      },
      (msg) => {
      }
    );
  }

  addToQueue(obj: CustomWorksheetLineReq) {
    obj.customWorksheetID = this.attachmentID;
    obj.isPersistant = false;
    obj.userID = this.currentUser.userID;

    this.lineQueue.push(obj);
    this.linesCreated.push(obj);
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
            console.log(this.lineQueue);
            this.captureService.customWorksheetLineAdd(this.lineQueue[this.lineIndex]).then(
              (res: { outcome: string; outcomeMessage: string; createdID: number }) => {
                if (res.outcome === 'SUCCESS') {
                  this.nextLineAsync();
                  //console.log('Line saved');
                } else {
                 // console.log('Line not saved');
                }
              },
              (msg) => {
                console.log(`Client Error: ${JSON.stringify(msg)}`);
              }
            );
          } else {
            this.submit();
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
    console.log(this.lines);
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
  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
