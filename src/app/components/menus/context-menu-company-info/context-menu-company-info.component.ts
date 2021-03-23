import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-context-menu-company-info',
  templateUrl: './context-menu-company-info.component.html',
  styleUrls: ['./context-menu-company-info.component.scss']
})
export class ContextMenuCompanyInfoComponent implements OnInit, AfterViewInit {

  constructor(private router: Router) { }

  @Input() x: number;
  @Input() y: number;
  @Input() companyID: number;
  @Input() companyName: string;
  @Input() currentTheme: string;

  @Output() EditCompanyInfo = new EventEmitter<string>();
  @Output() ViewCompanyInfo = new EventEmitter<string>();
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
    if (window.innerWidth < 71 + this.x){
      this.x = window.innerWidth - 71;
    }
  }

  viewInfo() {
    this.ViewCompanyInfo.emit(JSON.stringify({
      companyID: this.companyID
    }));
  }

  editInfo() {
    this.EditCompanyInfo.emit(JSON.stringify({
      companyID: this.companyID
    }));
  }

}
