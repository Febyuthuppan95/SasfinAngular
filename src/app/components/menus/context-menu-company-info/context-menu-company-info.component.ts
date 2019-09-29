import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-context-menu-company-info',
  templateUrl: './context-menu-company-info.component.html',
  styleUrls: ['./context-menu-company-info.component.scss']
})
export class ContextMenuCompanyInfoComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() x: number;
  @Input() y: number;
  @Input() companyID: number;
  @Input() companyName: string;
  @Input() currentTheme: string;

  @Output() EditCompanyInfo = new EventEmitter<string>();
  @Output() ViewCompanyInfo = new EventEmitter<string>();

  ngOnInit() {
  }

  viewInfo() {
    this.ViewCompanyInfo.emit(JSON.stringify({
      companyID: this.companyID
    }));
  }

  editInfo() {
    this.EditCompanyInfo.emit(JSON.stringify({
      companyID: this.companyID
    }));
  }

}
