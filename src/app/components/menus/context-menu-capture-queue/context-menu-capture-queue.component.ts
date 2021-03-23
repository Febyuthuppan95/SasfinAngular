import { Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';

@Component({
  selector: 'app-context-menu-capture-queue',
  templateUrl: './context-menu-capture-queue.component.html',
  styleUrls: ['./context-menu-capture-queue.component.scss']
})
export class ContextMenuCaptureQueueComponent implements OnInit, AfterViewInit {

  constructor(private router: Router) { }
  @Input() x: number;
  @Input() y: number;
  @Input() currentTheme: string;
  @Input() companyID: number;

  @Output() promoteCompany = new EventEmitter<number>();
  @ViewChild('popCont', {static: false}) elementView: ElementRef;
  contentHeight: number;
  contentWidth: number;

  ngOnInit() {
    console.log(this.companyID);
  }

  ngAfterViewInit(){
    this.contentHeight = this.elementView.nativeElement.offsetHeight;
    this.contentWidth = this.elementView.nativeElement.offsetWidth;
    if (window.innerHeight < this.contentHeight + this.y)
    {
      this.y = window.innerHeight - this.contentHeight;
    }
    if (window.innerWidth < 194 + this.x){
      this.x = window.innerWidth - 194;
    }
  }

  setPriority() {
    this.promoteCompany.emit(this.companyID);
  }
}
