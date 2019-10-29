import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-context-menu-items-parents',
  templateUrl: './context-menu-items-parents.component.html',
  styleUrls: ['./context-menu-items-parents.component.scss']
})
export class ContextMenuItemsParentsComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() ItemID: number;
  @Input() Item: string;
  @Input() currentTheme: string;

  @Output() editItemValue = new EventEmitter<number>();
  @Output() removeItemValue = new EventEmitter<number>();

  ngOnInit() {
  }

  edit() {
    this.editItemValue.emit(+this.ItemID);
  }
  remove() {
    this.removeItemValue.emit(+this.ItemID);
  }
}



