import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/Company.Service';
import { ServicesService } from 'src/app/services/Services.Service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-context-menu-service-claims',
  templateUrl: './context-menu-service-claims.component.html',
  styleUrls: ['./context-menu-service-claims.component.scss']
})
export class ContextMenuServiceClaimsComponent implements OnInit {

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private claimService: ServicesService,
    private apiService: ApiService) { }

  @Input() companyServiceClaimID: number;
  @Input() companyServiceID: number;
  @Input() userID: number;
  @Input() companyID: number;
  @Input() companyName: string;
  @Input() serviceID: number;
  @Input() permitCount: number;
  @Input() serviceName: string;
  @Input() status: string;
  @Input() currentTheme: string;

  @Input() transactionID?: number;
  @Output() populatecompanyService = new EventEmitter<number>();
  @Output() reportscompanyService = new EventEmitter<number>();
  @Output() addClaimPermits = new EventEmitter<number>();
  @Output() submit522Claim = new EventEmitter<number>();
populate = false;
  ngOnInit() {}

  Populate() {
    // this.populatecompanyService.emit(+this.companyServiceClaimID);
    this.claimService.setCompanyClaim({
      companyID: this.companyID,
      companyName: this.companyName,
      serviceID: this.serviceID,
      serviceName: this.serviceName,
      companyServiceClaimID: this.companyServiceClaimID,
      claimStatus: 'Active'
    });
    this.router.navigate(['claim','capture']);
  }
  CaptureInvoices() {
    this.companyService.setCompany({
      companyID: this.companyID,
      companyName: this.companyName,
      selectedTransactionID: this.transactionID
    });
    this.router.navigate([ 'transaction','attachments']);
  }

  Reports() {
    // tslint:disable-next-line: max-line-length
    this.companyService.setClaimReport({companyID: this.companyID, companyName: this.companyName, companyServiceID: this.companyServiceID, claimNumber: this.companyServiceClaimID, serviceId: this.serviceID, serviceName: this.serviceName});
    this.router.navigate(['claim', 'reports']);
  }
  ClaimPermits() {
    this.addClaimPermits.emit(+1);
  }
  Submit522Report() {
    this.submit522Claim.emit(1);
  }
}

