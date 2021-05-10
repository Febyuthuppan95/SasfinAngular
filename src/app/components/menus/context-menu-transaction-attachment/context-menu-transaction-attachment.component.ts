import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DocumentService } from 'src/app/services/Document.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { DialogRemoveAttachmentComponent } from './dialog-remove-attachment/dialog-remove-attachment.component';

@Component({
  selector: 'app-context-menu-transaction-attachment',
  templateUrl: './context-menu-transaction-attachment.component.html',
  styleUrls: ['./context-menu-transaction-attachment.component.scss']
})
export class ContextMenuTransactionAttachmentComponent implements OnInit, AfterViewInit {

  constructor(private router: Router,
              private docService: DocumentService,
              private transactionService: TransactionService,
              private dialog: MatDialog) { }

  @Input() x: number;
  @Input() y: number;
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
  @Output() returnAttachment = new EventEmitter<string>();
  @ViewChild('popCont', {static: false}) elementView: ElementRef;
  contentHeight: number;
  contentWidth: number;


  ngOnInit() {}

  ngAfterViewInit(){
    this.contentHeight = this.elementView.nativeElement.offsetHeight;
    this.contentWidth = this.elementView.nativeElement.offsetWidth;
    if (window.innerHeight < this.contentHeight + this.y)
    {
      this.y = window.innerHeight - this.contentHeight;
    }
    if (window.innerWidth < 175 + this.x){
      this.x = window.innerWidth - 175;
    }
  }

  capture() {
      this.router.navigate([
        'c',
        btoa(this.docPath),
        btoa(this.fileType),
        this.attachmentID.toString(),
        this.transactionID.toString(),
        btoa(this.transactionType),
        this.statusID === 7 ? '1' : '-1']);
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
      fileTypeID: this.fileTypeID,
      })
    );
  }
  preview() {
    this.previewDocument.emit(this.docPath);
  }

  return(){
    this.returnAttachment.emit(
      JSON.stringify({
        transactionID: this.transactionID,
        attachmentID: this.attachmentID,
        fileTypeID: this.fileTypeID,
      })
    );
  }

}
