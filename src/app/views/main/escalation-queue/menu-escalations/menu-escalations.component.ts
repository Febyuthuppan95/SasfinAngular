import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from 'src/app/services/Document.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';

@Component({
  selector: 'app-menu-escalations',
  templateUrl: './menu-escalations.component.html',
  styleUrls: ['./menu-escalations.component.scss']
})
export class MenuEscalationsComponent implements OnInit {
  constructor(private router: Router, private docService: DocumentService, private transactionService: TransactionService) { }

  @Input() transactionID: number;
  @Input() attachmentID: number;
  @Input() currentTheme: string;
  @Input() statusID: number;
  @Input() docPath: string;
  @Input() fileType: string;
  @Input() fileTypeID: number;
  @Input() transactionType: string;
  @Input() reason: string;

  @Output() viewTransactionsEmit = new EventEmitter<string>();
  @Output() removeAttachment = new EventEmitter<string>();
  @Output() previewDocument = new EventEmitter<string>();

  ngOnInit() {}

  capture() {
    if (this.statusID !== 5 && this.statusID !== 4) {
      this.docService.loadDocumentToViewer(this.docPath);
      // tslint:disable-next-line: max-line-length
      this.transactionService.setCurrentAttachment({ transactionID: this.transactionID, attachmentID: this.attachmentID, docType: this.fileType, transactionType: this.transactionType, issueID: this.statusID === 7 ? 1 : -1, reason: this.reason });
      this.router.navigate([
        'capture',
        'transaction',
        'attachment',
        btoa(this.docPath),
        btoa(this.fileType),
        this.attachmentID.toString(),
        this.transactionID.toString(),
        btoa(this.transactionType),
        this.statusID === 7 ? '1' : '-1',
        btoa(this.reason)]);
    }
  }

  remove() {
    this.removeAttachment.emit(
      JSON.stringify({
      fileID: this.attachmentID,
      fileTypeID: this.fileTypeID,
      })
    );
  }

  preview() {
    this.previewDocument.emit(this.docPath);
  }
}
