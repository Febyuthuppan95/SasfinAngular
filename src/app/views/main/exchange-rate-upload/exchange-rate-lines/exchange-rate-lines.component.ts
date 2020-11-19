import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { BOMLine } from 'src/app/models/HttpResponses/BOMsLinesResponse';
import { User } from 'src/app/models/HttpResponses/User';
import { Pagination } from 'src/app/models/Pagination';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { Order, SelectedRecord, TableHeader, TableHeading } from 'src/app/models/Table';
import { CompanyService, SelectedROE } from 'src/app/services/Company.Service';
import { DocumentService } from 'src/app/services/Document.Service';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { MenuService } from 'src/app/services/Menu.service';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { environment } from '../../../../../environments/environment';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-exchange-rate-lines',
  templateUrl: './exchange-rate-lines.component.html',
  styleUrls: ['./exchange-rate-lines.component.scss']
})
export class ExchangeRateLinesComponent implements OnInit {

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private themeService: ThemeService,
    private IMenuService: MenuService,
    private router: Router,
    private api: ApiService,
    private snackbarService: HelpSnackbar,
    private IDocumentService: DocumentService,
    // tslint:disable-next-line:no-shadowed-variable
    private ApiService: ApiService
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
      .subscribe((result) => {
        this.sidebarCollapsed = result;
      });
  }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;


  Item: {
    itemID: number;
    item: string;
    description: string;
    tariff: number;
    type: string;
    mIDP: string;
    pI: string;
    vulnerable: string;
  };

  tableHeader: TableHeader = {
    title: 'ROE Lines',
    addButton: {
      enable: false,
    },
    backButton: {
      enable: true,
    },
    filters: {
      search: true,
      selectRowCount: true,
    },
  };

  tableHeadings: TableHeading[] = [
    {
      title: '',
      propertyName: 'RowNum',
      order: {
        enable: false,
      },
    },
    {
      title: 'Country',
      propertyName: 'Country',
      order: {
        enable: true,
        tag: 'Country',
      },
    },
    {
      title: 'Currency',
      propertyName: 'Currency',
      order: {
        enable: true,
        tag: 'Currency',
      },
    },
    {
      title: 'Exchange Rate',
      propertyName: 'ExchangeRate',
      order: {
        enable: true,
        tag: 'ExchangeRate',
      },
    },
    {
      title: 'Date',
      propertyName: 'FullDate',
      order: {
        enable: true,
        tag: 'FullDate',
      },
    },
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

  private unsubscribe$ = new Subject<void>();
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
  ROEDateID = -1;
  bomstatus = '';

  ROELines: any;

  BomFile: File;
  filePreview: string;

  ngOnInit() {
    this.themeService
      .observeTheme()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((theme) => {
        this.currentTheme = theme;
      });

    this.companyService
      .observeROE()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((obj: SelectedROE) => {
        if (obj !== undefined) {
          this.ROEDateID = obj.ROEDateID;
         // this.bomstatus = obj.status;
        }
    });

    this.loadROELines();
  }

  async loadROELines() {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    const requestModel = {
      request: {
        userID: this.currentUser.userID,
        RateOfExchangeDateID: this.ROEDateID,
        filter: this.filter,
        RowStart: this.rowStart,
        RowEnd: this. rowEnd
      },
      procedure: 'RateOfExchangeList'
    };

    await this.api.post(`${environment.ApiEndpoint}/capture/list`, requestModel).then(
      (res: any) => {
        this.showLoader = false;
        this.ROELines = res.data;
        this.rowCount = res.rowCount;

        if (res.outcome.outcome == 'SUCCESS') {
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
        } else {
          this.notify.toastrwarning(res.outcome.outcome, res.outcome.outcomeMessage);
        }

    });
  }

  back() {
    this.router.navigate(['exchangrates']);
  }

  pageChange($event: { rowStart: number; rowEnd: number }) {
    this.rowStart = $event.rowStart;
    this.rowEnd = $event.rowEnd;
    this.loadROELines();
  }

  searchBar() {
    this.rowStart = 1;
    this.loadROELines();
  }

  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadROELines();
  }

  popClick(event, obj) {
    // this.Item = obj;
    // this.contextMenuX = event.clientX + 3;
    // this.contextMenuY = event.clientY + 5;
    // this.themeService.toggleContextMenu(!this.contextMenu);
    // this.contextMenu = true;
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
      if (
        $event.target.attributes.matTooltip !== undefined &&
        $event.target !== undefined
      ) {
        $event.target.setAttribute('mattooltip', 'New Tooltip');
        $event.srcElement.setAttribute('matTooltip', 'New Tooltip');
      }
    }
  }

  recordsPerPageChange(recordsPerPage: number) {
    this.showLoader = true;
    this.rowCountPerPage = recordsPerPage;
    this.rowStart = 1;
    this.loadROELines();
  }

  add() {
    // Render modal
    // this.filePreview = null;
    // this.bomFile.nativeElement.value = '';
    // this.BomFile = null;
    // this.openAddModal.nativeElement.click();
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadROELines();
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
