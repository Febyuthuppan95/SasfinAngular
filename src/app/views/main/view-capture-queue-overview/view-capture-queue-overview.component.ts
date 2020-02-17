import { Outcome } from './../../../models/HttpResponses/DoctypeResponse';
import { NotificationComponent } from './../../../components/notification/notification.component';
import { UserService } from './../../../services/User.Service';
import { TableConfig, SelectedRecord } from './../../../models/Table';
import { Router } from '@angular/router';
import { TransactionService } from './../../../services/Transaction.Service';
import { ThemeService } from './../../../services/Theme.Service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-view-capture-queue-overview',
  templateUrl: './view-capture-queue-overview.component.html',
  styleUrls: ['./view-capture-queue-overview.component.scss']
})
export class ViewCaptureQueueOverviewComponent implements OnInit {

  constructor(private themeService: ThemeService, private transactionService: TransactionService,
              private router: Router, private userService: UserService) { }
  currentTheme: string;
  currentUser = this.userService.getCurrentUser();
  showLoader: boolean;
  focusCompanyID: number;
  selectedRow: number;
  tableConfig: TableConfig = {
    header:  {
      title: 'Capture Queue Overview',
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
      { title: '', propertyName: 'rowNum', order: { enable: false } },
      { title: 'Company', propertyName: 'companyName', order: { enable: false } },
      { title: 'Pending', propertyName: 'pending', order: { enable: false } },
      { title: 'Awaiting Upload', propertyName: 'uploading', order: { enable: false } },
      { title: 'Capturable', propertyName: 'capturable', order: { enable: false } },
      { title: 'In Capture', propertyName: 'incapture', order: { enable: false } },
      { title: 'Awaiting Assessment', propertyName: 'unassessed', order: { enable: false } },
      { title: 'In Assessment', propertyName: 'assessing', order: { enable: false } },
      { title: 'Assessment Failed', propertyName: 'assessFailed', order: { enable: false } }
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
    orderBy: '',
    orderByDirection: 'ASC'
  };
  contextMenuX = 0;
  contextMenuY = 0;
  contextMenuEnable = false;
  currentRecord: SelectedRecord;

  @ViewChild(NotificationComponent, { static: false})
  private notify: NotificationComponent;

  ngOnInit() {
    this.themeService.observeTheme()
    .subscribe((theme) => {
      this.currentTheme = theme;
    });
    this.loadDataset();
  }

  loadDataset() {
    this.transactionService.captureQueueGet(this.listRequest).then(
      (res: CaptureQueueList) => {
        this.tableConfig.dataset = res.captureQueue;
        console.log(res);
        if (this.tableConfig.dataset.length > 0) {
          this.notify.toastrwarning(res.outcome.outcome, res.outcome.outcomeMessage);
        } else {
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
        }
      },
      (msg) => {
        this.notify.errorsmsg('Failure', 'Cannot reach server');
      }
    );
  }
  orderChange($event: Event) {

  }
  back() {

  }
  popClick(event, company) {
    console.log('hello');
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;
    this.focusCompanyID = company;
  }
  setClickedRow(index) {
    this.selectedRow = index;
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
    this.contextMenuX = $event.event.clientX + 3;
    this.contextMenuY = $event.event.clientY + 5;
    this.contextMenuEnable = true;
    this.currentRecord = $event.record;
    alert('row click');
  }
}

export class CaptureQueueList {
  outcome: Outcome;
  captureQueue: QueueItem[];
  rowCount: number;
}

export class QueueItem {
  rowNum: number;
  companyID: number;
  companyName: string;
  pending: number;
  uploading: number;
  capturable: number;
  inCapture: number;
  unassessed: number;
  assessing: number;
  assessFailed: number;
}
