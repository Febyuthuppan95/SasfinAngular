import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { UserService } from 'src/app/services/user.Service';
import { CaptureService } from 'src/app/services/capture.service';
import { CompanyService } from 'src/app/services/Company.Service';
import { ValidateService } from 'src/app/services/Validation.Service';
import { Router } from '@angular/router';
import { TableConfig, Order } from 'src/app/models/Table';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { ICIListResponse } from 'src/app/models/HttpResponses/ICI';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-view-invoices',
  templateUrl: './view-invoices.component.html',
  styleUrls: ['./view-invoices.component.scss']
})
export class ViewInvoicesComponent implements OnInit, OnDestroy {

  constructor(private themeService: ThemeService, private transactionService: TransactionService, private userService: UserService,
              private captureService: CaptureService, private companyService: CompanyService, private validateService: ValidateService,
              private router: Router) { }

  currentTheme: string;
  currentUser = this.userService.getCurrentUser();
  showLoader: boolean;

  // Data Table Configuration
  tableConfig: TableConfig = {
    header:  {
      title: 'Invoices',
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
      { title: 'Invoice No', propertyName: 'invoiceNo', order: { enable: false } },
      { title: 'Date', propertyName: 'invoiceDate', order: { enable: false } },
    ],
    rowStart: 1,
    rowEnd: 15,
    recordsPerPage: 15,
    orderBy: '',
    orderByDirection: '',
    dataset: null,
  };

  listRequest = {
    userID: this.currentUser.userID,
    invoiceID: -1,
    filter: '',
    rowStart: this.tableConfig.rowStart,
    rowEnd: this.tableConfig.rowEnd,
    orderBy: '',
    orderDirection: 'ASC',
    transactionID: -1,
  };

  Transaction: string;

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
        this.Transaction = data.transactionName;
        this.listRequest.transactionID = data.transactionID;
        this.loadDataset();
      }
      this.tableConfig.header.title = `${ this.Transaction } - Invoices`;
    });
  }

  loadDataset() {
    this.captureService.invoiceList(this.listRequest).then(
      (res: { outcome: Outcome, invoices: [], rowCount: number }) => {
        console.log(res.invoices);
        this.tableConfig.dataset = res.invoices;
        this.tableConfig.rowCount = res.rowCount;

        if (res.invoices.length === 0) {
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
    this.router.navigate(['transaction/attachments']);
  }

  backToTransactions()
  {
    this.router.navigate(['companies/transactions']);
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
