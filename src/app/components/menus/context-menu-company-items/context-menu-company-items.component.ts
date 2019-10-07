import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-context-menu-company-items',
  templateUrl: './context-menu-company-items.component.html',
  styleUrls: ['./context-menu-company-items.component.scss']
})
export class ContextMenuCompanyItemsComponent implements OnInit {

  constructor() { }

  @Input() x: number;
  @Input() y: number;

  @Input() itemID: number;
  @Input() service: string;
  @Input() currentTheme: string;

  @Output() Alternates = new EventEmitter<string>();
  ngOnInit() {

  }

  alternates() {
    this.Alternates.emit(JSON.stringify({
      itemID: this.itemID
    }));
  }
}


