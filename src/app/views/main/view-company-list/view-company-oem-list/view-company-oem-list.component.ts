import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CompanyOemContextMenuComponent } from 'src/app/components/menus/company-oem-context-menu/company-oem-context-menu.component';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { Pagination } from 'src/app/models/Pagination';
import { TableHeading, TableConfig, TableHeader, Order, SelectedRecord } from 'src/app/models/Table';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/HttpResponses/User';
import { Subject } from 'rxjs';
import { PaginationChange } from 'src/app/components/pagination/pagination.component';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-view-company-oem-list',
  templateUrl: './view-company-oem-list.component.html',
  styleUrls: ['./view-company-oem-list.component.scss']
})
export class ViewCompanyOemListComponent implements OnInit {

  constructor(private companyService: CompanyService,
    private userService: UserService,
    private themeService: ThemeService
    ) { 
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
    defaultProfile =
    `${environment.ApiProfileImages}/default.jpg`;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  rowStart: number;
  rowEnd: number;
  filter: string;
  orderBy: string;
  orderDirection: string;

  dataList: CompanyOEM[];
  pages: Pagination[];
  showingPages: Pagination[];
  dataset: CompanyOEMList;
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
  focusOEMID: number;
  focusOEMName: string;
  focusOEMRefNum:string;
  OEM: CompanyOEM = {
    RowNum: -1,
    CompanyOEMID: -1,
    OEMName: '',
    OEMRefNum: ''
  };

  tableHeader: TableHeader = {
    title: 'Company OEMs',
    addButton: {
     enable: true,
    },
    backButton: {
      enable: false
    },
    filters: {
      search: true,
      selectRowCount: true,
    }
  };
  tableConfig: TableConfig = {
    header:  {
      title: 'Company OEMs',
      addButton: {
      enable: true,
      },
      backButton: {
        enable: false
      },
      filters: {
        search: true,
        selectRowCount: true,
      }
    },
    headings: [
      {
        title: '',
        propertyName: 'rowNum',
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
      title: '',
      propertyName: 'rowNum',
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
  ];
  private unsubscribe$ = new Subject<void>();
  @ViewChild(CompanyOemContextMenuComponent, {static: true } )
  private contextmenu: CompanyOemContextMenuComponent;

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
      if (obj !== null || obj !== undefined) {
        this.companyID = obj.companyID;
        this.companyName = obj.companyName;
      }
    });
    this.loadCompanyOEMs();
  }

  loadCompanyOEMs() {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        companyID: this.companyID,
        companyOEMID: -1,
        rowStart: this.rowStart,
        filter: this.filter,
        rowEnd: 15,
        orderBy: this.orderBy,
        orderByDirection: this.orderDirection
      },
      requestProcedure: 'CompanyOEMList'
    };
    console.log(model);
    // company service api call
    this.companyService.companyOEMList(model).then(
      (res:CompanyOEMList) => {
        if (res.rowCount === 0) {
          this.noData = true;
          this.showLoader = false;
        } else {
          this.noData = false;
          this.dataset = res;
          this.dataList = res.data;
          console.log(this.dataList);
          this.rowCount = res.rowCount;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.dataset.data.length - 1;
          // this.paginateData();
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
  AddCompanyOEM() {
    const model = {
      userID: this.currentUser.userID,
      companyID: this.companyID,
      oemName: this.OEM.OEMName,
      oemRefNum: this.OEM.OEMRefNum
    };
    // company service api call
    this.companyService.companyOEMAdd(model).then(
      (res:Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.noData = true;
          this.showLoader = false;
          this.loadCompanyOEMs();
        } else {
          this.noData = false;
          // this.dataset = res;
          // this.dataList = res.companyOEMs;
          // this.rowCount = res.rowCount;
          this.showLoader = false;
          // this.totalShowing = +this.rowStart + +this.dataset.companyOEMs.length - 1;
          // this.paginateData();
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
  EditCompanyOEM() {
    const model = {
      userID: this.currentUser.userID,
      companyOEMID: this.OEM.CompanyOEMID,
      oemName: this.focusOEMName,
      oemRefNum: this.focusOEMRefNum
    };

    // company service api call
    this.companyService.companyOEMUpdate(model).then(
      (res:Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.noData = true;
          this.showLoader = false;
          this.notify.successmsg('SUCCESS', 'OEM Information successfully updated')
          this.loadCompanyOEMs();
        } else {
          this.noData = false;
          // this.dataset = res;
          // this.dataList = res.companyOEMs;
          // this.rowCount = res.rowCount;
          this.showLoader = false;
          // this.totalShowing = +this.rowStart + +this.dataset.companyOEMs.length - 1;
          // this.paginateData();
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
  pageChange(obj: PaginationChange) {
    this.rowStart = obj.rowStart;
    this.rowEnd = obj.rowEnd;

    this.loadCompanyOEMs();
    // const page = this.pages[+pageNumber - 1];
    // this.rowStart = page.rowStart;
    // this.rowEnd = page.rowEnd;
    // this.activePage = +pageNumber;
    // this.prevPage = +this.activePage - 1;
    // this.nextPage = +this.activePage + 1;

    // if (this.prevPage < 1) {
    //   this.prevPageState = true;
    // } else {
    //   this.prevPageState = false;
    // }

    // let pagenumber = +this.rowCount / +this.rowCountPerPage;
    // const mod = +this.rowCount % +this.rowCountPerPage;

    // if (mod > 0) {
    //   pagenumber++;
    // }

    // if (this.nextPage > pagenumber) {
    //   this.nextPageState = true;
    // } else {
    //   this.nextPageState = false;
    // }

    // this.updatePagination();

    // this.loadCompanies();
  }
  searchBar(filter: string) {
    this.rowStart = 1;
    this.loadCompanyOEMs();
  }
  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadCompanyOEMs();
  }
  popClick(event, oem) {
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;
    this.focusOEMID = oem.record.companyOEMID;
    this.focusOEMName = oem.record.OEMName;
    this.focusOEMRefNum = oem.record.OEMRefNum;
    console.log(this.focusOEMRefNum);
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
    // this.selectedRow = index;
    this.contextMenuX = obj.event.clientX + 3;
    this.contextMenuY = obj.event.clientY + 5;
    this.focusOEMID = obj.record.CompanyOEMID;
    this.focusOEMName = obj.record.OEMName;
    this.focusOEMRefNum = obj.record.OEMRefNum;
    console.log(this.focusOEMID);
    if (!this.contextMenu) {
      this.themeService.toggleContextMenu(true);
      this.contextMenu = true;
    } else {
      this.themeService.toggleContextMenu(false);
      this.contextMenu = false;
    }
  }

  EditOEM($event) {
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;

    this.openeditModal.nativeElement.click();
  }
  Add() {
    this.OEM.CompanyOEMID = null;
    this.OEM.OEMName = null;
    this.OEM.OEMRefNum = null;
    this.openaddModal.nativeElement.click();
  }


}

export class CompanyOEM {
  RowNum: number;
  CompanyOEMID: number;
  OEMName: string;
  OEMRefNum: string;
}
export class CompanyOEMList{
  rowCount: number;
  data?: CompanyOEM[];
  outcome: Outcome;
}
export class SelectedCompanyOEM {
  companyOEMID: number;
  oemName: string;
  oemRefNum: string;
  companyOEMQuarterID?: number;
  companyOEMQuarterSupply?: number;
}