import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-context-menu-designationrights',
  templateUrl: './context-menu-designationrights.component.html',
  styleUrls: ['./context-menu-designationrights.component.scss']
})
export class ContextMenuDesignationrightsComponent implements OnInit {

  constructor() { }
  @Input() x = 0;
  @Input() y = 0;
  @Input() designationRightId = 0;
  @Input() currentTheme = '';

  @Output() editDesignationRight = new EventEmitter<string>();

  ngOnInit() {
  }

  remove() {
    this.editDesignationRight.emit(JSON.stringify({
      userRightId: this.designationRightId
    }));
  }

}
