import { Component, OnInit, ViewChild } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { UserService } from 'src/app/services/user.Service';
import { CaptureService } from 'src/app/services/capture.service';
import { Router } from '@angular/router';
import { TableConfig, Order } from 'src/app/models/Table';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { CRNList } from 'src/app/models/HttpResponses/CRNGet';

@Component({
  selector: 'app-view-custom-release-notifications',
  templateUrl: './view-custom-release-notifications.component.html',
  styleUrls: ['./view-custom-release-notifications.component.scss']
})
export class ViewCustomReleaseNotificationsComponent implements OnInit {

constructor(private themeService: ThemeService, private transactionService: TransactionService, private userService: UserService,
            private captureService: CaptureService, private router: Router) { }

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
      { title: 'Supplier Ref', propertyName: 'supplierRef', order: { enable: false } },
      { title: 'Waybill No', propertyName: 'waybillNo', order: { enable: false } },
      { title: 'Serial No', propertyName: 'serialNo', order: { enable: false } },
      { title: 'Importers Code', propertyName: 'importersCode', order: { enable: false } },
      { title: 'FOB', propertyName: 'fob', order: { enable: false } },
      { title: 'Waybill No', propertyName: 'waybillNo', order: { enable: false } },
      { title: 'PCC', propertyName: 'pcc', order: { enable: false } },
      { title: 'LRN', propertyName: 'mrn', order: { enable: false } },
      { title: 'MRN', propertyName: 'lrn', order: { enable: false } },
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

  ngOnInit() {
    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.transactionService.observerCurrentAttachment().subscribe(data => {
      if (data.transactionID !== undefined) {
        this.listRequest.transactionID = data.transactionID;
        this.loadDataset();
      }
    });
  }

  loadDataset() {
    this.captureService.customsReleaseList(this.listRequest).then(
      (res: CRNList) => {
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
}
