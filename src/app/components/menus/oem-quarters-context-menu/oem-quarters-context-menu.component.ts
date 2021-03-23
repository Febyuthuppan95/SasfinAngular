import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CompanyService } from 'src/app/services/Company.Service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SelectedCompanyOEM } from 'src/app/views/main/view-company-list/view-company-oem-list/view-company-oem-list.component';

@Component({
  selector: 'app-oem-quarters-context-menu',
  templateUrl: './oem-quarters-context-menu.component.html',
  styleUrls: ['./oem-quarters-context-menu.component.scss']
})
export class OemQuartersContextMenuComponent implements OnInit, AfterViewInit {

  constructor(private router: Router, private companyService: CompanyService) { }
  @Input() currentTheme: string;
  // @Input() companyOEMID: number;
  // @Input() companyOEMName: string;
  // @Input() companyOEMRefNum: string;
  @Input() quarterID: number;

  @Input() x: number;
  @Input() y: number;
  selectedOEM: SelectedCompanyOEM;

  @Output() EditQuarter = new EventEmitter<string>();
  private unsubscribe$ = new Subject<void>();
  @ViewChild('popCont', {static: false}) elementView: ElementRef;
  contentHeight: number;
  contentWidth: number;

  ngOnInit() {
    this.companyService.observeCompanyOEM()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((obj: SelectedCompanyOEM) => {
      if (obj !== null || obj !== undefined) {
        this.selectedOEM = obj;
        this.selectedOEM.companyOEMQuarterID = this.quarterID
      }
    });
  }

  ngAfterViewInit(){
    this.contentHeight = this.elementView.nativeElement.offsetHeight;
    this.contentWidth = this.elementView.nativeElement.offsetWidth;
    if (window.innerHeight < this.contentHeight + this.y)
    {
      this.y = window.innerHeight - this.contentHeight;
    }
    if (window.innerWidth < 150 + this.x){
      this.x = window.innerWidth - 150;
    }
  }

  Edit() {
    this.EditQuarter.emit(JSON.stringify({
      companyOEMID: this.selectedOEM.companyOEMID,
      oemName: this.selectedOEM.oemName,
      oemRefNum: this.selectedOEM.oemRefNum,
      companyOEMQuarterID: this.selectedOEM.companyOEMQuarterID
    }));
  }

  Supply() {
    this.companyService.setCompanyOEM(this.selectedOEM);
    this.router.navigate(['companies', 'oem', 'quarter', 'supply']);
  }

  Sales() {
    this.companyService.setCompanyOEM(this.selectedOEM);
    this.router.navigate(['companies','oem','quarter', 'sales']);
  }
}
