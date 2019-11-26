import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/Company.Service';

@Component({
  selector: 'app-context-menu-service-claims',
  templateUrl: './context-menu-service-claims.component.html',
  styleUrls: ['./context-menu-service-claims.component.scss']
})
export class ContextMenuServiceClaimsComponent implements OnInit {

  constructor(private router: Router, private companyService: CompanyService) { }

  @Input() companyServiceClaimID: number;
  @Input() serviceName: string;
  @Input() companyServiceClaimNumber: number;
  @Input() currentTheme: string;

  @Output() populatecompanyService = new EventEmitter<number>();
  @Output() reportscompanyService = new EventEmitter<number>();

  ngOnInit() {}

  Populate() {
    this.populatecompanyService.emit(+this.companyServiceClaimID);
  }
  Reports() {
    this.reportscompanyService.emit(+this.companyServiceClaimID);
  }
}

