import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';
import { CompanyService } from 'src/app/services/Company.Service';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { User } from 'src/app/models/HttpResponses/User';
import { Pagination } from 'src/app/models/Pagination';
import { Subject } from 'rxjs';
// tslint:disable-next-line: max-line-length
import { QuartersSupplyContextMenuComponent } from 'src/app/components/menus/quarters-supply-context-menu/quarters-supply-context-menu.component';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { takeUntil } from 'rxjs/operators';
import { SelectedCompanyOEM } from '../../view-company-oem-list.component';
import { PaginationChange } from 'src/app/components/pagination/pagination.component';
import { Order, SelectedRecord, TableHeader, TableConfig, TableHeading } from 'src/app/models/Table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-quarter-supply-list',
  templateUrl: './view-quarter-supply-list.component.html',
  styleUrls: ['./view-quarter-supply-list.component.scss']
})
export class ViewQuarterSupplyListComponent implements OnInit {

  constructor(private companyService: CompanyService,
              private userService: UserService,
              public router: Router,
              private themeService: ThemeService) {
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

  dataList: OEMQuarterSupply[];
  pages: Pagination[];
  showingPages: Pagination[];
  dataset: OEMQuarterSupplyList;
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
  selectedQuarterSupply: SelectedOEMQuarterSupply = {
    rowNum: -1,
    companyOEMQuarterSupplyID: -1,
    productCode: '',
    productDescription: '',
    quantity: 0
  };

  tableHeader: TableHeader = {
    title: 'Quarterly Supplies',
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
      title: 'Quarterly Supplies',
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
        title: 'Product Code',
        propertyName: 'ProductCode',
        order: {
          enable: true,
        },
      },
      {
        title: 'Product Description',
        propertyName: 'ProductDescription',
        order: {
          enable: true,
        },
      },
      {
        title: 'Quantity',
        propertyName: 'Quantity',
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
      title: 'Product Code',
      propertyName: 'ProductCode',
      order: {
        enable: true,
      },
    },
    {
      title: 'Product Description',
      propertyName: 'ProductDescription',
      order: {
        enable: true,
      },
    },
    {
      title: 'Quantity',
      propertyName: 'Quantity',
      order: {
        enable: true,
      },
    }
  ];
  private unsubscribe$ = new Subject<void>();

@ViewChild(QuartersSupplyContextMenuComponent, {static: true } )
  private contextmenu: QuartersSupplyContextMenuComponent;

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
    // console.log(obj);
    this.rowStart = obj.rowStart;
    this.rowEnd = obj.rowEnd;

    this.loadSupplyList();

  }
  loadSupplyList() {
    const model = {
      requestParams: {
          userID: this.currentUser.userID,
          companyOEMQuarterID: this.selectedCompanyOEM.companyOEMQuarterID,
          companyOEMQuarterSupplyID: this.selectedQuarterSupply.companyOEMQuarterSupplyID,
          rowStart: this.rowStart,
          rowEnd: this.rowEnd,
          filter: this.filter,
          orderBy: this.orderBy,
          orderByDirection: this.orderDirection
      },
      requestProcedure: 'CompanyOEMQuarterSupplyList'
    };
    this.companyService.companyOEMQuarterSupplyList(model).then(
      (res: OEMQuarterSupplyList) => {
        console.log(res);
        console.log(model);
        this.dataList = res.data;
        console.log(this.dataList);
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
  addSupply() {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        companyOEMID: this.selectedCompanyOEM.companyOEMID,
        companyOEMQuarterID: this.selectedCompanyOEM.companyOEMQuarterID,
        productCode: this.selectedQuarterSupply.productCode,
        productDescription: this.selectedQuarterSupply.productDescription,
        quantity: this.selectedQuarterSupply.quantity
      },
      requestProcedure: 'CompanyOEMQuarterSupplyCreate'
    };
    this.companyService.companyOEMQuarterSupplyAdd(model).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.pageChange({rowStart: this.rowStart, rowEnd: this.rowEnd});
          this.notify.successmsg(res.outcome, res.outcomeMessage);
        } else {
          this.notify.errorsmsg(res.outcome, res.outcomeMessage);
        }
        this.showLoader = false;
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

  back() {
    this.router.navigate(['companies', 'oem', 'quarters']);
  }

  EditQuarterSupply(deleted?: boolean) {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        companyOEMQuarterID: this.selectedCompanyOEM.companyOEMQuarterID,
        companyOEMQuarterSupplyID: this.selectedQuarterSupply.companyOEMQuarterSupplyID,
        productCode: this.selectedQuarterSupply.productCode,
        productDescription: this.selectedQuarterSupply.productDescription,
        quantity: this.selectedQuarterSupply.quantity,
        isDeleted: deleted
      },
      requestProcedure: 'CompanyOEMQuarterSupplyUpdate'
    };
    this.companyService.companyOEMQuarterSupplyUpdate(model).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.pageChange({rowStart: this.rowStart, rowEnd: this.rowEnd});
          this.notify.successmsg(res.outcome, res.outcomeMessage);
        } else {
          this.notify.errorsmsg(res.outcome, res.outcomeMessage);
        }
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
  Add() {
    // this.focusOEMQuarterID = null;
    // this.focusPeriodQuarter = null;
    // this.focusPeriodYear = null;
    this.openaddModal.nativeElement.click();
  }
  searchBar(filter: string) {
    this.rowStart = 1;
    this.pageChange({rowStart: this.rowStart, rowEnd: this.rowEnd});
  }

  recordsPerPageChange($event: number) {
    this.rowStart = 1;
    this.rowCountPerPage = $event;
    this.loadSupplyList();
  }
  orderChange($event: Order) {
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
    this.selectedQuarterSupply.companyOEMQuarterSupplyID = obj.record.companyOEMQuarterSupplyID;
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
  EditSupply($event) {
    // console.log($event);
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;

    this.openeditModal.nativeElement.click();
  }
}

export class OEMQuarterSupply {
  rowNum: number;
  companyOEmQuarterID: number;
  itemID: number;
  companyOEMQuarterSupplyID: number;
  productCode: string;
  productDescription: string;
  quantity: number;
}

export class OEMQuarterSupplyList {
  data: OEMQuarterSupply[];
  rowCount: number;
  outcome: Outcome;
}
export class SelectedOEMQuarterSupply {
  rowNum: number;
  supplyID?: number;
  companyOEMQuarterSupplyID: number;
  productCode: string;
  productDescription: string;
  quantity: number;
}
