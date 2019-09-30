import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-context-menu-contact-types',
  templateUrl: './context-menu-contact-types.component.html',
  styleUrls: ['./context-menu-contact-types.component.scss']
})
export class ContextMenuContactTypesComponent implements OnInit {

  constructor() { }

  @Input() x: number;
  @Input() y: number;

  @Input() contactID: number;
  @Input() contactTypeID: number;
  @Input() contactTypeName: string;
  @Input() contactTypeDescription: string;
  @Input() currentTheme: string;

  @Output() editContactType = new EventEmitter<string>();
  ngOnInit() {
  }

  edit() {
    this.editContactType.emit(JSON.stringify({
      contactID: this.contactID,
      contactTypeID: this.contactTypeID,
      name: this.contactTypeName,
      description: this.contactTypeDescription
    }));
  }

}
