import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { UpdateResponse } from 'src/app/layouts/claim-layout/claim-layout.component';
import { TableConfig, SelectedRecord } from 'src/app/models/Table';
import { ApiService } from 'src/app/services/api.service';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checking-queue',
  templateUrl: './checking-queue.component.html',
  styleUrls: ['./checking-queue.component.scss']
})
export class CheckingQueueComponent implements OnInit, OnDestroy {
  constructor(private themeService: ThemeService,
              private apiService: ApiService,
              private userService: UserService,
              private router: Router) { }

  currentTheme: string;
  currentUser = this.userService.getCurrentUser();
  showLoader: boolean;
  contextMenu = false;
  transactionObservation: Subscription;

  // Data Table Configuration
  tableConfig: TableConfig = {
    header:  {
      title: 'Linking Queue',
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
    },
    headings: [
      { title: 'Transaction', propertyName: 'Name', order: { enable: false } },
      { title: 'Type', propertyName: 'Type', order: { enable: false } },
      { title: 'Status', propertyName: 'Status', order: { enable: false } },
      { title: 'Created', propertyName: 'Date', order: { enable: false } },
      { title: 'Edited', propertyName: 'Edited', order: { enable: false } },
    ],
    rowStart: 1,
    rowEnd: 15,
    recordsPerPage: 15,
    orderBy: '',
    orderByDirection: '',
    dataset: null
  };

  listRequest = {
    userID: this.currentUser.userID,
    filter: '',
    rowStart: this.tableConfig.rowStart,
    rowEnd: this.tableConfig.rowEnd,
  };

  contextMenuX = 0;
  contextMenuY = 0;
  contextMenuEnable = false;
  currentRecord: SelectedRecord;

  private unsubscribeTransaction$ = new Subject<void>();

  @ViewChild(NotificationComponent, { static: false})
  private notify: NotificationComponent;

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribeTransaction$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.loadDataset();
  }

  loadDataset() {
    const model = {
      request: this.listRequest,
      procedure: 'TransactionLinking'
    };
    this.apiService.post(`${environment.ApiEndpoint}/capture/list`, model).then(
      (res: any) => {
        const unfiltered = res.data;

        unfiltered.forEach((el) => {
          el.Date = new Date(el.DateCreated).toLocaleString('sv-SE');
          el.Edited = new Date(el.DateEdited).toLocaleString('sv-SE');
        });

        this.tableConfig.dataset = unfiltered;
        this.tableConfig.rowCount = res.rowCount;
      },
      (msg) => {
        this.notify.errorsmsg('Failure', 'Cannot Reach Server');
      }
    );
  }

  searchFilter(query: string) {
    this.listRequest.filter = query;
    this.listRequest.rowStart = 1;
    this.listRequest.rowEnd = this.tableConfig.recordsPerPage;
    this.loadDataset();
  }

  recordsPerPageChange(recordsPerPage: number) {
    this.tableConfig.recordsPerPage = recordsPerPage;
    this.listRequest.rowStart = 1;
    this.loadDataset();
  }

  pageChange($event: {rowStart: number, rowEnd: number}) {
    this.listRequest.rowStart = $event.rowStart;
    this.listRequest.rowEnd = $event.rowEnd;
    this.loadDataset();
  }

  selectedRecord($event: SelectedRecord) {
    console.log($event);
    this.currentRecord = $event;
    this.contextMenuX = $event.event.clientX + 3;
    this.contextMenuY = $event.event.clientY + 5;
    this.themeService.toggleContextMenu(!this.contextMenu);
    this.contextMenu = true;
  }

  popClick(event) {
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;
    this.themeService.toggleContextMenu(!this.contextMenu);
    this.contextMenu = true;
  }

  popOff() {
    this.contextMenu = false;
    this.currentRecord = undefined;
  }

  ngOnDestroy(): void {
    this.unsubscribeTransaction$.next();
    this.unsubscribeTransaction$.complete();
  }

}
