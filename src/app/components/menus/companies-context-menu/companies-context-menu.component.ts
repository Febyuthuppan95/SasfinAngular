import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/Company.Service';

@Component({
  selector: 'app-companies-context-menu',
  templateUrl: './companies-context-menu.component.html',
  styleUrls: ['./companies-context-menu.component.scss']
})
export class CompaniesContextMenuComponent implements OnInit, AfterViewInit {

  constructor(private router: Router, private companyService: CompanyService) { }

  @Input() x: number;
  @Input() y: number;
  @Input() companyID: number;
  @Input() companyName: string;
  @Input() currentTheme: string;

  @Output() EditCompony = new EventEmitter<string>();
  @ViewChild('popCont', {static: false}) elementView: ElementRef;
  contentHeight: number;
  contentWidth: number;

  ngOnInit() {}

  ngAfterViewInit(){
    this.contentHeight = this.elementView.nativeElement.offsetHeight;
    this.contentWidth = this.elementView.nativeElement.offsetWidth;
    if (window.innerHeight < this.contentHeight + this.y)
    {
      this.y = window.innerHeight - this.contentHeight;
    }
    if (window.innerWidth < 179 + this.x){
      this.x = window.innerWidth - 179;
    }
  }


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
