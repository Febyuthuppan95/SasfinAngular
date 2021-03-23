import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-context-menu-designationrights',
  templateUrl: './context-menu-designationrights.component.html',
  styleUrls: ['./context-menu-designationrights.component.scss']
})
export class ContextMenuDesignationrightsComponent implements OnInit, AfterViewInit {

  constructor() { }
  @Input() x = 0;
  @Input() y = 0;
  @Input() designationRightId = 0;
  @Input() currentTheme = '';

  @Output() editDesignationRight = new EventEmitter<string>();
  @ViewChild('popCont', {static: false}) elementView: ElementRef;
  contentHeight: number;
  contentWidth: number
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

  remove() {
    this.editDesignationRight.emit(JSON.stringify({
      userRightId: this.designationRightId
    }));
  }

}
