import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-context-menu-currencies',
  templateUrl: './context-menu-currencies.component.html',
  styleUrls: ['./context-menu-currencies.component.scss']
})
export class ContextMenuCurrenciesComponent implements OnInit {

  constructor() { }

  @Input() x: number;
  @Input() y: number;

  @Input() currencyID: number;
  @Input() currencyCode: string;
  @Input() currencyName: string;
  @Input() currencyFactor: string;
  @Input() currentTheme: string;

  @Output() editCurrency = new EventEmitter<string>();
  ngOnInit() {
  }

  edit() {
    this.editCurrency.emit(JSON.stringify({
      currencyID: this.currencyID,
      currencyCode: this.currencyCode,
      currencyName: this.currencyName,
      currencyFactor: this.currencyFactor
    }));
  }

}
