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
import { GetTariffList } from 'src/app/models/HttpRequests/GetTariffList';
import { CompanyService } from 'src/app/services/Company.Service';
import { TariffListResponse, Tariff } from 'src/app/models/HttpResponses/TariffListResponse';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TariffService } from 'src/app/services/Tariff.service';
import { MatDialog } from '@angular/material';
import { UploadProdatComponent } from './upload-prodat/upload-prodat.component';

@Component({
  selector: 'app-view-tariffs-list',
  templateUrl: './view-tariffs-list.component.html',
  styleUrls: ['./view-tariffs-list.component.scss']
})
export class ContextTariffsListComponent implements OnInit, OnDestroy {

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private themeService: ThemeService,
    private IMenuService: MenuService,
    private snackbarService: HelpSnackbar,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.rowStart = 1;
    this.recordsPerPage = 15;
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
      title: '',
      propertyName: 'rowNum',
      order: {
        enable: false,
      }
    },
    {
      title: 'Item Number',
      propertyName: 'itemNumber',
      order: {
        enable: true,
        tag: 'ItemNumber'
      }
    },
    {
      title: 'Heading',
      propertyName: 'heading',
      order: {
        enable: true,
        tag: 'Heading'
      }
    },
    {
      title: 'Code',
      propertyName: 'tariffCode',
      order: {
        enable: true,
        tag: 'TariffCode'
      }
    },
    {
      title: 'Sub-Heading',
      propertyName: 'subHeading',
      order: {
        enable: true,
        tag: 'SubHeading'
      }
    },
    {
      title: 'Check Digit',
      propertyName: 'checkDigit',
      order: {
        enable: true,
        tag: 'CheckDigit'
      }
    },
    {
      title: 'Description',
      propertyName: 'name',
      order: {
        enable: true,
        tag: 'Name'
      }
    },
    {
      title: 'Duty',
      propertyName: 'duty',
      order: {
        enable: true,
        tag: 'Duty'
      }
    },
    {
      title: 'Unit',
      propertyName: 'hsUnit',
      order: {
        enable: true,
        tag: 'HsUnit'
      }
    }
  ];

  selectedRow = -1;
  tarifflist: Tariff[] = [];

  private unsubscribe$ = new Subject<void>();

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  recordsPerPage: number;
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
  selectedTariff: Tariff;

  ngOnInit() {

    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });
    console.log(this.recordsPerPage);
    this.loadTariffs(false);
    console.log(this.recordsPerPage);
  }

  loadTariffs(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;

    const model: GetTariffList = {
      filter: this.filter,
      userID: this.currentUser.userID,
      specificTariffID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd
    };

    this.companyService
    .getTariffList(model)// model
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

  // orderChange($event: Order) {
  //   this.orderBy = $event.orderBy;
  //   this.orderDirection = $event.orderByDirection;
  //   this.rowStart = 1;
  //   this.rowEnd = this.rowCountPerPage;
  //   this.loadTariffs(false);
  // }

  popClick(event, user) {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
      this.themeService.toggleContextMenu(true);
      this.contextMenu = true;
  }

  popOff() {
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.selectedRow = -1;
  }

  selectedRecord(obj: SelectedRecord) {
    this.selectedRow = obj.index;
    this.selectedTariff = obj.record;
    this.popClick(obj.event, obj.record);
  }

  viewDutyTaxTypes() {
    sessionStorage.setItem('tariffID', this.selectedTariff.id.toString());
    console.log(sessionStorage.getItem('tarriffID'));
    this.router.navigate(['tariff', 'duties']);
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
    this.loadTariffs(true);
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadTariffs(false);
  }

  add() {
    this.dialog.open(UploadProdatComponent, {
      width: '512px',
      closeOnNavigation: true
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}


