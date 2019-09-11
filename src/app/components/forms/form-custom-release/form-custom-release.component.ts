import { Component, OnInit, ViewChild } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { NotificationComponent } from '../../notification/notification.component';
import { UserService } from 'src/app/services/user.Service';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-custom-release',
  templateUrl: './form-custom-release.component.html',
  styleUrls: ['./form-custom-release.component.scss']
})
export class FormCustomReleaseComponent implements OnInit {

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
    importersCode: {
      value: null,
    },
    PCC: {
      value: null,
    },
    FOB: {
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
      importersCode: this.form.importersCode.value,
      pcc: this.form.PCC.value,
      fob: this.form.FOB.value,
      waybillNo: this.form.waybillNo.value,
      supplierRef: this.form.supplierRef.value,
      mrn: this.form.MRN.value,
      isDeleted: 0,
    };

    this.transactionService.customsReleaseUpdate(requestModel).then(
      (res: Outcome) => {
        console.log(res);
        if (res.outcome === 'SUCCESS') {
          this.notify.successmsg(res.outcome, res.outcomeMessage);
          setTimeout(() => { this.router.navigate(['transactions', 'attachments']); }, 2000);
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
