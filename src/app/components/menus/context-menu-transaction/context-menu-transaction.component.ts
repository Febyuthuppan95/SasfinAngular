import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { UserService } from 'src/app/services/user.Service';
import { CompanyService } from 'src/app/services/Company.Service';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';
import { TransactionUpdateResponse } from 'src/app/models/HttpResponses/TransactionUpdateResponse';

@Component({
  selector: 'app-context-menu-transaction',
  templateUrl: './context-menu-transaction.component.html',
  styleUrls: ['./context-menu-transaction.component.scss']
})
export class ContextMenuTransactionComponent implements OnInit {

  // tslint:disable-next-line: max-line-length
  constructor(private router: Router, private userService: UserService, private transactionService: TransactionService, private companyService: CompanyService) { }

  currentUser = this.userService.getCurrentUser();

  @Input() x: number;
  @Input() y: number;
  @Input() transactionID: number;
  @Input() transactionName: string;
  @Input() currentTheme: string;


  @Output() viewTransactionsEmit = new EventEmitter<string>();
  @Output() statusResults = new EventEmitter<Outcome>();

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  ngOnInit() {
  }

  viewTransactionAttachments() {
    // tslint:disable-next-line: max-line-length
    this.transactionService.setCurrentAttachment({ transactionID: this.transactionID, attachmentID: -1, docType: '', transactionName: this.transactionName });
    this.router.navigate(['transaction', 'attachments']);
  }

  viewSAD500s() {
    // tslint:disable-next-line: max-line-length
    this.transactionService.setCurrentAttachment({ transactionID: this.transactionID, attachmentID: -1, docType: '', transactionName: this.transactionName });
    this.router.navigate(['transaction', 'sad500s']);
  }

  viewImportClearin() {
    // tslint:disable-next-line: max-line-length
    this.transactionService.setCurrentAttachment({ transactionID: this.transactionID, attachmentID: -1, docType: '', transactionName: this.transactionName });
    this.router.navigate(['transaction', 'import-clearing-instruction']);
  }

  viewCRN() {
    // tslint:disable-next-line: max-line-length
    this.transactionService.setCurrentAttachment({ transactionID: this.transactionID, attachmentID: -1, docType: '', transactionName: this.transactionName });
    this.router.navigate(['transaction', 'custom-release-notification']);
  }

  viewInvoices() {
    // tslint:disable-next-line: max-line-length
    this.transactionService.setCurrentAttachment({ transactionID: this.transactionID, attachmentID: -1, docType: '', transactionName: this.transactionName });
    this.router.navigate(['transaction', 'invoices']);
  }

  viewCheckList() {
    // tslint:disable-next-line: max-line-length
    this.transactionService.setCurrentAttachment({ transactionID: this.transactionID, attachmentID: -1, docType: '', transactionName: this.transactionName });
    this.router.navigate(['transaction', 'checklist', this.transactionID]);

    // transaction/checklist
  }

  readyForAssessment() {
    this.transactionService.sendForAssessment({userID: this.currentUser.userID, transactionID: this.transactionID, statusID: 5}).then(
      (res: Outcome) => {
        console.log('yes it reaches here');
        if (res.outcome === 'SUCCESS') {
          console.log('yes');
          this.notify.successmsg(res.outcome, res.outcomeMessage);
          setTimeout(() => { window.location.reload(); }, 2000 );
        } else {
          console.log('no');
          this.notify.errorsmsg(res.outcome, res.outcomeMessage);
        }
      },
      (msg) => this.statusResults.emit(msg)
    );
  }

}
