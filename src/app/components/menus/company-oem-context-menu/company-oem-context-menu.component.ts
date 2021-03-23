import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/Company.Service';


@Component({
  selector: 'app-company-oem-context-menu',
  templateUrl: './company-oem-context-menu.component.html',
  styleUrls: ['./company-oem-context-menu.component.scss']
})
export class CompanyOemContextMenuComponent implements OnInit, AfterViewInit {

  constructor(private router: Router, private companyService: CompanyService) { }
  @Input() x: number;
  @Input() y: number;
  @Input() companyID: number;
  @Input() companyName: string;
  @Input() currentTheme: string;
  @Input() companyOEMID: number;
  @Input() companyOEMName: string;
  @Input() companyOEMRefNum: string;

  @ViewChild('popCont', {static: false}) elementView: ElementRef;
  contentHeight: number;
  contentWidth: number;

  @Output() EditCompanyOEM = new EventEmitter<string>();
  ngOnInit() {
  }

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

  Edit() {
    this.EditCompanyOEM.emit(JSON.stringify({
      companyOEMID: this.companyOEMID,
      companyOEMName: this.companyOEMName
    }));
  }
  Quarters() {
    // console.log(this.companyOEMID);
    this.companyService.setCompanyOEM({
      companyOEMID: this.companyOEMID,
      oemName: this.companyOEMName,
      oemRefNum: this.companyOEMRefNum });
    this.router.navigate(['companies', 'oem', 'quarters']);
  }

}
