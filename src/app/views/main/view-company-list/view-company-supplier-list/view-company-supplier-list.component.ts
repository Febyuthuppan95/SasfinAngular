import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { Router } from '@angular/router';
import { TableHeading, TableConfig, TableHeader, SelectedRecord, Order } from 'src/app/models/Table';
import { User } from 'src/app/models/HttpResponses/User';
import { environment } from 'src/environments/environment';
import { Pagination } from 'src/app/models/Pagination';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';
import { Subject } from 'rxjs';
// tslint:disable-next-line: max-line-length
import { CompanySupplierContextMenuComponent } from 'src/app/components/menus/company-supplier-context-menu/company-supplier-context-menu.component';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { takeUntil } from 'rxjs/operators';
import { PaginationChange } from 'src/app/components/pagination/pagination.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-view-company-supplier-list',
  templateUrl: './view-company-supplier-list.component.html',
  styleUrls: ['./view-company-supplier-list.component.scss']
})
export class ViewCompanySupplierListComponent implements OnInit, OnDestroy {

  constructor(private companyService: CompanyService,
              private userService: UserService,
              private themeService: ThemeService,
              public router: Router,
              private apiService: ApiService) {
      this.rowStart = 1;
      this.rowEnd = 15;
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

    defaultProfile =
    `${environment.ApiProfileImages}/default.jpg`;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  rowStart: number;
  rowEnd: number;
  filter: string;
  orderBy: string;
  orderDirection: string;

  dataList: CompanyLocalReceipt[];
  pages: Pagination[];
  showingPages: Pagination[];
  dataset: CompanyLocalReceiptList;
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
  companyID: number;
  companyName: string;
  focusLocalReceiptID: number;
  focusPeriodYear: number;
  focusQuarterID: number;
  focusOEMID: any;

  SelectedReceipt: CompanyLocalReceipt = {
    RowNum: -1,
    CompanyLocalReceiptID: -1,
    PeriodYear: -1,
    QuarterID: -1,
    CompanyID: -1
  };

  tableHeader: TableHeader = {
    title: 'Quarterly Local Receipts',
    addButton: {
     enable: true,
    },
    backButton: {
      enable: true
    },
    filters: {
      search: true,
      selectRowCount: true,
    }
  };
  tableConfig: TableConfig = {
    header:  {
      title: 'Quarterly Local Receipts',
      addButton: {
      enable: true,
      },
      backButton: {
        enable: true
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
          enable: false,
        }
      },
      {
        title: 'OEM Name',
        propertyName: 'OEMName',
        order: {
          enable: true,
        },
      },
      {
        title: 'Reference Number',
        propertyName: 'OEMRefNum',
        order: {
          enable: true,
        },
      }
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
        enable: false,
      }
    },
    {
      title: 'Period Year',
      propertyName: 'PeriodYear',
      order: {
        enable: true,
      },
    },
    {
      title: 'Quarter',
      propertyName: 'QuarterID',
      order: {
        enable: true,
      },
    }
  ];

  private unsubscribe$ = new Subject<void>();
  @ViewChild(CompanySupplierContextMenuComponent, {static: true } )
  private contextmenu: CompanySupplierContextMenuComponent;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;
  @ViewChild('openeditModal', {static: true})
  openeditModal: ElementRef;

  @ViewChild('closeeditModal', {static: true})
  closeeditModal: ElementRef;

  @ViewChild('openaddModal', {static: true})
  openaddModal: ElementRef;

  @ViewChild('closeaddModal', {static: true})
  closeaddModal: ElementRef;

  ngOnInit() {

    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.companyService.observeCompany()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((obj: SelectedCompany) => {
      // console.log(obj);
      if (obj !== null && obj !== undefined) {
        this.companyID = obj.companyID;
        this.companyName = obj.companyName;
        this.loadLocalReceipts();
      } else {
        this.companyID = 1;
        this.loadLocalReceipts();
      }
    });
    // this.loadCompanyOEMs();
    const obj: PaginationChange = {
      rowStart: 1,
      rowEnd: 15
    };

  }
  ngOnDestroy() {
    this.companyService.flushCompanyLocalReceipt();
  }

  loadLocalReceipts() {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        companyID: this.companyID,
        rowStart: this.rowStart,
        filter: this.filter,
        rowEnd: this.rowEnd,
        orderBy: this.orderBy,
        orderByDirection: this.orderDirection
      },
      requestProcedure: 'CompanyLocalReceiptsList'
    };
    // console.log(model);
    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/536/read`, model).then(
      (res: CompanyLocalReceiptList) => {
        // console.log(res);
        if (res.data.length === 0) {
          this.noData = true;
          this.showLoader = false;
          this.dataList = [];
        } else {
          this.noData = false;
          this.dataset = res;
          this.dataList = res.data;
          // console.log(this.dataList);
          this.rowCount = res.rowCount;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.dataset.data.length - 1;
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
  EditLocalReceipt(flag: boolean) {

  }
  AddLocalReceipt() {

  }
  Add() {}

  recordsPerPageChange($event) {

  }
  pageChange(obj: PaginationChange) {
    // console.log(obj);
    this.rowStart = obj.rowStart;
    this.rowEnd = obj.rowEnd;

    this.loadLocalReceipts();
  }

  searchBar($event) {
    // console.log('Searching');
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.filter = $event;
    this.loadLocalReceipts();
  }

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadLocalReceipts();
  }

  popClick(event, localReceipt) {
    console.log(localReceipt);
    // console.log(localReceipt);
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;
    this.focusLocalReceiptID = localReceipt.localReceiptID;
    this.focusQuarterID = localReceipt.QuarterID;
    this.focusPeriodYear = localReceipt.PeriodYear;
    if (!this.contextMenu) {
      this.themeService.toggleContextMenu(true);
      this.contextMenu = true;
    } else {
      this.themeService.toggleContextMenu(false);
      this.contextMenu = false;
    }
  }
  popOff() {
    this.contextMenu = false;
    this.selectedRow = -1;
  }
  setClickedRow(obj: SelectedRecord) {
    console.log(obj);
    // console.log(obj);
    // this.selectedRow = index;
    this.contextMenuX = obj.event.clientX + 3;
    this.contextMenuY = obj.event.clientY + 5;
    this.focusLocalReceiptID = obj.record.localReceiptID;
    this.focusQuarterID = obj.record.QuarterID;
    this.focusPeriodYear = obj.record.PeriodYear;
    this.companyService.setLocalReceipt(obj.record);
    if (!this.contextMenu) {
      this.themeService.toggleContextMenu(true);
      this.contextMenu = true;
    } else {
      this.themeService.toggleContextMenu(false);
      this.contextMenu = false;
    }
  }
}

export class CompanySupplier {
  RowNum: number;
  SupplierID: number;
  SupplierName: string;
}
export class CompanySupplierList {
  rowCount: number;
  data?: CompanySupplier[];
  outcome: Outcome;
}
export class CompanyLocalReceipt {
  RowNum: number;
  PeriodYear: number;
  QuarterID: number;
  CompanyID: number;
  CompanyLocalReceiptID: number;
  TransactionID?: number;
}
export class CompanyLocalReceiptList {
  rowCount: number;
  data?: CompanyLocalReceipt[];
  outcome: Outcome;
}

