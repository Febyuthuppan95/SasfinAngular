import { Component, OnInit, ViewChild } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Router } from '@angular/router';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { CaptureService } from 'src/app/services/capture.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ICIListResponse } from 'src/app/models/HttpResponses/ICI';

@Component({
  selector: 'app-form-import-clearing-instruction',
  templateUrl: './form-import-clearing-instruction.component.html',
  styleUrls: ['./form-import-clearing-instruction.component.scss']
})
export class FormImportClearingInstructionComponent implements OnInit {

  constructor(private themeService: ThemeService, private userService: UserService, private transactionService: TransactionService,
              private router: Router, private captureService: CaptureService) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  private unsubscribe$ = new Subject<void>();

  currentUser = this.userService.getCurrentUser();
  attachmentID: number;
  transactionID: number;

  currentTheme: string;
  form = {
  serialNo: {
  value: null,
  },
  LRN: {
  value: null,
  },
  importersCode: {
  value: null,
  error: null,
  },
  PCC: {
  value: null,
  },
  waybillNo: {
  value: null,
  error: null
  },
  supplierRef: {
  value: null,
  },
  MRN: {
  value: null,
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
        this.transactionID = curr.transactionID;
        this.loadICI();
      }
    });
  }

  submit($event) {
    $event.preventDefault();

    const requestModel = {
    userID: this.currentUser.userID,
    specificICIID: this.attachmentID,
    serialNo: this.form.serialNo.value,
    lrn: this.form.LRN.value,
    importersCode: this.form.importersCode.value,
    pcc: this.form.PCC.value,
    waybillNo: this.form.waybillNo.value,
    supplierRef: this.form.supplierRef.value,
    mrn: this.form.MRN.value,
    isDeleted: 0,
    attachmentStatus: 2,
    };

    this.captureService.iciUpdate(requestModel).then(
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

  loadICI() {
    this.captureService.iciList(
      {
        userID: this.currentUser.userID,
        specificICIID: this.attachmentID,
        transactionID: this.transactionID,
        rowStart: 1,
        rowEnd: 15,
        orderBy: '',
        orderDirection: 'DESC',
        filter: ''

      }).then(
      (res: ICIListResponse) => {
        this.form.waybillNo.value = res.clearingInstructions[0].waybillNo;
        this.form.waybillNo.error = res.clearingInstructions[0].waybillNoError;
        this.form.supplierRef.value = res.clearingInstructions[0].supplierRef;
        this.form.supplierRef.value = res.clearingInstructions[0].supplierRefError;
        this.form.importersCode.value = res.clearingInstructions[0].importersCode;
        this.form.importersCode.error = res.clearingInstructions[0].importersCodeError;
        this.form.supplierRef.value = res.clearingInstructions[0].supplierRef;
        this.form.supplierRef.value = res.clearingInstructions[0].supplierRefError;
      },
      (msg) => {
        console.log(msg);
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
