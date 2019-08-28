import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-companies-context-menu',
  templateUrl: './companies-context-menu.component.html',
  styleUrls: ['./companies-context-menu.component.scss']
})
export class CompaniesContextMenuComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() x: number;
  @Input() y: number;
  @Input() companyID: number;
  @Input() companyName: string;
  @Input() currentTheme: string;

  @Output() viewTransactionsEmit = new EventEmitter<string>();

  ngOnInit() {
  }

  viewTransactions() {
    this.router.navigate(['transactions', this.companyID, this.companyName]);
  }

  companyInfo() {
    this.router.navigate(['companies', 'info', this.companyID, this.companyName]);
  }

  companyAddresses() {
    this.router.navigate(['companies', 'addresses', this.companyID, this.companyName]);
  }

  companyContacts() {
    this.router.navigate(['companies', 'contacts', this.companyID, this.companyName]);
  }
}
