import { Component, OnInit, ViewChild } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Router } from '@angular/router';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';

@Component({
  selector: 'app-form-sad500',
  templateUrl: './form-sad500.component.html',
  styleUrls: ['./form-sad500.component.scss']
})
export class FormSAD500Component implements OnInit {

  constructor(private themeService: ThemeService, private userService: UserService, private transactionService: TransactionService,
              private router: Router) { }

@ViewChild(NotificationComponent, { static: true })
private notify: NotificationComponent;

currentUser = this.userService.getCurrentUser();
attachmentID: number;

currentTheme: string;
  form = {
  serialNo: {
  value: null,
  },
  LRN: {
  value: null,
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
  totalCustomsValue: {
    value: null,
  },
};

  ngOnInit() {
    this.themeService.observeTheme().subscribe(value => this.currentTheme = value);
    this.transactionService.observerCurrentAttachment().subscribe((curr: { transactionID: number, attachmentID: number }) => {
      if (curr !== null || curr !== undefined) {
        this.attachmentID = curr.attachmentID;
      }
    });
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
}
