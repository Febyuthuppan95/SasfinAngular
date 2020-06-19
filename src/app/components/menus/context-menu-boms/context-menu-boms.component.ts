import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/Company.Service';

@Component({
  selector: 'app-context-menu-boms',
  templateUrl: './context-menu-boms.component.html',
  styleUrls: ['./context-menu-boms.component.scss']
})
export class ContextMenuBomsComponent implements OnInit {

  constructor(private router: Router, private companyService: CompanyService) { }

  @Input() BOMID: number;
  @Input() BOMInput: string;
  @Input() Status: string;
  @Input() currentTheme: string;

  // @Output() EditCompony = new EventEmitter<string>();

  ngOnInit() {}

  Bomlines() {
    this.companyService.setBOM({ bomid: this.BOMID, status: this.Status });
    this.router.navigate(['companies', 'boms', 'bomlines']);
  }

  BomLineErrors() {
    this.companyService.setBOM({bomid: this.BOMID, status: this.Status});
    this.router.navigate(['companies', 'boms', 'bomline-errors']);
  }

  Items() {
    this.companyService.setBOM({bomid: this.BOMID, status: this.Status});
    this.router.navigate(['companies', 'boms', 'items']);
  }

  ItemErrors() {
    this.companyService.setBOM({bomid: this.BOMID, status: this.Status});
    this.router.navigate(['companies', 'boms', 'item-errors']);
  }

  ItemGroups() {
    this.companyService.setBOM({bomid: this.BOMID, status: this.Status});
    this.router.navigate(['companies', 'boms', 'itemgroups']);
  }

  ItemGroupErrors() {
    this.companyService.setBOM({bomid: this.BOMID, status: this.Status});
    this.router.navigate(['companies', 'boms', 'itemgroup-errors']);
  }
}
