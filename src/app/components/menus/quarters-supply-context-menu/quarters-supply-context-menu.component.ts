import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CompanyService } from 'src/app/services/Company.Service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SelectedCompanyOEM } from 'src/app/views/main/view-company-list/view-company-oem-list/view-company-oem-list.component';
// tslint:disable-next-line: max-line-length
import { LocalReceipt } from 'src/app/views/main/view-company-list/view-company-supplier-list/view-quarter-receipt-transactions/view-quarter-receipt-transactions.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quarters-supply-context-menu',
  templateUrl: './quarters-supply-context-menu.component.html',
  styleUrls: ['./quarters-supply-context-menu.component.scss']
})
export class QuartersSupplyContextMenuComponent implements OnInit {

  constructor(private companyService: CompanyService, private router: Router) { }
  @Input() currentTheme: string;
  @Input() supplyID: number;

  @Input() x: number;
  @Input() y: number;
  selectedTransaction: LocalReceipt;

  @Output() EditQuarterSupply = new EventEmitter<string>();
  // @Output() bulkUploadOut = new EventEmitter<string>();
  private unsubscribe$ = new Subject<void>();
  ngOnInit() {
    this.companyService.observerLocalTransaction()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((obj: LocalReceipt) => {
      if (obj !== null || obj !== undefined) {
        this.selectedTransaction = obj;
      }
    });
  }
  Edit() {
    this.unsubscribe$.unsubscribe();
    this.EditQuarterSupply.emit('1');
  }
  C1Receipts() {
    this.companyService.setLocalTransaction(this.selectedTransaction);
    this.router.navigate(['companies', 'localreceipts', 'transactions', 'c1']);

  }
  SMDReceipts() {
    this.companyService.setLocalTransaction(this.selectedTransaction);
    this.router.navigate(['companies', 'localreceipts', 'transactions', 'smd']);
  }

}
