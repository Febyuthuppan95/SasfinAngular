import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CompanyService } from 'src/app/services/Company.Service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SelectedCompanyOEM } from 'src/app/views/main/view-company-list/view-company-oem-list/view-company-oem-list.component';

@Component({
  selector: 'app-quarters-supply-context-menu',
  templateUrl: './quarters-supply-context-menu.component.html',
  styleUrls: ['./quarters-supply-context-menu.component.scss']
})
export class QuartersSupplyContextMenuComponent implements OnInit {

  constructor(private companyService: CompanyService) { }
  @Input() currentTheme: string;
  @Input() supplyID: number;

  @Input() x: number;
  @Input() y: number;
  selectedOEM: SelectedCompanyOEM;

  @Output() EditQuarterSupply = new EventEmitter<string>();
  private unsubscribe$ = new Subject<void>();
  ngOnInit() {
    this.companyService.observeCompanyOEM()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((obj: SelectedCompanyOEM) => {
      if (obj !== null || obj !== undefined) {
        this.selectedOEM = obj;
        this.selectedOEM.companyOEMQuarterSupply = this.supplyID
      }
    });
  }
  Edit() {
    this.unsubscribe$.unsubscribe();
    this.EditQuarterSupply.emit(JSON.stringify(this.selectedOEM));
  }

}
