import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/Company.Service';


@Component({
  selector: 'app-company-oem-context-menu',
  templateUrl: './company-oem-context-menu.component.html',
  styleUrls: ['./company-oem-context-menu.component.scss']
})
export class CompanyOemContextMenuComponent implements OnInit {

  constructor(private router: Router, private companyService: CompanyService) { }
  @Input() x: number;
  @Input() y: number;
  @Input() companyID: number;
  @Input() companyName: string;
  @Input() currentTheme: string;
  @Input() companyOEMID: number;
  @Input() companyOEMName: string;
  @Input() companyOEMRefNum: string;

  @Output() EditCompanyOEM = new EventEmitter<string>();
  ngOnInit() {
  }

  Edit() {
    this.EditCompanyOEM.emit(JSON.stringify({
      companyOEMID: this.companyOEMID,
      companyOEMName: this.companyOEMName
    }));
  }
  Quarters() {
    this.companyService.setCompanyOEM({ 
      companyOEMID: this.companyOEMID, 
      oemName: this.companyOEMName,
      oemRefNum: this.companyOEMRefNum });
      this.router.navigate(['companies', 'oem', 'quarters']);
  }

}
