import { FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';
import { CompanyService } from 'src/app/services/Company.Service';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { User } from 'src/app/models/HttpResponses/User';
import { Pagination } from 'src/app/models/Pagination';
import { Subject } from 'rxjs';
import { QuartersSupplyContextMenuComponent } from 'src/app/components/menus/quarters-supply-context-menu/quarters-supply-context-menu.component';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { takeUntil } from 'rxjs/operators';
import { SelectedCompanyOEM } from 'src/app/views/main/view-company-list/view-company-oem-list/view-company-oem-list.component';
import { PaginationChange } from 'src/app/components/pagination/pagination.component';
import { Order, SelectedRecord, TableHeader, TableConfig, TableHeading } from 'src/app/models/Table';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-view-quarter-sales-list',
  templateUrl: './view-quarter-sales-list.component.html',
  styleUrls: ['./view-quarter-sales-list.component.scss']
})
export class ViewQuarterSalesListComponent implements OnInit {

  constructor(private companyService: CompanyService,
              private userService: UserService,
              public router: Router,
              private themeService: ThemeService,
              private api: ApiService) {
      this.rowStart = 1;
      this.rowCountPerPage = 15;
      this.activePage = +1;
      this.prevPageState = true;
      this.nextPageState = false;
      this.prevPage = +this.activePage - 1;
      this.nextPage = +this.activePage + 1;
      this.filter = '';
      this.orderBy = 'Name';
      this.orderDirection = 'ASC';
      this.totalShowing = 0;
      }

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  rowStart: number;
  rowEnd: number;
  filter: string;
  orderBy: string;
  orderDirection: string;

  dataList: OEMQuarterSales[];
  pages: Pagination[];
  showingPages: Pagination[];
  dataset: OEMQuarterSalesList;
  rowCount: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;

  totalShowing: number;
  orderIndicator = 'Name_ASC';
  rowCountPerPage: number;
  showingRecords = 15;
  activePage: number;

  noData = false;
  showLoader = true;
  displayFilter = false;

  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  sidebarCollapsed = true;
  selectedRow = -1;
  selectedCompanyOEM: SelectedCompanyOEM;
  selectedQuarterSale: SelectedOEMQuarterSales = {
    rowNum: -1,
    companyOEMQuarterSalesID: -1,
    quantity: 0,
    item: -1,
    price: 0
  };
  itemID: FormControl = new FormControl();

  tableHeader: TableHeader = {
    title: 'Quarterly Sales',
    addButton: {
      enable: true,
    },
    backButton: {
      enable: true,
    },
    filters: {
      search: true,
      selectRowCount: true,
    }
  };
  tableConfig: TableConfig = {
    header: {
      title: 'Quarterly Sales',
      addButton: {
        enable: true,
      },
      backButton: {
        enable: true,
      },
      filters: {
        search: true,
        selectRowCount: true,
      }
    },
    headings: [
      {
        title: '#',
        propertyName: 'RowNum',
        order: {
          enable: false
        }
      },
      {
        title: 'Name',
        propertyName: 'Name',
        order: {
          enable: true
        }
      },
      {
        title: 'Quantity',
        propertyName: 'Quantity',
        order: {
          enable: true
        }
      },
      {
        title: 'Price',
        propertyName: 'Unit Price',
        order: {
          enable: true
        }
      },
    ],
    rowStart: 1,
    rowEnd: 15,
    recordsPerPage: 15,
    orderBy: '',
    orderByDirection: '',
    dataset: null
  };
  tableHeadings: TableHeading[] = [
    {
      title: '#',
      propertyName: 'RowNum',
      order: {
        enable: false
      }
    },
    {
      title: 'Name',
      propertyName: 'Name',
      order: {
        enable: true
      }
    },
    {
      title: 'Quantity',
      propertyName: 'Quantity',
      order: {
        enable: true
      }
    },
    {
      title: 'Unit Price',
      propertyName: 'UnitPrice',
      order: {
        enable: true
      }
    },
  ];

  private unsubscribe$ = new Subject<void>();

  @ViewChild(QuartersSupplyContextMenuComponent, {static: true } )
  private contextmenu: QuartersSupplyContextMenuComponent;

  @ViewChild(NotificationComponent, { static: true }) private notify: NotificationComponent;

  @ViewChild('openeditModal', {static: true})
  openeditModal: ElementRef;

  @ViewChild('closeeditModal', {static: true})
  closeeditModal: ElementRef;

  @ViewChild('openaddModal', {static: true})
  openaddModal: ElementRef;

  @ViewChild('closeaddModal', {static: true})
  closeaddModal: ElementRef;

  ngOnInit() {
    //Sets theme for page
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });
    //Sets the Company OEM from the company service
    this.companyService.observeCompanyOEM()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((obj: SelectedCompanyOEM) => {
      if (obj !== null || obj !== undefined) {
        this.selectedCompanyOEM = obj;
        // console.log(this.selectedCompanyOEM);
      }
    });
    this.pageChange({rowStart: 1, rowEnd: 15});
  }

  pageChange(obj: PaginationChange) {
    this.rowStart = obj.rowStart;
    this.rowEnd = obj.rowEnd;
    this.loadSalesList();
  }

  //Method calls API to load Sales Items into this.dataList
  async loadSalesList(salesID?) {
    console.log(this.selectedCompanyOEM.companyOEMQuarterID);
    const model = {
      request: {
        userID: this.currentUser.userID,
        companyOEMQuarterSaleID: salesID === null ? -1 : salesID,
        companyOEMQuarterID: this.selectedCompanyOEM.companyOEMQuarterID,
        rowStart: this.rowStart,
        rowEnd: this.rowEnd,
        filter: this.filter,
        orderBy: this.orderBy,
        orderByDirection: this.orderDirection
      },
      procedure: 'CompanyOEMQuarterSalesList'
    };
    await this.api.post(`${environment.ApiEndpoint}/capture/list`, model).then(
      (res: OEMQuarterSalesList) => {
        console.log(res);
          this.dataList = res.data;
          if (res.outcome.outcome === 'SUCCESS') {
            this.noData = false;
            this.dataset = res;
            this.dataList = res.data;
            console.log(this.dataList);
            this.rowCount = res.rowCount;
            this.showLoader = false;
            this.totalShowing = +this.rowStart + +this.dataset.data.length - 1;
            this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          } else {
            this.noData = true;
            this.showLoader = false;
          }
      },
      msg => {
        this.showLoader = false;
        this.notify.errorsmsg(
          'Server Error',
          'Something went wrong while trying to access the server.'
        );
      }
    );
  }

  //Method sends data to API to be stored
  async addSale() {
    const model = {
      request: {
        userID: this.currentUser.userID,
        companyOEMQuarterID: this.selectedCompanyOEM.companyOEMQuarterID,
        itemID: this.itemID.value,
        quantity: this.selectedQuarterSale.quantity,
        unitPrice: this.selectedQuarterSale.price
      },
      procedure: 'CompanyOEMQuarterSalesAdd'
    }
    this.api.post(`${environment.ApiEndpoint}/capture/post`, model).then(
    //this.companyService.companyOEMQuarterSupplyAdd(model).then(
      (res: Outcome) => {
        if (res.outcome) {
          this.notify.successmsg(res.outcome, res.outcomeMessage);
        } else {
          this.notify.errorsmsg('FAILURE', res.outcomeMessage);
        }
        this.pageChange({rowStart: this.rowStart, rowEnd: this.rowEnd});
        this.showLoader = false;
        this.itemID.reset();
        this.closeaddModal.nativeElement.click();
      },
      msg => {
        this.closeaddModal.nativeElement.click();
        this.showLoader = false;
        this.notify.errorsmsg(
          'Server Error',
          'Something went wrong while trying to access the server.'
        );
      }
    );
  }

  //Back arrow fuction
  back() {
    this.router.navigate(['companies', 'oem', 'quarters']);
  }

  //Method sends data to API to be updated
  EditQuarterSale(deleted?: boolean) {
    const model = {
      request: {
        userID: this.currentUser.userID,
        companyOEMQuarterSalesID: this.selectedQuarterSale.companyOEMQuarterSalesID,
        companyOEMQuarterID: this.selectedCompanyOEM.companyOEMQuarterID,
        itemID: this.itemID.value,
        quantity: this.selectedQuarterSale.quantity,
        unitPrice: this.selectedQuarterSale.price,
        isDeleted: deleted
      },
      procedure: 'CompanyOEMQuarterSalesUpdate'
    };
    this.api.post(`${environment.ApiEndpoint}/capture/post`, model).then(
    //this.companyService.companyOEMQuarterSupplyUpdate(model).then(
      (res: Outcome) => {
        console.log(res);
        if (res.outcome) {
          this.notify.successmsg(res.outcome, res.outcomeMessage);
          this.itemID.reset();
          this.selectedQuarterSale = {
            rowNum: -1,
            companyOEMQuarterSalesID: -1,
            quantity: 0,
            item: -1,
            price: 0
          };
        }
        this.pageChange({rowStart: this.rowStart, rowEnd: this.rowEnd});
        this.showLoader = false;
        this.closeeditModal.nativeElement.click();
      },
      msg => {
        this.closeeditModal.nativeElement.click();
        this.showLoader = false;
        this.notify.errorsmsg(
          'Server Error',
          'Something went wrong while trying to access the server.'
        );
      }
    );
  }

  //Fucntion to bring up the add modal
  Add() {
    this.openaddModal.nativeElement.click();
  }

  searchBar(filter:string) {
    this.rowStart = 1;
    this.pageChange({rowStart: this.rowStart, rowEnd: this.rowEnd});
  }

  recordsPerPageChange($event: number) {
    this.rowStart = 1;
    this.rowCountPerPage = $event;
    this.loadSalesList();
  }

  orderChange($event: Order){
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.pageChange({rowStart: this.rowStart, rowEnd: this.rowEnd});
  }

  popOff() {
    this.contextMenu = false;
    this.selectedRow = -1;
  }

  setClickedRow(obj: SelectedRecord) {
    // console.log(obj.record);
    // this.selectedRow = index;
    this.contextMenuX = obj.event.clientX + 3;
    this.contextMenuY = obj.event.clientY + 5;
    console.log(obj);
    this.selectedQuarterSale.rowNum = obj.record.RowNum;
    this.selectedQuarterSale.companyOEMQuarterSalesID = obj.record.CompanyOEMQuarterSaleID;
    this.selectedQuarterSale.item = obj.record.ItemID;
    this.selectedQuarterSale.quantity = obj.record.Quantity;
    this.selectedQuarterSale.price = obj.record.UnitPrice;
    // this.focusOEMQuarterID = obj.record.CompanyOEMQuarterID;
    // this.focusPeriodQuarter = obj.record.QuarterID;
    // this.focusPeriodYear = obj.record.PeriodYear;
    if (!this.contextMenu) {
      this.themeService.toggleContextMenu(true);
      this.contextMenu = true;
    } else {
      this.themeService.toggleContextMenu(false);
      this.contextMenu = false;
    }
  }

  //Fucntion to bring up the edit modal
  EditSales($event) {
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.itemID.setValue(-1);
    this.itemID.updateValueAndValidity();
    console.log(this.itemID);
    this.openeditModal.nativeElement.click();
    this.itemID.setValue(this.selectedQuarterSale.item);
    this.itemID.updateValueAndValidity();
  }
}

export class OEMQuarterSales {
  rowNum: number;
  companyOEMQuarterID: number;
  itemID: number;
  companyOEMQuarterSalesID: number;
  quantity: number;
  unitPrice: number;
}
export class OEMQuarterSalesList {
  data: OEMQuarterSales[];
  rowCount: number;
  outcome: Outcome;
}
export class SelectedOEMQuarterSales {
  rowNum: number;
  salesID?: number;
  companyOEMQuarterSalesID: number;
  item;
  quantity: number;
  price: number;
}
