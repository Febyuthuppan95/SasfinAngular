import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { TableHeader, TableHeading, Order, SelectedRecord } from 'src/app/models/Table';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/HttpResponses/User';
import { ThemeService } from 'src/app/services/theme.Service';
import { takeUntil } from 'rxjs/operators';
import { Duty, DutyListResponse } from 'src/app/models/HttpRequests/SAD500Line';
import { CaptureService } from 'src/app/services/capture.service';

@Component({
  selector: 'app-view-duty-tax-types',
  templateUrl: './view-duty-tax-types.component.html',
  styleUrls: ['./view-duty-tax-types.component.scss']
})
export class ViewDutyTaxTypesComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService, private themeService: ThemeService, private captureService: CaptureService) { }

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
      title: 'Name',
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
  ];

  private unsubscribe$ = new Subject<void>();

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  recordsPerPage = 15;
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
  showLoader = false;

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
      filter: '',
      rowStart: 1,
      rowEnd: 100,
      orderBy: 'ASC',
      orderDirection: 'Name'
    }).then(
      (res: DutyListResponse) => {
        this.dataset = res.duties;
      },
      (msg) => {}
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
