import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';
import { TableHeading, TableConfig, TableHeader, SelectedRecord, Order } from 'src/app/models/Table';
import { SelectedCompanyOEM } from '../view-company-oem-list.component';
import { CompanyService } from 'src/app/services/Company.Service';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { User } from 'src/app/models/HttpResponses/User';
import { Pagination } from 'src/app/models/Pagination';
import { Subject } from 'rxjs';
import { OemQuartersContextMenuComponent } from 'src/app/components/menus/oem-quarters-context-menu/oem-quarters-context-menu.component';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-view-oem-quarter-list',
  templateUrl: './view-oem-quarter-list.component.html',
  styleUrls: ['./view-oem-quarter-list.component.scss']
})
export class ViewOemQuarterListComponent implements OnInit {

  constructor(
    private companyService: CompanyService,
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

   currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  rowStart: number;
  rowEnd: number;
  filter: string;
  orderBy: string;
  orderDirection: string;

  dataList: CompanyOEMQuarter[];
  pages: Pagination[];
  showingPages: Pagination[];
  dataset: CompanyOEMQuartersList;
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


quarters = [
  {value: 1 ,Name: 'Q1'},
  {value: 2 ,Name: 'Q2'},
  {value: 3 ,Name: 'Q3'},
  {value: 4 ,Name: 'Q4'}
];
years = [];
now = new Date().getFullYear();

focusOEMQuarterID: number;
focusPeriodYear: number;
focusPeriodQuarter: number;
selectedOEM: SelectedCompanyOEM;
// TABLE PARAMS

tableHeader: TableHeader = {
  title: 'Company OEM Quarters',
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
    title: 'Company OEM Quarters',
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
      propertyName: 'RowNum',
      order: {
        enable: false,
      }
    },
    {
      title: 'Quarter',
      propertyName: 'QuarterID',
      order: {
        enable: true,
      },
    },
    {
      title: 'Year',
      propertyName: 'PeriodYear',
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
    propertyName: 'RowNum',
    order: {
      enable: false,
    }
  },
  {
    title: 'Quarter',
    propertyName: 'QuarterID',
    order: {
      enable: true,
    },
  },
  {
    title: 'Year',
    propertyName: 'PeriodYear',
    order: {
      enable: true,
    },
  }
];
// END TABLE PARAMS
private unsubscribe$ = new Subject<void>();

@ViewChild(OemQuartersContextMenuComponent, {static: true } )
  private contextmenu: OemQuartersContextMenuComponent;

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
    this.createYears();
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });
    this.companyService.observeCompanyOEM()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((obj: SelectedCompanyOEM) => {
      if (obj !== null || obj !== undefined) {
        this.selectedOEM = obj;
      }
    });
    this.loadOEMQuarters();
  }
  loadOEMQuarters() {
    const model = {
      requestParams: {
      userID: this.currentUser.userID,
      companyOEMQuarterID: -1,
      companyOEMID: this.selectedOEM.companyOEMID,
      rowStart: this.rowStart,
      filter: this.filter,
      rowEnd: this.tableConfig.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
      }, requestProcedure: 'CompanyOEMQuartersList'
    };
    this.companyService.companyOEMQuarterList(model).then(
      (res: CompanyOEMQuartersList) => {
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
  editOEMQuarter() {
    const model = {
      userID: this.currentUser.userID,
      companyOEMQuarterID: this.focusOEMQuarterID,
      quarterID: this.focusPeriodQuarter,
      periodYear: this.focusPeriodYear,
      isDeleted: 0
    };
    this.companyService.companyOEMQuarterUpdate(model).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.noData = false;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.dataset.data.length - 1;
          this.notify.successmsg(res.outcome, res.outcomeMessage);
          this.loadOEMQuarters();
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
  addQuarter() {
    const model = {
      userID: this.currentUser.userID,
      companyOEMID: this.selectedOEM.companyOEMID,
      quarterID: this.focusPeriodQuarter,
      periodYear: this.focusPeriodYear
    };
    this.companyService.companyOEMQuarterAdd(model).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.noData = false;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.dataset.data.length - 1;
          this.notify.successmsg(res.outcome, res.outcomeMessage);
          this.loadOEMQuarters();
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

  searchBar(filter: string) {
    this.rowStart = 1;
    this.loadOEMQuarters();
  }
  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadOEMQuarters();
  }

  popOff() {
    this.contextMenu = false;
    this.selectedRow = -1;
  }
  setClickedRow(obj: SelectedRecord) {
    console.log(obj.record);
    // this.selectedRow = index;
    this.contextMenuX = obj.event.clientX + 3;
    this.contextMenuY = obj.event.clientY + 5;
    this.focusOEMQuarterID = obj.record.CompanyOEMQuarterID;
    
    
    if (!this.contextMenu) {
      this.themeService.toggleContextMenu(true);
      this.contextMenu = true;
    } else {
      this.themeService.toggleContextMenu(false);
      this.contextMenu = false;
    }
  }
  EditQuarter($event) {
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;

    this.openeditModal.nativeElement.click();
  }
  Add() {
    this.focusOEMQuarterID = null;
    this.focusPeriodQuarter = null;
    this.focusPeriodYear = null;
    this.openaddModal.nativeElement.click();
  }
  
createYears() {
  for (var x =0; x < 10; x++) {
    this.years.push(this.now - x);
  }
}
periodYear(year: number) {
  this.focusPeriodYear = year;
}
periodQuarter(quarterID: number) {
  this.focusPeriodQuarter = quarterID;
}
}

export class CompanyOEMQuarter {
  rowNum: number;
  companyOEMID: number;
  companyOEMQuarterID: number;
  quarterID: number;
  periodYear: number;
}
export class CompanyOEMQuartersList {
  data?: CompanyOEMQuarter[];
  rowCount: number;
  outcome: Outcome;
}

