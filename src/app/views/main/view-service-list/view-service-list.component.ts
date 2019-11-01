import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { MenuService } from 'src/app/services/Menu.Service';
import { ContextMenuUserComponent } from '../../../components/menus/context-menu-user/context-menu-user.component';
import { Pagination } from '../../../models/Pagination';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { ImageModalComponent } from '../../../components/image-modal/image-modal.component';
import { UserService } from '../../../services/user.Service';
import { User } from '../../../models/HttpResponses/User';
import { ThemeService } from 'src/app/services/theme.Service.js';
import {SnackbarModel} from '../../../models/StateModels/SnackbarModel';
import {HelpSnackbar} from '../../../services/HelpSnackbar.service';
import { TableHeading, SelectedRecord, Order, TableHeader } from 'src/app/models/Table';
import { Service } from 'src/app/models/HttpResponses/Service';
import { GetServiceLList } from 'src/app/models/HttpRequests/GetServiceLList';
import { ServicesService } from '../../../services/Services.Service';
import { ServiceListResponse } from 'src/app/models/HttpResponses/ServiceListResponse';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-view-service-list',
  templateUrl: './view-service-list.component.html',
  styleUrls: ['./view-service-list.component.scss']
})
export class ContextMenuServiceListComponent implements OnInit, OnDestroy {
  constructor(
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
    this.loadServices(true);
    this.subscription = this.IMenuService.subSidebarEmit$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(result => {
      this.sidebarCollapsed = result;
    });
  }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  tableHeader: TableHeader = {
    title: 'Services',
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
      title: '',
      propertyName: 'rowNum',
      order: {
        enable: false,
      }
    },
    {
      title: 'Service Name',
      propertyName: 'serviceName',
      order: {
        enable: true,
        tag: 'ServiceName'
      }
    }
  ];

  selectedRow = -1;
  ServiceName = '';

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  recordsPerPage = 15;
  sidebarCollapsed = true;
  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  pages: Pagination[];
  showingPages: Pagination[];
  servicelist: Service[] = null;
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

  private unsubscribe$ = new Subject<void>();

  ngOnInit() {

    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });


    this.loadServices(false);
  }

  loadServices(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model: GetServiceLList = {
      filter: this.filter,
      userID: this.currentUser.userID,
      specificServiceID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection

    };
    this.ServiceService
    .getServiceList(model)
    .then(
      (res: ServiceListResponse) => {
        console.log(res.serviceses);

        if (res.outcome.outcome === 'SUCCESS') {
          if (displayGrowl) {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage);
          }
        }

        if (res.rowCount === 0) {
          this.noData = true;
          this.showLoader = false;
        } else {
          this.noData = false;
          this.rowCount = res.rowCount;
          this.showingRecords = res.serviceses.length;
          this.servicelist = res.serviceses;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.servicelist.length - 1;
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
    this.loadServices(false);
  }

  searchBar() {
    this.rowStart = 1;
    this.loadServices(false);
  }


  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadServices(false);
  }

  // popClick(event, user) {
  //   if (this.sidebarCollapsed) {
  //     this.contextMenuX = event.clientX + 3;
  //     this.contextMenuY = event.clientY + 5;
  //   } else {
  //     this.contextMenuX = event.clientX + 3;
  //     this.contextMenuY = event.clientY + 5;
  //   }

  //   // Will only toggle on if off
  //   if (!this.contextMenu) {
  //     this.themeService.toggleContextMenu(true); // Set true
  //     this.contextMenu = true;
  //     // Show menu
  //   } else {
  //     this.themeService.toggleContextMenu(false);
  //     this.contextMenu = false;
  //   }
  // }
  // popOff() {
  //   this.contextMenu = false;
  //   this.selectedRow = -1;
  // }

  // selectedRecord(obj: SelectedRecord) {
  //   this.selectedRow = obj.index;
  //   this.popClick(obj.event, obj.record);
  // }

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
    this.loadServices(true);
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadServices(false);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

