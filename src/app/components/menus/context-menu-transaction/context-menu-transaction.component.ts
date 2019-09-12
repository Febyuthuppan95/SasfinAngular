import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/services/Transaction.Service';

@Component({
  selector: 'app-context-menu-transaction',
  templateUrl: './context-menu-transaction.component.html',
  styleUrls: ['./context-menu-transaction.component.scss']
})
export class ContextMenuTransactionComponent implements OnInit {

  constructor(private router: Router, private transactionService: TransactionService) { }

  @Input() x: number;
  @Input() y: number;
  @Input() transactionID: number;
  @Input() currentTheme: string;

  @Output() viewTransactionsEmit = new EventEmitter<string>();

  ngOnInit() {
  }

  viewTransactionAttachments() {
    this.transactionService.setCurrentAttachment({ transactionID: this.transactionID, attachmentID: -1 });
    this.router.navigate(['transaction', 'attachments']);
  }

}
