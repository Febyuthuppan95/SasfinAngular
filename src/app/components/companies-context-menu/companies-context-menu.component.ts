import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/Company.Service';

@Component({
  selector: 'app-companies-context-menu',
  templateUrl: './companies-context-menu.component.html',
  styleUrls: ['./companies-context-menu.component.scss']
})
export class CompaniesContextMenuComponent implements OnInit {

  constructor(private router: Router, private companyService: CompanyService) { }

  @Input() x: number;
  @Input() y: number;
  @Input() companyID: number;
  @Input() companyName: string;
  @Input() currentTheme: string;

  @Output() viewTransactionsEmit = new EventEmitter<string>();

  ngOnInit() {
    this.companyService.setCompany({ companyID: this.companyID, companyName: this.companyName });
  }

  viewTransactions() {
    this.router.navigate(['companies', 'transactions']);
  }

  companyInfo() {
    this.router.navigate(['companies', 'info']);
  }

  companyAddresses() {
    this.router.navigate(['companies', 'addresses']);
  }

  companyContacts() {
    this.router.navigate(['companies', 'contacts']);
  }
}
