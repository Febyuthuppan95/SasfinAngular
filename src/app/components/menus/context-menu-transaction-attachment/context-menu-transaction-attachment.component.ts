import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from 'src/app/services/Document.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';

@Component({
  selector: 'app-context-menu-transaction-attachment',
  templateUrl: './context-menu-transaction-attachment.component.html',
  styleUrls: ['./context-menu-transaction-attachment.component.scss']
})
export class ContextMenuTransactionAttachmentComponent implements OnInit {

  constructor(private router: Router, private docService: DocumentService, private transactionService: TransactionService) { }

  @Input() x: number;
  @Input() y: number;
  @Input() transactionID: number;
  @Input() attachmentID: number;
  @Input() currentTheme: string;
  @Input() statusID: number;
  @Input() docPath: string;
  @Input() fileType: string;
  @Input() transactionType: string;

  @Output() viewTransactionsEmit = new EventEmitter<string>();
  @Output() removeAttachment = new EventEmitter<string>();

  ngOnInit() {}

  capture() {
    if (this.statusID !== 5 && this.statusID !== 2 && this.statusID !== 4) {
      this.docService.loadDocumentToViewer(this.docPath);
      // tslint:disable-next-line: max-line-length
      this.transactionService.setCurrentAttachment({ transactionID: this.transactionID, attachmentID: this.attachmentID, docType: this.fileType, transactionType: this.transactionType });
      this.router.navigate(['capture', 'transaction', 'attachment']);
    }
  }

  lines() {
    // tslint:disable-next-line: max-line-length
    this.transactionService.setCurrentAttachment({ transactionID: this.transactionID, attachmentID: this.attachmentID, docType: this.fileType, transactionType: this.transactionType});
    this.router.navigate(['sad500/lines']);
  }

  remove() {
    this.removeAttachment.emit(
      JSON.stringify({
      fileID: this.attachmentID,
      fileTypeID: this.fileType
      })
    );
  }

}
