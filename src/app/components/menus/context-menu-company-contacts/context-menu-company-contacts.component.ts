import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-context-menu-company-contacts',
  templateUrl: './context-menu-company-contacts.component.html',
  styleUrls: ['./context-menu-company-contacts.component.scss']
})
export class ContextMenuCompanyContactsComponent implements OnInit {

  constructor() { }

  
  @Input() x: number;
  @Input() y: number;
  @Input() currentTheme: string;
  

  @Output() EditCompanyContact = new EventEmitter<string>();
  @Output() DeleteContact = new EventEmitter<string>();

  ngOnInit() {
  }


  edit() {
    this.EditCompanyContact.emit();
  }

  DeleteCon(){
    this.DeleteContact.emit();
  }

}
