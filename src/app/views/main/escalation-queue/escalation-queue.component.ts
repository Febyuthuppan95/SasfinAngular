import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { UserService } from 'src/app/services/user.Service';
import { CaptureService } from 'src/app/services/capture.service';
import { CompanyService } from 'src/app/services/Company.Service';
import { ValidateService } from 'src/app/services/Validation.Service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Subscription, Subject } from 'rxjs';
import { TableConfig, SelectedRecord, Order } from 'src/app/models/Table';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { takeUntil } from 'rxjs/operators';
import { SAD500ListResponse } from 'src/app/models/HttpResponses/SAD500Get';
import { DialogEscalationReasonComponent } from '../view-transaction-files/dialog-escalation-reason/dialog-escalation-reason.component';
import { ListReadResponse } from 'src/app/components/forms/capture/form-invoice/form-invoice-lines/form-invoice-lines.component';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { UpdateResponse } from 'src/app/layouts/claim-layout/claim-layout.component';
import { DocumentService } from 'src/app/services/Document.Service';

@Component({
  selector: 'app-escalation-queue',
  templateUrl: './escalation-queue.component.html',
  styleUrls: ['./escalation-queue.component.scss']
})
export class EscalationQueueComponent implements OnInit, OnDestroy {
  constructor(private themeService: ThemeService,
              private apiService: ApiService,
              private userService: UserService,
              private router: Router,
              private docService: DocumentService,
              private transactionService: TransactionService) { }

  currentTheme: string;
  currentUser = this.userService.getCurrentUser();
  showLoader: boolean;
  contextMenu = false;
  transactionObservation: Subscription;
  types: any[] = [];

  // Data Table Configuration
  tableConfig: TableConfig = {
    header:  {
      title: 'Escalation Queue',
      addButton: {
       enable: false,
      },
      backButton: {
        enable: false
      },
      filters: {
        search: true,
        selectRowCount: false,
      }
    },
    headings: [
      { title: '', propertyName: 'RowNum', order: { enable: false } },
      { title: 'Transaction', propertyName: 'Name', order: { enable: false } },
      { title: 'Type', propertyName: 'AttachmentType', order: { enable: false } },
      { title: 'Reason', propertyName: 'Reason', order: { enable: false } },
      { title: 'Capturer', propertyName: 'Capturer', order: { enable: false } },
      { title: 'Date', propertyName: 'Date', order: { enable: false } },
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
    this.loadDoctypes();
  }

  loadDataset() {
    const model = {
      requestParams: this.listRequest,
      requestProcedure: 'EscalationList'
    };
    this.apiService.post(`${environment.ApiEndpoint}/capture/read/list`, model).then(
      (res: ListReadResponse) => {
        const unfiltered = res.data;

        unfiltered.forEach((el) => {
          el.Date = new Date(el.Date).toLocaleString();
        });

        this.tableConfig.dataset = unfiltered;
        this.tableConfig.rowCount = res.rowCount;
      },
      (msg) => {
        this.notify.errorsmsg('Failure', 'Cannot Reach Server');
      }
    );
  }

  loadDoctypes() {
    const model = {
      requestProcedure: 'FileTypesList'
    };
    this.apiService.post(`${environment.ApiEndpoint}/capture/read/list`, model).then(
      (res: ListReadResponse) => {
        this.types = res.data;
      },
      (msg) => {
        this.notify.errorsmsg('Failure', 'Cannot Reach Server');
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

    // this.docService.loadDocumentToViewer($event.record.TheFile);
    // this.transactionService.setCurrentAttachment({
    //   transactionID: $event.record.TransactionID,
    //   attachmentID: $event.record.AttachmentID,
    //   docType: $event.record.RealAttachmentType,
    //   transactionType: 'Import',
    //   issueID: $event.record.StatusID === 7 ? 1 : -1,
    //   reason: $event.record.Reason
    // });

    // this.router.navigate(['capture', 'transaction', 'attachment']);
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

  removeAttachment($event) {
    this.showLoader = true;
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        attachmentID: JSON.parse($event).fileID,
        fileTypeID: JSON.parse($event).fileTypeID,
        isDeleted: 1
      },
      requestProcedure: 'AttachmentsUpdate'
    };

    this.apiService.post(`${environment.ApiEndpoint}/capture/update`, model).then(
      (res: UpdateResponse) => {
        this.showLoader = false;
        this.loadDataset();
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

  previewDocument(src: string) {
    const myWindow = window.open(
      `${environment.appRoute}/documentpreview/${btoa(src)}`,
      '_blank',
      'width=600, height=800, noreferrer'
    );

    myWindow.opener = null;
  }

  ngOnDestroy(): void {
    this.unsubscribeTransaction$.next();
    this.unsubscribeTransaction$.complete();
  }
}
