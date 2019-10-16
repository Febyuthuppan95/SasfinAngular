import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-context-menu-items',
  templateUrl: './context-menu-items.component.html',
  styleUrls: ['./context-menu-items.component.scss']
})
export class ContextMenuItemsComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() ItemID: number;
  @Input() Item: string;
  @Input() currentTheme: string;

  @Output() editItem = new EventEmitter<number>();
  @Output() removeItem = new EventEmitter<number>();

  ngOnInit() {
  }

  edit() {
    this.editItem.emit(+this.ItemID);
  }
  remove() {
    this.removeItem.emit(+this.ItemID);
  }
}


