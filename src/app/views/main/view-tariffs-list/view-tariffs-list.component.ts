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
import { GetTariffList } from 'src/app/models/HttpRequests/GetTariffList';
import { CompanyService } from 'src/app/services/Company.Service';
import { TariffListResponse, Tariff } from 'src/app/models/HttpResponses/TariffListResponse';

@Component({
  selector: 'app-view-tariffs-list',
  templateUrl: './view-tariffs-list.component.html',
  styleUrls: ['./view-tariffs-list.component.scss']
})
export class ContextTariffsListComponent implements OnInit {

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
    title: 'Tariffs',
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
      title: '#',
      propertyName: 'rowNum',
      order: {
        enable: false,
      }
    },
    {
      title: 'Amount',
      propertyName: 'amount',
      order: {
        enable: true,
        tag: 'Amount'
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
      title: 'Duty %',
      propertyName: 'duty',
      order: {
        enable: true,
        tag: 'Duty'
      }
    },
    {
      title: 'Unit',
      propertyName: 'unit',
      order: {
        enable: true,
        tag: 'Unit'
      }
    }
  ];

  selectedRow = -1;
  // TariffCode = '';
  // TariffName = '';
  Amount = 0;
  Description = '';
  Duty = 0;
  Unit = '';
  // Quality538 = '';
  tarifflist: Tariff[] = [];

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  recordsPerPage = 15;
  sidebarCollapsed = true;
  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  pages: Pagination[];
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

    this.loadTariffs(false);
  }

  loadTariffs(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;

    this.companyService
    .getTariffList()// model
    .then(
      (res: TariffListResponse) => {

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
          this.showingRecords = res.tariffList.length;
          this.tarifflist = res.tariffList;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.tarifflist.length - 1;
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
    this.loadTariffs(false);
  }

  searchBar() {
    this.rowStart = 1;
    this.loadTariffs(false);
  }


  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadTariffs(false);
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
    this.loadTariffs(true);
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadTariffs(false);
  }

}


