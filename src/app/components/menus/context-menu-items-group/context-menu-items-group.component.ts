import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-context-menu-items-group',
  templateUrl: './context-menu-items-group.component.html',
  styleUrls: ['./context-menu-items-group.component.scss']
})
export class ContextMenuItemsGroupComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() itemID: number;
  @Input() itemName: string;
  @Input() currentTheme: string;

  @Output() removeItemGroup = new EventEmitter<number>();

  ngOnInit() {
  }

  remove() {
    this.removeItemGroup.emit(+this.itemID);
  }
}

