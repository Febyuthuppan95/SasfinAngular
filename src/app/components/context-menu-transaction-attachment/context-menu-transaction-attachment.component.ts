import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from 'src/app/services/Document.Service';

@Component({
  selector: 'app-context-menu-transaction-attachment',
  templateUrl: './context-menu-transaction-attachment.component.html',
  styleUrls: ['./context-menu-transaction-attachment.component.scss']
})
export class ContextMenuTransactionAttachmentComponent implements OnInit {

  constructor(private router: Router, private docService: DocumentService) { }

  @Input() x: number;
  @Input() y: number;
  @Input() transactionID: number;
  @Input() attachmentID: number;
  @Input() currentTheme: string;
  @Input() docPath: string;

  @Output() viewTransactionsEmit = new EventEmitter<string>();

  ngOnInit() {
  }

  capture() {
    this.docService.loadDocumentToViewer(this.docPath);
    this.router.navigate(['capture', 'transaction', 'attachment', this.transactionID]);
  }

}
