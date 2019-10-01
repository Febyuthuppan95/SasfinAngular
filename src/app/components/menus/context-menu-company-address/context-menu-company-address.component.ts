import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-context-menu-company-address',
  templateUrl: './context-menu-company-address.component.html',
  styleUrls: ['./context-menu-company-address.component.scss']
})
export class ContextMenuCompanyAddressComponent implements OnInit {

  constructor() { }

  @Input() x: number;
  @Input() y: number;

  @Input() addressID: number;
  @Input() addressTypeID: number;
  @Input() addressTypeName: string;
  @Input() currentTheme: string;

  @Output() editAddress = new EventEmitter<string>();
  ngOnInit() {
  }

  edit() {
    this.editAddress.emit(JSON.stringify({
      addressID: this.addressID,
      addressTypeID: this.addressTypeID,
      name: this.addressTypeName
    }));
  }
}
