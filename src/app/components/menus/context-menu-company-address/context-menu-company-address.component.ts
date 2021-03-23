import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-context-menu-company-address',
  templateUrl: './context-menu-company-address.component.html',
  styleUrls: ['./context-menu-company-address.component.scss']
})
export class ContextMenuCompanyAddressComponent implements OnInit, AfterViewInit {

  constructor() { }

  @Input() x: number;
  @Input() y: number;

  @Input() addressID: number;
  @Input() addressTypeID: number;
  @Input() addressTypeName: string;
  @Input() currentTheme: string;

  @Output() editAddress = new EventEmitter<string>();
  @ViewChild('popCont', {static: false}) elementView: ElementRef;
  contentHeight: number;
  contentWidth: number;
  ngOnInit() {
  }

  ngAfterViewInit(){
    this.contentHeight = this.elementView.nativeElement.offsetHeight;
    this.contentWidth = this.elementView.nativeElement.offsetWidth;    console.log('Content Height: ' + this.contentHeight);
    if (window.innerHeight < this.contentHeight + this.y)
    {
      this.y = window.innerHeight - this.contentHeight;
    }
    if (window.innerWidth < 63 + this.x){
      this.x = window.innerWidth - 63;
    }
  }

  edit() {
    this.editAddress.emit(JSON.stringify({
      addressID: this.addressID,
      addressTypeID: this.addressTypeID,
      name: this.addressTypeName
    }));
  }
}
