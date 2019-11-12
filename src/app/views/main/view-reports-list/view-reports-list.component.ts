import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { MenuService } from 'src/app/services/Menu.Service';
import { Pagination } from '../../../models/Pagination';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { UserService } from '../../../services/user.Service';
import { User } from '../../../models/HttpResponses/User';
import { ThemeService } from 'src/app/services/theme.Service.js';
import {SnackbarModel} from '../../../models/StateModels/SnackbarModel';
import {HelpSnackbar} from '../../../services/HelpSnackbar.service';
import { TableHeading, SelectedRecord, Order, TableHeader } from 'src/app/models/Table';
import { CompanyService } from 'src/app/services/Company.Service';
import { GetItemList } from 'src/app/models/HttpRequests/GetItemList';
import { ItemsListResponse, Items } from 'src/app/models/HttpResponses/ItemsListResponse';
import { UpdateItemResponse } from 'src/app/models/HttpResponses/UpdateItemResponse';
import { GetItemServiceList } from 'src/app/models/HttpRequests/GetItemServiceList';
import { ItemServiceListResponse, ItemService } from 'src/app/models/HttpResponses/ItemServiceListResponse';
import { ServiceListResponse } from 'src/app/models/HttpResponses/ServiceListResponse';
import { GetServiceLList } from 'src/app/models/HttpRequests/GetServiceLList';
import { Service } from 'src/app/models/HttpResponses/Service';
import { ServicesService } from 'src/app/services/Services.Service';
import { AddItemServiceResponse } from 'src/app/models/HttpResponses/AddItemServiceResponse';
import { UpdateItemServiceResponse } from 'src/app/models/HttpResponses/UpdateItemServiceResponse';
import { takeUntil } from 'rxjs/operators';
import { GetReportsList } from 'src/app/models/HttpRequests/GetReportsList';
import { ReportsService } from 'src/app/services/Reports.Service';
import { ReportsListResponse, Report } from 'src/app/models/HttpResponses/ReportsListResponse';

@Component({
  selector: 'app-view-reports-list',
  templateUrl: './view-reports-list.component.html',
  styleUrls: ['./view-reports-list.component.scss']
})
export class ViewReportsListComponent implements OnInit, OnDestroy {

  constructor(
    private reprtsservice: ReportsService,
    private ServiceService: ServicesService,
    private userService: UserService,
    private themeService: ThemeService,
    private IMenuService: MenuService,
    private snackbarService: HelpSnackbar
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
    this.subscription = this.IMenuService.subSidebarEmit$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(result => {
      this.sidebarCollapsed = result;
    });
  }

  private unsubscribe$ = new Subject<void>();

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild('openeditModal', {static: true})
  openeditModal: ElementRef;

  @ViewChild('closeeditModal', {static: true})
  closeeditModal: ElementRef;

  @ViewChild('openRemoveModal', {static: true})
  openRemoveModal: ElementRef;
  @ViewChild('closeRemoveModal', {static: true})
  closeRemoveModal: ElementRef;

  Item: {
    itemID: number,
    item: string,
    description: string,
    tariff: number,
    type: string,
    mIDP: string,
    pI: string,
    vulnerable: string,

  };

  tableHeader: TableHeader = {
    title: 'Reports',
    addButton: {
     enable: false,
    },
    backButton: {
      enable: false
    },
    filters: {
      search: true,
      selectRowCount: true,
    }
  };

  tableHeadings: TableHeading[] = [
    {
      title: '#',
      propertyName: 'rowNum',
      order: {
        enable: false,
      }
    },
    {
      title: 'Report',
      propertyName: 'item',
      order: {
        enable: true,
        tag: 'Item'
      }
    },
    {
      title: 'Company',
      propertyName: 'company',
      order: {
        enable: true,
        tag: 'Company'
      }
    },
    {
      title: 'Type',
      propertyName: 'reportType',
      order: {
        enable: true,
        tag: 'ReportType'
      }
    },
    {
      title: 'Company Service Claim Number',
      propertyName: 'companyServiceClaimNumber',
      order: {
        enable: true,
        tag: 'CompanyServiceClaimNumber'
      }
    },
    {
      title: 'Status',
      propertyName: 'reportStatus',
      order: {
        enable: true,
        tag: 'ReportStatus'
      }
    }
  ];

  selectedRow = -1;
  itemID = 0;
  item = '';
  description = '';
  tariff = 0;
  type = '';
  mIDP = '';
  pI = '';
  vulnerable = '';

  reportslist: Report[] = [];

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  recordsPerPage = 15;
  sidebarCollapsed = true;
  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  showingPages: Pagination[];
  rowCount: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;
  subscription: Subscription;
  rowStart: number;
  rowEnd: number;
  rowCountPerPage: number;
  showingRecords: number;
  filter: string;
  activePage: number;
  orderBy: string;
  orderDirection: string;
  totalShowing: number;
  noData = false;
  showLoader = true;
  displayFilter = false;
  isAdmin: false;

  ngOnInit() {

    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.loadItems(true);

  }

  loadItems(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model: GetReportsList = {
      userID: this.currentUser.userID,
      filter: this.filter,
      reportID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
    this.reprtsservice.getReportsList(model).then(
      (res: ReportsListResponse) => {
        if (res.outcome.outcome === 'SUCCESS') {
          if (displayGrowl) {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage);
          }
        }
        this.reportslist = res.reportsLists;

        if (res.rowCount === 0) {
          this.noData = true;
          this.showLoader = false;
        } else {
          this.noData = false;
          this.rowCount = res.rowCount;
          this.showingRecords = res.reportsLists.length;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.reportslist.length - 1;
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

  pageChange($event: {rowStart: number, rowEnd: number}) {
    this.rowStart = $event.rowStart;
    this.rowEnd = $event.rowEnd;
    this.loadItems(false);
  }

  searchBar() {
    this.rowStart = 1;
    this.loadItems(false);
  }


  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadItems(false);
  }

  popClick(event, obj) {
    this.Item = obj;
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;
    this.themeService.toggleContextMenu(!this.contextMenu);
    this.contextMenu = true;
  }

  selectedRecord(obj: SelectedRecord) {
    this.selectedRow = obj.index;
    this.popClick(obj.event, obj.record);
  }

  updateHelpContext(slug: string, $event?) {
    if (this.isAdmin) {
      const newContext: SnackbarModel = {
        display: true,
        slug,
      };

      this.snackbarService.setHelpContext(newContext);
    } else {
      if ($event.target.attributes.matTooltip !== undefined && $event.target !== undefined) {
        $event.target.setAttribute('mattooltip', 'New Tooltip');
        $event.srcElement.setAttribute('matTooltip', 'New Tooltip');
      }
    }
  }

  recordsPerPageChange(recordsPerPage: number) {
    this.rowCountPerPage = recordsPerPage;
    this.rowStart = 1;
    this.loadItems(true);
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadItems(false);
  }


  onVulnerablestateChange(state: string) {
    this.vulnerable = state;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}



