import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/Company.Service';

@Component({
  selector: 'app-context-menu-permits',
  templateUrl: './context-menu-permits.component.html',
  styleUrls: ['./context-menu-permits.component.scss']
})
export class ContextMenuPermitsComponent implements OnInit {

  constructor(private router: Router, private companyService: CompanyService) { }

  @Input() permitID: number;
  @Input() permitCode: string;
  @Input() currentTheme: string;

  // @Output() EditCompony = new EventEmitter<string>();

  ngOnInit() {}

  ImportTariffs() {
    this.companyService.setPermit({ permitID: this.permitID, permitCode: this.permitCode});
    this.router.navigate(['companies', 'permits', 'permitimporttariffs']);
  }
}
