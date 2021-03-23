import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-context-menu-currencies',
  templateUrl: './context-menu-currencies.component.html',
  styleUrls: ['./context-menu-currencies.component.scss']
})
export class ContextMenuCurrenciesComponent implements OnInit, AfterViewInit {

  constructor() { }

  @Input() x: number;
  @Input() y: number;

  @Input() currencyID: number;
  @Input() currencyCode: string;
  @Input() currencyName: string;
  @Input() currencyFactor: string;
  @Input() currentTheme: string;

  @Output() editCurrency = new EventEmitter<string>();
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
    if (window.innerWidth < 63 + this.x){
      this.x = window.innerWidth - 63;
    }
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
