import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CompanyService } from 'src/app/services/Company.Service';
import { Router } from '@angular/router';
import { CompanyLocalReceipt } from 'src/app/views/main/view-company-list/view-company-supplier-list/view-company-supplier-list.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-company-supplier-context-menu',
  templateUrl: './company-supplier-context-menu.component.html',
  styleUrls: ['./company-supplier-context-menu.component.scss']
})
export class CompanySupplierContextMenuComponent implements OnInit {

  constructor(
    private router: Router,
    private companyService: CompanyService
  ) { }

  currentLocalReceipt: CompanyLocalReceipt;
  @Input() x: number;
  @Input() y: number;
  @Input() companyID: number;
  @Input() currentTheme: string;

  @Output() EditQuarterReceipts = new EventEmitter<string>();
  $unsubscribe = new Subject<void>();
  ngOnInit() {
    this.companyService.observeLocalReceipt()
    .pipe(takeUntil(this.$unsubscribe)).subscribe(
      (res: CompanyLocalReceipt) => {
        if(res !== null && res !== undefined) {
          this.currentLocalReceipt = res;
        }
      }
    );
  }
  Edit() {
    this.EditQuarterReceipts.emit(JSON.stringify(this.currentLocalReceipt));
  }
  Transactions() {
    
    this.router.navigate(["companies", "localreceipts", "transaction"]);
  }

}
