import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { TableConfig, TableHeader, Order, SelectedRecord } from 'src/app/models/Table';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { UserService } from 'src/app/services/user.Service';
import { CaptureService } from 'src/app/services/capture.service';
import { ICIListResponse, ICI } from 'src/app/models/HttpResponses/ICI';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogEscalationReasonComponent } from '../dialog-escalation-reason/dialog-escalation-reason.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view-import-clearing-instructions',
  templateUrl: './view-import-clearing-instructions.component.html',
  styleUrls: ['./view-import-clearing-instructions.component.scss']
})
export class ViewImportClearingInstructionsComponent implements OnInit, OnDestroy {
  constructor(private themeService: ThemeService, private transactionService: TransactionService, private userService: UserService,
              private captureService: CaptureService, private router: Router, private dialog: MatDialog) { }

  currentTheme: string;
  currentUser = this.userService.getCurrentUser();
  showLoader: boolean;
  transactionObservation: Subscription;

  // Data Table Configuration
  tableConfig: TableConfig = {
    header:  {
      title: 'Import Clearing Instruction',
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
      { title: 'Supplier Ref', propertyName: 'supplierRef', order: { enable: false } },
      { title: 'Importers Code', propertyName: 'importersCode', order: { enable: false } },
      { title: 'Waybill No', propertyName: 'waybillNo', order: { enable: false } },
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
    specificICIID: -1,
    filter: '',
    rowStart: this.tableConfig.rowStart,
    rowEnd: this.tableConfig.rowEnd,
    orderBy: '',
    orderDirection: 'ASC',
    transactionID: -1,
  };

  @ViewChild(NotificationComponent, { static: false})
  private notify: NotificationComponent;

  transactionSub: Subscription;
  private unsubscribeTransaction$ = new Subject<void>();

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribeTransaction$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.transactionService.observerCurrentAttachment()
    .pipe(takeUntil(this.unsubscribeTransaction$))
    .subscribe(data => {
      if (data.transactionID !== undefined) {
        this.listRequest.transactionID = data.transactionID;
        this.loadDataset();
      }
    });
  }

  loadDataset() {
    this.captureService.iciList(this.listRequest).then(
      (res: ICIListResponse) => {
        this.tableConfig.dataset = res.clearingInstructions;

        if (res.clearingInstructions.length === 0) {
          this.notify.toastrwarning(res.outcome.outcome, res.outcome.outcomeMessage);
        } else {
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
        }

        this.transactionObservation.unsubscribe();
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

  searchEvent(query: string) {
    this.listRequest.filter = query;
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
    this.unsubscribeTransaction$.next();
    this.unsubscribeTransaction$.complete();
  }
}
