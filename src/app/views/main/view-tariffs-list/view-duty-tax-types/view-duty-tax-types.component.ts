import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { TableHeader, TableHeading, Order, SelectedRecord } from 'src/app/models/Table';
import {Subject, Subscription} from 'rxjs';
import { User } from 'src/app/models/HttpResponses/User';
import { ThemeService } from 'src/app/services/theme.Service';
import { takeUntil } from 'rxjs/operators';
import { Duty, DutyListResponse } from 'src/app/models/HttpRequests/SAD500Line';
import { CaptureService } from 'src/app/services/capture.service';
import {Pagination} from '../../../../components/pagination/pagination.component';
import {MenuService} from '../../../../services/Menu.Service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-duty-tax-types',
  templateUrl: './view-duty-tax-types.component.html',
  styleUrls: ['./view-duty-tax-types.component.scss']
})
export class ViewDutyTaxTypesComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService,
              private themeService: ThemeService,
              private captureService: CaptureService,
              private IMenuService: MenuService,
              private location: Location) {
    this.rowStart = 1;
    this.rowEnd = 15;
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
    title: 'Tariff Duties',
    addButton: {
     enable: false,
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
      title: 'Code',
      propertyName: 'code',
      order: {
        enable: true,
        tag: 'Code'
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
  ];

  private unsubscribe$ = new Subject<void>();

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  recordsPerPage: number;
  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  rowCount: number;
  rowStart: number;
  rowEnd: number;
  filter: string;
  orderBy: string;
  orderDirection: string;
  selectedRow: number;
  dataset: Duty[];
  showLoader = true;
  noData = false;
  showingRecords: number;
  totalShowing: number;
  pages: Pagination[];
  showingPages: Pagination[];
  rowCountPerPage: number;
  activePage: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;
  subscription: Subscription;
  sidebarCollapsed = true;

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.loadDataset(false);
  }

  loadDataset(displayGrowl: boolean) {
    this.captureService.dutyList({
      dutyTaxTypeID: -1,
      filter: this.filter,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderDirection: this.orderDirection
    }).then(
      (res: DutyListResponse) => {
        console.log(JSON.stringify(res));
        if (res.rowCount === 0) {
          this.noData = true;
          this.showLoader = false;
        } else {
          this.noData = false;
          this.rowCount = res.rowCount;
          this.showingRecords = res.duties.length;
          this.dataset = res.duties;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.dataset.length - 1;
        }

        if (res.outcome.outcome === 'SUCCESS') {
          if (displayGrowl) {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage);
          }
        }

      },
      (msg) => {
        this.showLoader = false;
        this.notify.errorsmsg('Server Error',
          'Something went wrong while trying to access the server.');
      }
    );
  }

  pageChange($event: {rowStart: number, rowEnd: number}) {
    this.rowStart = $event.rowStart;
    this.rowEnd = $event.rowEnd;
    this.loadDataset(false);
  }

  searchBar() {
    this.rowStart = 1;
    this.loadDataset(false);
  }

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.recordsPerPage;
    this.loadDataset(false);
  }

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
    this.popClick(obj.event, obj.record);
  }

  recordsPerPageChange(recordsPerPage: number) {
    this.recordsPerPage = recordsPerPage;
    this.rowStart = 1;
    this.loadDataset(true);
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadDataset(false);
  }

  back() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
