import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
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

@Component({
  selector: 'app-context-items-list',
  templateUrl: './context-items-list.component.html',
  styleUrls: ['./context-items-list.component.scss']
})
export class ContextItemsListComponent implements OnInit {

  constructor(
    private companyService: CompanyService,
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
    this.subscription = this.IMenuService.subSidebarEmit$.subscribe(result => {
      this.sidebarCollapsed = result;
    });
  }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  tableHeader: TableHeader = {
    title: 'Items',
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
      title: 'Discription',
      propertyName: 'discription',
      order: {
        enable: true,
        tag: 'Discription'
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
      title: 'Usage',
      propertyName: 'usage',
      order: {
        enable: true,
        tag: 'Usage'
      }
    },
    {
      title: 'MIDP',
      propertyName: 'midp',
      order: {
        enable: true,
        tag: 'MIDP'
      }
    },
    {
      title: 'PI',
      propertyName: 'pi',
      order: {
        enable: true,
        tag: 'PI'
      }
    },
    {
      title: 'Vulnerable',
      propertyName: 'vulnerable',
      order: {
        enable: true,
        tag: 'Vulnerable'
      }
    },
    {
      title: '521',
      propertyName: 'n521',
      order: {
        enable: true,
        tag: 'n521'
      }
    },
    {
      title: '536',
      propertyName: 'n536',
      order: {
        enable: true,
        tag: 'n536'
      }
    },
    {
      title: '317.6.1',
      propertyName: 'n31761',
      order: {
        enable: true,
        tag: 'n31761'
      }
    },
    {
      title: '317.6.2',
      propertyName: 'n31762',
      order: {
        enable: true,
        tag: 'n31762'
      }
    },
    {
      title: '317.02',
      propertyName: 'n31702',
      order: {
        enable: true,
        tag: 'n31702'
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

  items: Items[] = [];

  currentUser: User = this.userService.getCurrentUser();
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

  ngOnInit() {

    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.loadItems(true);
  }

  loadItems(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model: GetItemList = {
      userID: this.currentUser.userID,
      filter: this.filter,
      specificItemID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection

    };
    this.companyService
    .getItemList(model)
    .then(
      (res: ItemsListResponse) => {
        console.log(res.itemsLists);
        if (res.outcome.outcome === 'FAILURE') {
          this.notify.errorsmsg(
            res.outcome.outcome,
            res.outcome.outcomeMessage
          );
        } else {
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
          this.showingRecords = res.itemsLists.length;
          this.items = res.itemsLists;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.items.length - 1;
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
    this.loadItems(true);
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadItems(false);
  }

}



