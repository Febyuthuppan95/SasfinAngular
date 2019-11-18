import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Router } from '@angular/router';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { CaptureService } from 'src/app/services/capture.service';
import { SAD500Get } from 'src/app/models/HttpResponses/SAD500Get';
import { SAD500LineCreateRequest, SAD500LineUpdateModel } from 'src/app/models/HttpRequests/SAD500Line';
import { MatDialog } from '@angular/material';
import { Sad500LinePreviewComponent } from 'src/app/components/dialogs/sad500-line-preview/sad500-line-preview.component';
import { SPSAD500LineList, SAD500Line } from 'src/app/models/HttpResponses/SAD500Line';
import { AllowIn, KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-form-sad500',
  templateUrl: './form-sad500.component.html',
  styleUrls: ['./form-sad500.component.scss']
})
export class FormSAD500Component implements OnInit, AfterViewInit, OnDestroy {

  constructor(private themeService: ThemeService, private userService: UserService, private transactionService: TransactionService,
              private router: Router, private captureService: CaptureService, private dialog: MatDialog) { }

shortcuts: ShortcutInput[] = [];

@ViewChild(NotificationComponent, { static: true })
private notify: NotificationComponent;

@ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;

currentUser = this.userService.getCurrentUser();
attachmentID: number;
linePreview = -1;
lines = -1;
focusMainForm: boolean;
focusLineForm: boolean;
focusLineData: SAD500Line = null;
private unsubscribe$ = new Subject<void>();

currentTheme: string;

sad500LineQueue: SAD500LineCreateRequest[] = [];
sad500CreatedLines: SAD500Line[] = [];
lineState: string;
lineErrors: SAD500Line[] = null;
toggleLines = false;

form = {
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
};

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(value => this.currentTheme = value);
    this.transactionService.observerCurrentAttachment()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((curr: { transactionID: number, attachmentID: number }) => {
      if (curr !== null || curr !== undefined) {
        this.attachmentID = curr.attachmentID;
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
            if (!this.toggleLines) {
              this.submit();
            }
          }
        },
        {
          key: 'alt + l',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => this.toggleLines = !this.toggleLines
        },
    );

    this.keyboard.select('cmd + f').subscribe(e => console.log(e));
  }

  submit() {
    const requestModel = {
      userID: this.currentUser.userID,
      specificSAD500ID: this.attachmentID,
      serialNo: this.form.serialNo.value,
      lrn: this.form.LRN.value,
      pcc: this.form.PCC.value,
      cpc: this.form.CPC.value,
      waybillNo: this.form.waybillNo.value,
      supplierRef: this.form.supplierRef.value,
      totalCustomsValue: this.form.totalCustomsValue.value,
      mrn: this.form.MRN.value,
      isDeleted: 0,
      attachmentStatusID: 2,
    };

    this.captureService.sad500Update(requestModel).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.notify.successmsg(res.outcome, res.outcomeMessage);
          this.router.navigate(['transaction', 'attachments']);
        } else {
          this.notify.errorsmsg(res.outcome, res.outcomeMessage);
        }
      },
      (msg) => {
        this.notify.errorsmsg('Failure', 'Cannot reach server');
      }
    );
  }

  updateLine(obj: SAD500Line) {
    this.lineState = 'Saving';
    const requestModel: SAD500LineUpdateModel = {
      userID: this.currentUser.userID,
      sad500ID: this.attachmentID,
      specificSAD500LineID: obj.sad500LineID,
      unitOfMeasure: obj.unitOfMeasure,
      unitOfMeasureID: obj.unitOfMeasureID,
      tariff: obj.tariff,
      tariffID: obj.tariffID,
      value: obj.value,
      customsValue: obj.customsValue,
      productCode: obj. productCode,
      isDeleted: 0,
      lineNo: obj.lineNo
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
      specificID: this.attachmentID,
      userID: 3
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
      },
      (msg) => {
      }
    );
  }

  loadLines() {
    this.captureService.sad500LineList({ userID: this.currentUser.userID, sad500ID: this.attachmentID, specificSAD500LineID: -1 }).then(
      (res: SPSAD500LineList) => {
        this.sad500CreatedLines = res.lines;
        if (this.lines > -1) {
          this.focusLineData = this.sad500CreatedLines[this.lines];
        }

        this.lineErrors = res.lines.filter(x => x.valueError !== null
          || x.lineNoError !== null
          || x.productCodeError !== null
          || x.unitOfMeasureError !== null || x.tariffError !== null);
      },
      (msg) => {
      }
    );
  }

  addToQueue(obj: SAD500LineCreateRequest) {
    this.lineState = 'Saving new line';

    obj.userID = this.currentUser.userID;
    obj.sad500ID = this.attachmentID;

    this.captureService.sad500LineAdd(obj).then(
      (res: { outcome: string; outcomeMessage: string; }) => {
        if (res.outcome === 'SUCCESS') {
          this.loadLines();

          this.lineState = 'Saved successfully';
          this.focusLineForm = !this.focusLineForm;
          this.focusLineData = null;
          this.lines = -1;
          setTimeout(() => this.lineState = '', 3000);
        } else {
          this.lineState = 'Failed to save';
          setTimeout(() => this.lineState = '', 3000);
        }
      },
      (msg) => {
        this.lineState = 'Failed to save';
        setTimeout(() => this.lineState = '', 3000);
      }
    );
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
