import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/Company.Service';

@Component({
  selector: 'app-context-menu-permit-types',
  templateUrl: './context-menu-permit-types.component.html',
  styleUrls: ['./context-menu-permit-types.component.scss']
})
export class ContextMenuPermitTypesComponent implements OnInit {

  constructor(private router: Router, private companyService: CompanyService) { }

  @Input() permitTypeID: number;
  @Input() companyID: number;
  @Input() currentTheme: string;

  // @Output() EditCompony = new EventEmitter<string>();

  ngOnInit() {}

  PermitsList() {
    this.companyService.setPermitType({ permitTypeID: this.permitTypeID, companyID: this.companyID});
    this.router.navigate(['companies', 'permittypes', 'permits']);
  }
}
