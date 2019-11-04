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
import { TableHeading, Order, TableHeader, SelectedRecord } from 'src/app/models/Table';
import { GetIAlternateItemList } from 'src/app/models/HttpRequests/GetIAlternateItemList';
import { AlternateItemsListResponse, AlternateItems } from 'src/app/models/HttpResponses/AlternateItemsListResponse';
import { CompanyService, SelectedItem } from 'src/app/services/Company.Service';
import { Router } from '@angular/router';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { UpdateGrouplist } from 'src/app/models/HttpResponses/UpdateGrouplist';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-view-alternate-items',
  templateUrl: './view-alternate-items.component.html',
  styleUrls: ['./view-alternate-items.component.scss']
})
export class ViewAlternateItemsComponent implements OnInit, OnDestroy {

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private themeService: ThemeService,
    private IMenuService: MenuService,
    private snackbarService: HelpSnackbar,
    private router: Router
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

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  private unsubscribe$ = new Subject<void>();

  GroupItem: {
    itemID: number,
    item: string,
  };

  tableHeader: TableHeader = {
    title: `Item Group`,
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

  tableHeadings: TableHeading[] = [
    {
      title: '',
      propertyName: 'rowNum',
      order: {
        enable: false,
      }
    },
    {
      title: 'Item',
      propertyName: 'item',
      order: {
        enable: true,
        tag: 'Item'
      }
    },
    {
      title: 'Description',
      propertyName: 'description',
      order: {
        enable: true,
        tag: 'Description'
      }
    },
    {
      title: 'Tariff',
      propertyName: 'tariff',
      order: {
        enable: true,
        tag: 'Tariff'
      }
    },
    {
      title: 'Type',
      propertyName: 'type',
      order: {
        enable: true,
        tag: 'Type'
      }
    },
    {
      title: 'Vulnerable',
      propertyName: 'vulnerable',
      order: {
        enable: true,
        tag: 'Vulnerable'
      }
    }
  ];

  selectedRow = -1;
  Item = '';
  Discription = '';
  Tariff = 0;
  Type = '';
  Usage = '';
  MIDP = '';
  PI = '';
  Vulnerable = '';
  n521 = '';
  n536 = '';
  n31761 = '';
  n31762 = '';
  n31702 = '';

  alternateitems: AlternateItems[] = [];

  currentUser: User = this.userService.getCurrentUser();
  recordsPerPage = 15;
  currentTheme: string;
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
  groupID = '';
  itemName = '';

  ngOnInit() {

    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.companyService.observeItem()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((obj: SelectedItem) => {
      this.groupID = obj.groupID;
      this.itemName = obj.itemName;

      if (this.groupID === '') {
        this.groupID = null;
      }
    });

    this.loadAlternateItems(true);
  }

  loadAlternateItems(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model: GetIAlternateItemList = {
      userID: this.currentUser.userID,
      filter: this.filter,
      specificAlternateItemID: this.groupID,
      specificItemID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
    this.companyService.getAlternateItemList(model).then(
      (res: AlternateItemsListResponse) => {
        if (res.outcome.outcome === 'SUCCESS') {
          this.notify.successmsg(
            res.outcome.outcome,
            res.outcome.outcomeMessage
            );
        }

        this.alternateitems = res.alternateitems;

        if (res.rowCount === 0) {
          this.noData = true;
          this.showLoader = false;
        } else {
          this.noData = false;
          this.rowCount = res.rowCount;
          this.showingRecords = res.alternateitems.length;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.alternateitems.length - 1;
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
    this.loadAlternateItems(false);
  }

  searchBar() {
    this.rowStart = 1;
    this.loadAlternateItems(false);
  }


  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadAlternateItems(false);
  }

  popClick(event, obj) {
    this.GroupItem = obj;
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
    this.loadAlternateItems(true);
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadAlternateItems(false);
  }

  backToItems() {
    this.router.navigate(['companies/items']);
  }

  removeItemGroup(id: number) {
    const requestModel = {
      userID: this.currentUser.userID,
      itemID: this.GroupItem.itemID
    };

    this.companyService.alternatItemsUpdate(requestModel).then(
      (res: UpdateGrouplist) => {
        if (res.outcome.outcome === 'SUCCESS') {
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          this.loadAlternateItems(false);
        } else {
          this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
        }
      },
      (msg) => this.notify.errorsmsg('Failure', 'Cannot reach server')
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}



