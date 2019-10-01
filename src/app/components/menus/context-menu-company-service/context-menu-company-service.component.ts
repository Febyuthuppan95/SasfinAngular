import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-context-menu-company-service',
  templateUrl: './context-menu-company-service.component.html',
  styleUrls: ['./context-menu-company-service.component.scss']
})
export class ContextMenuCompanyServiceComponent implements OnInit {

  constructor() { }

  @Input() x: number;
  @Input() y: number;

  @Input() serviceID: number;
  @Input() service: string;
  @Input() currentTheme: string;

  @Output() editService = new EventEmitter<string>();
  ngOnInit() {
  }

  edit() {
    this.editService.emit(JSON.stringify({
      addressID: this.serviceID,
      name: this.service
    }));
  }
}

