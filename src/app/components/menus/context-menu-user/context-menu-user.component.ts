import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DesignationService } from 'src/app/services/Designation.service';
import { Route } from '@angular/router';

@Component({
  selector: 'app-context-menu-user',
  templateUrl: './context-menu-user.component.html',
  styleUrls: ['./context-menu-user.component.scss']
})
export class ContextMenuUserComponent implements OnInit, AfterViewInit {

  constructor() { }
    // show = false;
  @Input() x = 0;
  @Input() y = 0;
  @Input() userID = 0;
  @Input() userName = '';
  @Input() currentTheme = '';

  @Output() editUser = new EventEmitter<string>();
  @ViewChild('popCont', {static: false}) elementView: ElementRef;
  contentHeight: number;
  contentWidth: number;

  ngOnInit() {}

  ngAfterViewInit(){
    this.contentHeight = this.elementView.nativeElement.offsetHeight;
    this.contentWidth = this.elementView.nativeElement.offsetWidth;
    if (window.innerHeight < this.contentHeight + this.y)
    {
      this.y = window.innerHeight - this.contentHeight;
    }
    if (window.innerWidth < 81 + this.x){
      this.x = window.innerWidth - 81;
    }
  }

  edit() {
    this.editUser.emit(JSON.stringify({
      userID: this.userID
    }));
  }
}
