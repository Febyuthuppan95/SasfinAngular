import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-context-menu-userrights',
  templateUrl: './context-menu-userrights.component.html',
  styleUrls: ['./context-menu-userrights.component.scss']
})
export class ContextMenuUserrightsComponent implements OnInit {

  constructor() { }
  @Input() x = 0;
  @Input() y = 0;
  @Input() userRightId = 0;
  @Input() currentTheme = '';

  @Output() editUserRight = new EventEmitter<string>();

  ngOnInit() {
  }

}
