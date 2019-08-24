import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-context-menu-transaction-attachment',
  templateUrl: './context-menu-transaction-attachment.component.html',
  styleUrls: ['./context-menu-transaction-attachment.component.scss']
})
export class ContextMenuTransactionAttachmentComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() x: number;
  @Input() y: number;
  @Input() transactionID: number;
  @Input() attachmentID: number;
  @Input() currentTheme: string;

  @Output() viewTransactionsEmit = new EventEmitter<string>();

  ngOnInit() {
  }

  capture() {
    this.router.navigate(['transaction', 'attachment', 'capture', this.transactionID]);
  }

}
