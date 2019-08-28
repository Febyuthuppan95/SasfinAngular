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

  @Output() viewTransactionsEmit = new EventEmitter<string>();

  ngOnInit() {
  }

  viewInfo() {
    alert('Not implemented');
  }

  editInfo() {
    alert('Not implemented');
  }

}
