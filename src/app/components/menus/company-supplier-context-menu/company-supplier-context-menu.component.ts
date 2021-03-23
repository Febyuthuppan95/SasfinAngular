import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
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
export class CompanySupplierContextMenuComponent implements OnInit, AfterViewInit {

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
  @Output() EditCompony = new EventEmitter<string>();
  @ViewChild('popCont', {static: false}) elementView: ElementRef;
  contentHeight: number;
  contentWidth: number;
  $unsubscribe = new Subject<void>();
  ngOnInit() {
    this.companyService.observeLocalReceipt()
    .pipe(takeUntil(this.$unsubscribe)).subscribe(
      (res: CompanyLocalReceipt) => {
        console.log(res);
        if(res !== null && res !== undefined) {
          this.currentLocalReceipt = res;
        }
      }
    );
  }
  ngAfterViewInit(){
    this.contentHeight = this.elementView.nativeElement.offsetHeight;
    this.contentWidth = this.elementView.nativeElement.offsetWidth;
    if (window.innerHeight < this.contentHeight + this.y)
    {
      this.y = window.innerHeight - this.contentHeight;
    }
    if (window.innerWidth < 190 + this.x){
      this.x = window.innerWidth - 190;
    }
  }
  Edit() {
    console.log('help');
    console.log(this.currentLocalReceipt);
    this.EditQuarterReceipts.emit(JSON.stringify(this.currentLocalReceipt));
  }
  Transactions() {
    this.router.navigate(["companies", "localreceipts", "transactions"]);
  }

}
