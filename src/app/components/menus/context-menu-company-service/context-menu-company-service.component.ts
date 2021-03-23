import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-context-menu-company-service',
  templateUrl: './context-menu-company-service.component.html',
  styleUrls: ['./context-menu-company-service.component.scss']
})
export class ContextMenuCompanyServiceComponent implements OnInit, AfterViewInit  {

  constructor() { }

  @Input() x: number;
  @Input() y: number;

  @Input() serviceID: number;
  @Input() service: string;
  @Input() currentTheme: string;

  @Output() editService = new EventEmitter<string>();
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
    if (window.innerWidth < 63 + this.x){
      this.x = window.innerWidth - 63;
    }
  }

  edit() {
    this.editService.emit(JSON.stringify({
      addressID: this.serviceID,
      name: this.service
    }));
  }
}

