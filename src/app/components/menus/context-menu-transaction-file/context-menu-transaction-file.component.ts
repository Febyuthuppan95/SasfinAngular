import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-context-menu-transaction-file',
  templateUrl: './context-menu-transaction-file.component.html',
  styleUrls: ['./context-menu-transaction-file.component.scss']
})
export class ContextMenuTransactionFileComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() x: number;
  @Input() y: number;
  @Input() transactionID: number;
  @Input() currentTheme: string;

  @Output() viewTransactionsEmit = new EventEmitter<string>();

  ngOnInit() {
  }

  viewTransactionAttachments() {
    this.router.navigate(['transaction', 'attachments']);
  }

}
