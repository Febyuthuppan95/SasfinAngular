import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Router } from '@angular/router';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-form-shipping-document',
  templateUrl: './form-shipping-document.component.html',
  styleUrls: ['./form-shipping-document.component.scss']
})
export class FormShippingDocumentComponent implements OnInit, OnDestroy {

  constructor(private themeService: ThemeService, private userService: UserService, private transactionService: TransactionService,
    private router: Router) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  private unsubscribe$ = new Subject<void>();

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
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(value => this.currentTheme = value);
    this.transactionService.observerCurrentAttachment()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((curr: { transactionID: number, attachmentID: number }) => {
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
console.log(res);
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

ngOnDestroy(): void {
	this.unsubscribe$.next();
	this.unsubscribe$.complete();
}
}
