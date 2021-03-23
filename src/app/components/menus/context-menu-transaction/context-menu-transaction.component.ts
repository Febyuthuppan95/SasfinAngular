import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
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
export class ContextMenuTransactionComponent implements OnInit, AfterViewInit {

  // tslint:disable-next-line: max-line-length
  constructor(private router: Router, private userService: UserService, private transactionService: TransactionService, private companyService: CompanyService) { }

  currentUser = this.userService.getCurrentUser();


  @Input() x: number;
  @Input() y: number;
  @Input() transactionID: number;
  @Input() transactionName: string;
  @Input() transactionType: string;
  @Input() status: string;
  @Input() transactionsSendAll: boolean;
  @Input() currentTheme: string;


  @Output() viewTransactionsEmit = new EventEmitter<string>();
  @Output() statusResults = new EventEmitter<Outcome>();
  @Output() removeTransaction = new EventEmitter<any>();

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;
  @ViewChild('popCont', {static: false}) elementView: ElementRef;
  contentHeight: number;
  contentWidth: number;

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.contentHeight = this.elementView.nativeElement.offsetHeight;
    this.contentWidth = this.elementView.nativeElement.offsetWidth;
    if (window.innerHeight < this.contentHeight + this.y)
    {
      this.y = window.innerHeight - this.contentHeight;
    }
    if (window.innerWidth < 181 + this.x){
      this.x = window.innerWidth - 181;
    }
  }

  viewTransactionAttachments() {
    // tslint:disable-next-line: max-line-length
    this.transactionService.setCurrentAttachment({ transactionID: this.transactionID, attachmentID: -1, docType: '', transactionType: this.transactionType, transactionName: this.transactionName });
    this.router.navigate(['transaction', 'attachments']);
  }

  deleteTransaction() {
    this.removeTransaction.emit({
      transactionID: this.transactionID,
      userID: this.currentUser.userID,
      isDeleted: 1,
    });
  }

  viewSAD500s() {
    // tslint:disable-next-line: max-line-length
    this.transactionService.setCurrentAttachment({ transactionID: this.transactionID, attachmentID: -1, docType: '', transactionType: this.transactionType, transactionName: this.transactionName });
    this.router.navigate(['transaction', 'sad500s']);
  }

  viewImportClearin() {
    // tslint:disable-next-line: max-line-length
    this.transactionService.setCurrentAttachment({ transactionID: this.transactionID, attachmentID: -1, docType: '', transactionType: this.transactionType, transactionName: this.transactionName });
    this.router.navigate(['transaction', 'import-clearing-instruction']);
  }

  viewCRN() {
    // tslint:disable-next-line: max-line-length
    this.transactionService.setCurrentAttachment({ transactionID: this.transactionID, attachmentID: -1, docType: '', transactionType: this.transactionType, transactionName: this.transactionName });
    this.router.navigate(['transaction', 'custom-release-notification']);
  }

  viewInvoices() {
    // tslint:disable-next-line: max-line-length
    this.transactionService.setCurrentAttachment({ transactionID: this.transactionID, attachmentID: -1, docType: '', transactionType: this.transactionType, transactionName: this.transactionName });
    this.router.navigate(['transaction', 'invoices']);
  }

  viewCheckList() {
    // tslint:disable-next-line: max-line-length
    this.transactionService.setCurrentAttachment({ transactionID: this.transactionID, attachmentID: -1, docType: '', transactionType: this.transactionType, transactionName: this.transactionName });
    this.router.navigate(['transaction', 'checking']);

    // transaction/checklist
  }

  viewLinking() {
    // tslint:disable-next-line: max-line-length
    this.transactionService.setCurrentAttachment({ transactionID: this.transactionID, attachmentID: -1, docType: '', transactionType: this.transactionType, transactionName: this.transactionName });
    this.router.navigate(['transaction', 'linking']);

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
