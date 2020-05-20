import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/Company.Service';
import { ServicesService } from 'src/app/services/Services.Service';

@Component({
  selector: 'app-context-menu-service-claims',
  templateUrl: './context-menu-service-claims.component.html',
  styleUrls: ['./context-menu-service-claims.component.scss']
})
export class ContextMenuServiceClaimsComponent implements OnInit {

  constructor(private router: Router, private companyService: CompanyService, private claimService: ServicesService) { }

  @Input() companyServiceClaimID: number;
  @Input() companyServiceID: number;
  @Input() companyID: number;
  @Input() companyName: string;
  @Input() serviceID: number;
  @Input() permitCount: number;
  @Input() serviceName: string;
  @Input() status: string;
  @Input() currentTheme: string;

  @Output() populatecompanyService = new EventEmitter<number>();
  @Output() reportscompanyService = new EventEmitter<number>();
  @Output() addClaimPermits = new EventEmitter<number>();

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

  Reports() {
    // tslint:disable-next-line: max-line-length
    this.companyService.setClaimReport({companyID: this.companyID, companyName: this.companyName, companyServiceID: this.companyServiceID, claimNumber: this.companyServiceClaimID, serviceId: this.serviceID, serviceName: this.serviceName});
    this.router.navigate(['claim', 'reports']);
  }
  ClaimPermits() {
    this.addClaimPermits.emit(+1);
  }
}

