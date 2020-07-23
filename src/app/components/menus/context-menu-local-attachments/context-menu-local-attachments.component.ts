import { Component, OnInit, Input } from '@angular/core';
import { DocumentService } from 'src/app/services/Document.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-context-menu-local-attachments',
  templateUrl: './context-menu-local-attachments.component.html',
  styleUrls: ['./context-menu-local-attachments.component.scss']
})
export class ContextMenuLocalAttachmentsComponent implements OnInit {

  constructor(private docService: DocumentService,
    private transactionService: TransactionService,
    private router: Router) { }

  @Input() x: number;
  @Input() y: number;
  @Input() docPath: string;
  currentTransaction
  ngOnInit() {
  }
  AddAttachment() {
    
  }
  Capture() {
    console.log(this.docPath);
      this.docService.loadDocumentToViewer(this.docPath);
      // tslint:disable-next-line: max-line-length
      // this.transactionService.setCurrentAttachment({ transactionID: this.transactionID, attachmentID: this.attachmentID, docType: this.fileType, transactionType: this.transactionType, issueID: this.statusID === 7 ? 1 : -1, reason: this.reason });
      this.router.navigate(['capture', 'transaction', 'attachment']);
  }
}
