import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DocumentService } from 'src/app/services/Document.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-context-menu-local-attachments',
  templateUrl: './context-menu-local-attachments.component.html',
  styleUrls: ['./context-menu-local-attachments.component.scss']
})
export class ContextMenuLocalAttachmentsComponent implements OnInit, AfterViewInit {

  constructor(private docService: DocumentService,
    private transactionService: TransactionService,
    private router: Router) { }

  @Input() x: number;
  @Input() y: number;
  @Input() currentTheme: string;
  @Input() docPath: string;
  //Parameters for routing to capturing page --Reuben
  @Input() fileType: string;
  @Input() fileTypeID: number;
  @Input() transactionID: number;
  @Input() attachmentID: number;
  @Input() statusID: number;
  @Input() transactionType: string;

  @Output() addAttachment = new EventEmitter<string>();
  currentTransaction;
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
    if (window.innerWidth < 152 + this.x){
      this.x = window.innerWidth - 152;
    }
  }

  AddAttachment() {
    this.addAttachment.emit("1");
  }
  Capture() {
    console.log(this.docPath);
    this.docService.loadDocumentToViewer(this.docPath);
    // tslint:disable-next-line: max-line-length
    // this.transactionService.setCurrentAttachment({ transactionID: this.transactionID, attachmentID: this.attachmentID, docType: this.fileType, transactionType: this.transactionType, issueID: this.statusID === 7 ? 1 : -1, reason: this.reason });
    this.router.navigate(['capture', 'transaction', 'attachment', btoa(this.docPath)]);

    //Used different URL to route, capture/transaction/attachment didnt work --Reuben
    this.router.navigate(['c',
                          btoa(this.docPath),
                          btoa(this.fileType),
                          this.attachmentID.toString(),
                          this.transactionID.toString(),
                          btoa(this.transactionType),
                          this.statusID === 7 ? '1' : '-1']);
  }
}
