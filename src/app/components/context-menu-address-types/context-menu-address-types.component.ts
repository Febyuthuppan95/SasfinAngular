import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-context-menu-address-types',
  templateUrl: './context-menu-address-types.component.html',
  styleUrls: ['./context-menu-address-types.component.scss']
})
export class ContextMenuAddressTypesComponent implements OnInit {

  constructor() { }

  @Input() x: number;
  @Input() y: number;
  @Input() addressTypeID: number;
  @Input() addressTypeName: string;
  @Input() currentTheme: string;

  @Output() editAddressType = new EventEmitter<string>();
  ngOnInit() {
  }

  edit() {
    this.editAddressType.emit(JSON.stringify({
      addressTypeID: this.addressTypeID,
      name: this.addressTypeName      
    }));
  }
}
