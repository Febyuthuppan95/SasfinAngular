import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { UserService } from 'src/app/services/user.Service';
import { CaptureService } from 'src/app/services/capture.service';
import { Router } from '@angular/router';
import { TableConfig, Order, SelectedRecord } from 'src/app/models/Table';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { CRNList } from 'src/app/models/HttpResponses/CRNGet';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DialogEscalationReasonComponent } from '../dialog-escalation-reason/dialog-escalation-reason.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view-custom-release-notifications',
  templateUrl: './view-custom-release-notifications.component.html',
  styleUrls: ['./view-custom-release-notifications.component.scss']
})
export class ViewCustomReleaseNotificationsComponent implements OnInit, OnDestroy {

constructor(private themeService: ThemeService, private transactionService: TransactionService, private userService: UserService,
            private captureService: CaptureService, private router: Router, private dialog: MatDialog) { }

  currentTheme: string;
  currentUser = this.userService.getCurrentUser();
  showLoader: boolean;
  // Data Table Configuration
  tableConfig: TableConfig = {
    header:  {
      title: 'Custom Release Notifications',
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
    },
    headings: [
      { title: '', propertyName: 'rowNum', order: { enable: false } },
      { title: 'Waybill No', propertyName: 'waybillNo', order: { enable: false } },
      { title: 'Serial No', propertyName: 'serialNo', order: { enable: false } },
      { title: 'TIN Number', propertyName: 'importersCode', order: { enable: false } },
      { title: 'PCC', propertyName: 'pcc', order: { enable: false } },
      { title: 'LRN', propertyName: 'lrn', order: { enable: false } },
      { title: 'MRN', propertyName: 'mrn', order: { enable: false } },
      { title: 'Status', propertyName: 'status', order: { enable: false } }
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
    crnID: -1,
    filter: '',
    rowStart: this.tableConfig.rowStart,
    rowEnd: this.tableConfig.rowEnd,
    orderBy: '',
    orderDirection: 'ASC',
    transactionID: -1,
  };

  @ViewChild(NotificationComponent, { static: false})
  private notify: NotificationComponent;

  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.transactionService.observerCurrentAttachment()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if (data.transactionID !== undefined) {
        this.listRequest.transactionID = data.transactionID;
        this.loadDataset();
      }
    });
  }

  loadDataset() {
    this.captureService.customsReleaseList(this.listRequest).then(
      (res: CRNList) => {
        // console.log(res);
        this.tableConfig.dataset = res.customs;

        if (res.customs.length === 0) {
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

  back() {
    this.router.navigate(['companies', 'transactions']);
  }

  searchFilter(query: string) {
    this.listRequest.filter = query;
    this.listRequest.rowStart = 1;
    this.listRequest.rowEnd = this.tableConfig.recordsPerPage;
    this.loadDataset();
  }

  orderChange($event: Order) {
    this.listRequest.orderBy = $event.orderBy;
    this.listRequest.orderDirection = $event.orderByDirection;
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
    if ($event.record.statusID === 7) {
      this.dialog.open(DialogEscalationReasonComponent, {
        data: $event.record.escalationReason
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
