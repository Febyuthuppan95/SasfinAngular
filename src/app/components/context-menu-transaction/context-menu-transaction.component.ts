import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-context-menu-transaction',
  templateUrl: './context-menu-transaction.component.html',
  styleUrls: ['./context-menu-transaction.component.scss']
})
export class ContextMenuTransactionComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() x: number;
  @Input() y: number;
  @Input() transactionID: number;
  @Input() currentTheme: string;

  @Output() viewTransactionsEmit = new EventEmitter<string>();

  ngOnInit() {
  }

  viewTransactionAttachments() {
    this.router.navigate(['transaction', 'attachments', this.transactionID]);
  }

}
