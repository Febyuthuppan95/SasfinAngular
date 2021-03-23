import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit  } from '@angular/core';

@Component({
  selector: 'app-context-menu-contact-types',
  templateUrl: './context-menu-contact-types.component.html',
  styleUrls: ['./context-menu-contact-types.component.scss']
})
export class ContextMenuContactTypesComponent implements OnInit {

  constructor() { }

  @Input() x: number;
  @Input() y: number;

  @Input() contactID: number;
  @Input() contactTypeID: number;
  @Input() contactTypeName: string;
  @Input() contactTypeDescription: string;
  @Input() currentTheme: string;

  @Output() editContactType = new EventEmitter<string>();
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
    this.editContactType.emit(JSON.stringify({
      contactID: this.contactID,
      contactTypeID: this.contactTypeID,
      name: this.contactTypeName,
      description: this.contactTypeDescription
    }));
  }

}
