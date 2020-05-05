import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CompanyService } from 'src/app/services/Company.Service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-oem-quarters-context-menu',
  templateUrl: './oem-quarters-context-menu.component.html',
  styleUrls: ['./oem-quarters-context-menu.component.scss']
})
export class OemQuartersContextMenuComponent implements OnInit {

  constructor(private router: Router, private companyService: CompanyService) { }
  @Input() currentTheme: string;
  @Input() companyOEMID: number;
  @Input() companyOEMName: string;
  @Input() companyOEMRefNum: string;
  @Input() quarterID: number;

  @Input() x: number;
  @Input() y: number;

  @Output() EditOEMQuarter = new EventEmitter<string>();

  ngOnInit() {
    console.log({companyOEM:this.companyOEMID, quarter: this.quarterID});
  }

  Edit() {
    this.EditOEMQuarter.emit(JSON.stringify({
      companyOEMID: this.companyOEMID,
      companyOEMName: this.companyOEMName,
      quarterID: this.quarterID
    }));
  }

  Supply() {
    this.companyService.setCompanyOEM({ 
      companyOEMID: this.companyOEMID, 
      oemName: this.companyOEMName,
      oemRefNum: this.companyOEMRefNum,
      companyOEMQuarterID: this.quarterID });
      this.router.navigate(['companies', 'oem', 'quarter', 'supply']);
  }
}
