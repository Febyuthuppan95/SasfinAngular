import { Component, OnInit, EventEmitter, Input, Output, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-context-menu-userrights',
  templateUrl: './context-menu-userrights.component.html',
  styleUrls: ['./context-menu-userrights.component.scss']
})
export class ContextMenuUserrightsComponent implements OnInit, AfterViewInit {

  constructor() { }
  @Input() x = 0;
  @Input() y = 0;
  @Input() userRightId = 0;
  @Input() currentTheme = '';

  @Output() editUserRight = new EventEmitter<string>();
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

  remove() {
    this.editUserRight.emit(JSON.stringify({
      userRightId: this.userRightId
    }));
  }

}
