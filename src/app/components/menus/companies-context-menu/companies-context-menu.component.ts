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

  @Output() EditCompony = new EventEmitter<string>();

  ngOnInit() {}

  viewTransactions() {
    this.companyService.setCompany({ companyID: this.companyID, companyName: this.companyName });
    this.router.navigate(['companies', 'transactions']);
  }

  companyInfo() {
    this.companyService.setCompany({ companyID: this.companyID, companyName: this.companyName });
    this.router.navigate(['companies', 'info']);
  }

  companyAddresses() {
    this.companyService.setCompany({ companyID: this.companyID, companyName: this.companyName });
    this.router.navigate(['companies', 'addresses']);
  }

  companyContacts() {
    this.companyService.setCompany({ companyID: this.companyID, companyName: this.companyName });
    this.router.navigate(['companies', 'contacts']);
  }

  captureInfo() {
    this.companyService.setCompany({ companyID: this.companyID, companyName: this.companyName });
    this.router.navigate(['companies', 'capture', 'info']);
  }

  Edit() {
    this.EditCompony.emit(JSON.stringify({
      companyID: this.companyID
    }));
  }
  companyServices() {
      this.companyService.setCompany({ companyID: this.companyID, companyName: this.companyName });
      this.router.navigate(['companies', 'services']);
  }

  companyItems() {
    this.companyService.setCompany({ companyID: this.companyID, companyName: this.companyName });
    this.router.navigate(['companies', 'items']);
  }
  companyBOMs() {
    this.companyService.setCompany({ companyID: this.companyID, companyName: this.companyName });
    this.router.navigate(['companies', 'boms']);
  }
  companyPermits() {
    this.companyService.setCompany({ companyID: this.companyID, companyName: this.companyName });
    this.router.navigate(['companies', 'permittypes']);
  }

  ServiceClaims() {
    this.companyService.setCompany({ companyID: this.companyID, companyName: this.companyName });
    this.router.navigate(['companies', 'serviceclaims']);
  }
  oemList() {
    this.companyService.setCompany({ companyID: this.companyID, companyName: this.companyName });
    this.router.navigate(['companies', 'oems']);
  }
  supplierList() {
    this.companyService.setCompany({ companyID: this.companyID, companyName: this.companyName });
    this.router.navigate(['companies', 'localreceipts']);
  }
}
