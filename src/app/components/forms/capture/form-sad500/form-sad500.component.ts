import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Router } from '@angular/router';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { CaptureService } from 'src/app/services/capture.service';
import { SAD500Get } from 'src/app/models/HttpResponses/SAD500Get';
import { SAD500LineCreateRequest } from 'src/app/models/HttpRequests/SAD500Line';
import { MatDialog } from '@angular/material';
import { Sad500LinePreviewComponent } from 'src/app/components/dialogs/sad500-line-preview/sad500-line-preview.component';
import { SPSAD500LineList, SAD500Line } from 'src/app/models/HttpResponses/SAD500Line';
import { AllowIn, KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';

@Component({
  selector: 'app-form-sad500',
  templateUrl: './form-sad500.component.html',
  styleUrls: ['./form-sad500.component.scss']
})
export class FormSAD500Component implements OnInit, AfterViewInit {

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

currentTheme: string;

sad500LineQueue: SAD500LineCreateRequest[] = [];
sad500CreatedLines: SAD500Line[] = [];

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
};

  ngOnInit() {
    this.themeService.observeTheme().subscribe(value => this.currentTheme = value);
    this.transactionService.observerCurrentAttachment().subscribe((curr: { transactionID: number, attachmentID: number }) => {
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
    );

    this.keyboard.select('cmd + f').subscribe(e => console.log(e));
  }

  submit($event) {
    $event.preventDefault();

    const requestModel = {
      userID: this.currentUser.userID,
      specificCustomsReleaseID: this.attachmentID,
      serialNo: this.form.serialNo.value,
      lrn: this.form.LRN.value,
      pcc: this.form.PCC.value,
      waybillNo: this.form.waybillNo.value,
      supplierRef: this.form.supplierRef.value,
      totalCustomsValue: this.form.totalCustomsValue.value,
      mrn: this.form.MRN.value,
      isDeleted: 0,
      attachmentStatusID: 2,
    };

    this.transactionService.customsReleaseUpdate(requestModel).then(
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

  loadCapture() {
    this.captureService.sad500Get({
      specificID: this.attachmentID,
      userID: 3
    }).then(
      (res: SAD500Get) => {
        console.log(res);
        this.form.MRN.value = res.mrn;
        this.form.MRN.error = res.mrnError;
        this.form.serialNo.value = res.serialNo;
        this.form.serialNo.error = res.serialNoError;
        this.form.totalCustomsValue.value = res.importersCode;
        this.form.totalCustomsValue.error = res.importersCodeError;
        this.form.waybillNo.value = res.waybillNo;
        this.form.waybillNo.error = res.waybillNoError;
        this.form.supplierRef.value = res.supplierRef;
        this.form.supplierRef.error = res.supplierRefError;
        this.form.LRN.value = res.lrn;
        this.form.LRN.error = res.lrnError;
        this.form.PCC.value = res.pcc;
        this.form.PCC.error = res.pccError;
      },
      (msg) => {
        console.log(msg);
      }
    );
  }

  loadLines() {
    this.captureService.sad500LineList({ userID: this.currentUser.userID, sad500ID: this.attachmentID, specificSAD500LineID: -1 }).then(
      (res: SPSAD500LineList) => {
        this.sad500CreatedLines = res.lines;
      },
      (msg) => {
        console.log(msg);
      }
    );
  }

  addToQueue(obj: SAD500LineCreateRequest) {

    obj.userID = this.currentUser.userID;
    obj.sad500ID = this.attachmentID;

    this.sad500LineQueue.push(obj);
    const lastIndex = this.sad500LineQueue.length - 1;

    this.captureService.sad500LineAdd(obj).then(
      (res: { outcome: string; outcomeMessage: string; }) => {
        if (res.outcome === 'SUCCESS') {
          this.sad500LineQueue[lastIndex].saved = true;
          this.sad500LineQueue[lastIndex].failed = false;

        } else {
          this.sad500LineQueue[lastIndex].saved = false;
          this.sad500LineQueue[lastIndex].failed = true;
          this.notify.errorsmsg(res.outcome, res.outcomeMessage);
        }
      },
      (msg) => {
        this.sad500LineQueue[lastIndex].failed = true;
        this.notify.errorsmsg('Failure', 'Server error');
      }
    );
  }

  revisitSAD500Line(item: SAD500LineCreateRequest, i?: number) {
    this.lines = i;
    console.log(i);
    console.log(this.lines);
    // this.dialog.open(Sad500LinePreviewComponent, {
    //   data: item,
    //   width: '380px'
    // });
  }

  prevLine() {
    if (this.lines >= 1) {
      this.lines--;
    }
  }

  nextLine() {
    if (this.lines < this.sad500CreatedLines.length -1) {
      this.lines++;
    }

    if (this.lines === -1) {
      this.lines++;
    }
  }

}
