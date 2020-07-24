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
import { Router } from '@angular/router';
import { Company, CompaniesListResponse } from 'src/app/models/HttpResponses/CompaniesListResponse';
import { CompanyList } from 'src/app/models/HttpRequests/Company';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-view-company-oem-list',
  templateUrl: './view-company-oem-list.component.html',
  styleUrls: ['./view-company-oem-list.component.scss']
})
export class ViewCompanyOemListComponent implements OnInit {

  constructor(private companyService: CompanyService,
              private userService: UserService,
              private themeService: ThemeService,
              public router: Router
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

  companiesList: Company[] = [];
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

  CompanyControl = new FormControl();
  CompanySearch: string;

  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  sidebarCollapsed = true;
  selectedRow = -1;
  oemCompanyID: number;
  companyID: number;
  companyName: string;
  focusOEMID: number;
  focusOEMName: string;
  focusOEMRefNum: string;
  OEM: CompanyOEM = {
    RowNum: -1,
    CompanyOEMID: -1,
    OEMCompanyName: '',
    OEMRefNum: ''
  };

  tableHeader: TableHeader = {
    title: 'Company OEMs',
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
      title: 'Company OEMs',
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
        propertyName: 'OEMCompanyName',
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
      title: 'OEM Name',
      propertyName: 'OEMCompanyName',
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

    this.loadCompanies();
    // this.loadCompanyOEMs();
    const obj: PaginationChange = {
      rowStart: 1,
      rowEnd: 15
    };
    this.pageChange(obj);

    this.CompanyControl.valueChanges.subscribe((value) => {
      if (value) {
        if (value.companyID) {
          this.selectedOEMCompany(value.companyID, value.name);
        } else {
          this.CompanySearch = value;
        }
      }
    });
  }

  back() {
    // tslint:disable-next-line: no-unused-expression
    this.router;
  }

  loadCompanyOEMs() {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        companyID: this.companyID,
        companyOEMID: -1,
        rowStart: this.rowStart,
        filter: this.filter,
        rowEnd: this.rowEnd,
        orderBy: this.orderBy,
        orderByDirection: this.orderDirection
      },
      requestProcedure: 'CompanyOEMList'
    };
    // company service api call
    this.companyService.companyOEMList(model).then(
      (res: CompanyOEMList) => {
        console.log('res here ' + JSON.stringify(res));
        if (res.data.length === 0) {
          this.noData = true;
          this.showLoader = false;
          this.dataList = [];
        } else {
          this.noData = false;
          this.dataset = res;
          this.dataList = res.data;
          // log('oem list: ' + JSON.stringify(this.dataList));
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
  AddCompanyOEM() {
    let error = 0;
    this.CompanyControl.reset();
    if (this.oemCompanyID === 0 || this.oemCompanyID === undefined) {
      error++;
    }

    if (!this.OEM.OEMRefNum || this.OEM.OEMRefNum === null || this.OEM.OEMRefNum === '') {
      error++;
    }

    if (error === 0) {
    const model = {
      requestParams: {
      userID: this.currentUser.userID,
      oemCompanyID: this.oemCompanyID,
      CompanyID: this.companyID,
      oemRefNum: this.OEM.OEMRefNum
      },
      requestProcedure: 'CompanyOEMCreate'
    };
    // console.log('model = ' + JSON.stringify(model));
    // company service api call
    this.companyService.companyOEMAdd(model).then(
      (res: Outcome) => {
        // console.log('res ' + JSON.stringify(res));
        if (res.outcome === 'SUCCESS') {
          this.noData = true;
          this.showLoader = false;
          this.closeaddModal.nativeElement.click();
          this.notify.successmsg('SUCCESS', 'OEM successfully added');
          this.pageChange({rowStart: this.rowStart, rowEnd: this.rowEnd});
        } else {
          this.notify.errorsmsg(res.outcome, res.outcomeMessage);
          this.closeaddModal.nativeElement.click();
          this.noData = false;
          // this.dataset = res;
          // this.dataList = res.companyOEMs;
          // this.rowCount = res.rowCount;
          this.showLoader = false;
          // this.totalShowing = +this.rowStart + +this.dataset.companyOEMs.length - 1;
          // this.paginateData();
        }
        this.oemCompanyID = 0;
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
    } else {
      this.notify.toastrwarning(
        'Warning',
        'Please fill in all fields'
      );
    }
  }
  EditCompanyOEM(deleted?: boolean) {
    let error = 0;
    this.CompanyControl.reset();

    if (this.oemCompanyID === 0 || this.oemCompanyID === undefined) {
      error++;
    }

    if (!this.focusOEMRefNum || this.focusOEMRefNum === null || this.focusOEMRefNum === '') {
      error++;
    }

    if (error === 0) {
    const model = {
      requestParams: {
      userID: this.currentUser.userID,
      companyOEMID: this.focusOEMID,
      CompanyID: this.companyID,
      OEMCompanyID: this.oemCompanyID,
      oemRefNum: this.focusOEMRefNum,
      isDeleted: deleted
      },
      requestProcedure: 'CompanyOEMUpdate'
    };


    // company service api call
    this.companyService.companyOEMUpdate(model).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.noData = true;
          this.showLoader = false;
          this.closeeditModal.nativeElement.click();
          this.notify.successmsg('SUCCESS', 'OEM Information successfully updated');
          this.pageChange({rowStart: this.rowStart, rowEnd: this.rowEnd});
        } else {
          this.closeeditModal.nativeElement.click();
          this.noData = false;
          // this.dataset = res;
          // this.dataList = res.companyOEMs;
          // this.rowCount = res.rowCount;
          this.showLoader = false;
          // this.totalShowing = +this.rowStart + +this.dataset.companyOEMs.length - 1;
          // this.paginateData();
        }

        this.oemCompanyID = 0;
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
  } else {
    this.notify.toastrwarning(
      'Warning',
      'Please fill in all fields'
    );
  }
  }

  CompanyBar() {
    this.loadCompanies();
  }

  loadCompanies() {
    const model: CompanyList = {
      userID: this.currentUser.userID,
      specificCompanyID: -1,
      rowStart: 1,
      filter: '',
      rowEnd: 100000000,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };

    this.companyService
      .list(model).then(
        (res: CompaniesListResponse) => {
          this.companiesList = res.companies;
          if (res.rowCount === 0) {
            this.noData = true;
          } else {
            // console.log('companies list: ' + res);
            this.noData = false;
            this.companiesList = res.companies;
          }
        },
        msg => {
          this.notify.errorsmsg(
            'Server Error',
            'Something went wrong while trying to access the server.'
          );

        }
      );
  }
  selectedOEMCompany(companyID: number, name: string) {
    // this.countryID = country;
    // console.log(companyID);
    this.oemCompanyID = companyID;
    this.OEM.OEMCompanyName = name;
    // this.form.cooID.value = country;
  }

  recordsPerPageChange($event) {

  }
  pageChange(obj: PaginationChange) {
    // console.log(obj);
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

  searchBar($event) {
    // console.log('Searching');
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.filter = $event;
    this.loadCompanyOEMs();
  }

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadCompanyOEMs();
  }

  displayfn(item) {
    return item ? item.name : '';
  }

  popClick(event, oem) {
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;
    this.focusOEMID = oem.record.companyOEMID;
    this.focusOEMName = oem.record.OEMName;
    this.focusOEMRefNum = oem.record.OEMRefNum;

    // console.log(this.focusOEMRefNum);
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
    // this.selectedRow = index;
    this.contextMenuX = obj.event.clientX + 3;
    this.contextMenuY = obj.event.clientY + 5;
    this.focusOEMID = obj.record.CompanyOEMID;
    this.oemCompanyID = obj.record.OEMCompanyID;
    this.focusOEMName = obj.record.OEMName;
    this.focusOEMRefNum = obj.record.OEMRefNum;


    // console.log(this.focusOEMID);
    if (!this.contextMenu) {
      this.themeService.toggleContextMenu(true);
      this.contextMenu = true;
    } else {
      this.themeService.toggleContextMenu(false);
      this.contextMenu = false;
    }
  }

  EditOEM($event) {
    //  = null;
    // this.OEM.OEMCompanyName = null;
    // this.OEM.OEMRefNum = null;
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;

    const target = this.companiesList.find(x => x.companyID === this.oemCompanyID);
    this.CompanyControl.setValue(target, { emitEvent: false });


    this.openeditModal.nativeElement.click();
  }
  Add() {
    this.OEM.CompanyOEMID = null;
    this.OEM.OEMCompanyName = null;
    this.OEM.OEMRefNum = null;
    this.openaddModal.nativeElement.click();
  }


}

export class CompanyOEM {
  RowNum: number;
  CompanyOEMID: number;
  OEMCompanyName: string;
  OEMRefNum: string;
  OEMCompanyID?: number;
}
export class CompanyOEMList {
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
