import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-context-menu-address-types',
  templateUrl: './context-menu-address-types.component.html',
  styleUrls: ['./context-menu-address-types.component.scss']
})
export class ContextMenuAddressTypesComponent implements OnInit, AfterViewInit {

  constructor() { }

  @Input() x: number;
  @Input() y: number;

  @Input() addressID: number;
  @Input() addressTypeID: number;
  @Input() addressTypeName: string;
  @Input() currentTheme: string;

  @Output() editAddressType = new EventEmitter<string>();
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
    if (window.innerWidth < 39 + this.x){
      this.x = window.innerWidth - 39;
    }
  }

  edit() {
    this.editAddressType.emit(JSON.stringify({
      addressID: this.addressID,
      addressTypeID: this.addressTypeID,
      name: this.addressTypeName
    }));
  }
}
