import { Component, OnInit, EventEmitter, Input, Output, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-context-menu-transaction-file',
  templateUrl: './context-menu-transaction-file.component.html',
  styleUrls: ['./context-menu-transaction-file.component.scss']
})
export class ContextMenuTransactionFileComponent implements OnInit, AfterViewInit {

  constructor(private router: Router) { }

  @Input() x: number;
  @Input() y: number;
  @Input() transactionID: number;
  @Input() currentTheme: string;

  @Output() viewTransactionsEmit = new EventEmitter<string>();
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
    if (window.innerWidth < 169 + this.x){
      this.x = window.innerWidth - 169;
    }
  }

  viewTransactionAttachments() {
    this.router.navigate(['transaction', 'attachments']);
  }

}
