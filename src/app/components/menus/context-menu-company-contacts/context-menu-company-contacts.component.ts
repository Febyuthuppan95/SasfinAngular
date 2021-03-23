import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-context-menu-company-contacts',
  templateUrl: './context-menu-company-contacts.component.html',
  styleUrls: ['./context-menu-company-contacts.component.scss']
})
export class ContextMenuCompanyContactsComponent implements OnInit {

  constructor() { }


  @Input() x: number;
  @Input() y: number;
  @Input() currentTheme: string;


  @Output() EditCompanyContact = new EventEmitter<string>();
  @Output() DeleteContact = new EventEmitter<string>();

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
    if (window.innerWidth < 93 + this.x){
      this.x = window.innerWidth - 93;
    }
  }

  edit() {
    this.EditCompanyContact.emit();
  }

  DeleteCon(){
    this.DeleteContact.emit();
  }

}
