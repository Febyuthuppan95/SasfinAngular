import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DesignationService } from 'src/app/services/Designation.service';
import { Route } from '@angular/router';

@Component({
  selector: 'app-context-menu-user',
  templateUrl: './context-menu-user.component.html',
  styleUrls: ['./context-menu-user.component.scss']
})
export class ContextMenuUserComponent implements OnInit {

  constructor() { }
    // show = false;
  @Input() x = 0;
  @Input() y = 0;
  @Input() userID = 0;
  @Input() currentTheme = '';

  @Output() editUser = new EventEmitter<string>();
  ngOnInit() {}


  edit() {
    this.editUser.emit(JSON.stringify({
      userID: this.userID
    }));
  }
}
