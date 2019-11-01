import { Component, OnInit, ViewChild } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Router } from '@angular/router';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';

@Component({
  selector: 'app-form-shipping-document',
  templateUrl: './form-shipping-document.component.html',
  styleUrls: ['./form-shipping-document.component.scss']
})
export class FormShippingDocumentComponent implements OnInit {

  constructor(private themeService: ThemeService, private userService: UserService, private transactionService: TransactionService,
    private router: Router) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  currentUser = this.userService.getCurrentUser();
  attachmentID: number;

  currentTheme: string;
  form = {
    waybillNo: {
      value: null,
      error: null
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
specificShippingID: this.attachmentID,
waybillNo: this.form.waybillNo.value,
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
