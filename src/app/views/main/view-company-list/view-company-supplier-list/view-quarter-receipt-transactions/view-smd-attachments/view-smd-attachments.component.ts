import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SelectedRecord, TableHeader, TableConfig, TableHeading, Order } from 'src/app/models/Table';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/HttpResponses/User';
import { SupplierC1, SupplierC1List } from 'src/app/components/forms/capture/updates/form-c1/form-c1.component';
import { Pagination } from 'src/app/models/Pagination';
import { Subject } from 'rxjs';
import { ContextMenuLocalAttachmentsComponent } from 'src/app/components/menus/context-menu-local-attachments/context-menu-local-attachments.component';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { takeUntil } from 'rxjs/operators';
import { PaginationChange } from 'src/app/components/pagination/pagination.component';
import { LocalReceipt } from '../view-quarter-receipt-transactions.component';
import { CompanyLocalReceipt } from '../../view-company-supplier-list.component';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';

@Component({
  selector: 'app-view-smd-attachments',
  templateUrl: './view-smd-attachments.component.html',
  styleUrls: ['./view-smd-attachments.component.scss']
})
export class ViewSmdAttachmentsComponent implements OnInit , OnDestroy {

  constructor(private companyService: CompanyService,
              private userService: UserService,
              private themeService: ThemeService,
              public router: Router,
              private apiService: ApiService,
              private transactionService: TransactionService) {
      this.rowStart = 1;
      this.rowEnd = 15;
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
    }

    defaultProfile =
    `${environment.ApiProfileImages}/default.jpg`;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  rowStart: number;
  rowEnd: number;
  filter: string;
  orderBy: string;
  orderDirection: string;

  dataList: SupplierC1[];
  pages: Pagination[];
  showingPages: Pagination[];
  dataset: SupplierC1List;
  rowCount: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;

  totalShowing: number;
  orderIndicator = 'Name_ASC';
  rowCountPerPage: number;
  showingRecords = 15;
  activePage: number;

  noData = false;
  showLoader = true;
  displayFilter = false;

  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  sidebarCollapsed = true;

  selectedRow = -1;
  companyID: number;
  companyName: string;
  focusLocalReceiptID: number;
  focusPeriodYear: number;
  focusQuarterID: number;
  focusOEMID: any;
  focusTransactionID: number;

  SelectedRecord: SupplierC1 = {
   TransactionID: -1,
   CompanyID: -1,
   SupplierName: '',
   CertificateNo: '',
   AttachmentStatus: '',
   AttachmentStatusID: -1,
   FilePath: ''
  };

  fileUpload: File;
  filePreview: string;

  tableHeader: TableHeader = {
    title: 'Supplier SMDs',
    addButton: {
     enable: true,
    },
    backButton: {
      enable: true
    },
    filters: {
      search: true,
      selectRowCount: true,
    }
  };
  tableConfig: TableConfig = {
    header:  {
      title: 'Supplier SMDs',
      addButton: {
      enable: true,
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
      {
        title: '#',
        propertyName: 'RowNum',
        order: {
          enable: false,
        }
      },
      {
        title: 'Supplier C1 ID',
        propertyName: 'SupplierC1ID',
        order: {
          enable: true,
        },
      },
      {
        title: 'Supplier Name',
        propertyName: 'SupplierName',
        order: {
          enable: true,
        }
      },
      {
        title: 'Certificate Number',
        propertyName: 'CertificateNo',
        order: {
          enable: true,
        },
      },
      {
        title: 'Attachment Status',
        propertyName: 'AttachmentStatus',
        order: {
          enable: true,
        },
      }
    ],
    rowStart: 1,
    rowEnd: 15,
    recordsPerPage: 15,
    orderBy: '',
    orderByDirection: '',
    dataset: null
  };
  tableHeadings: TableHeading[] = [
    {
      title: '#',
      propertyName: 'RowNum',
      order: {
        enable: false,
      }
    },
    {
      title: 'Supplier SMD ID',
      propertyName: 'SupplierSMDID',
      order: {
        enable: true,
      },
    },
    {
      title: 'Supplier Name',
      propertyName: 'Supplier',
      order: {
        enable: true,
      }
    },
    {
      title: 'Certificate Number',
      propertyName: 'CertificateNo',
      order: {
        enable: true,
      },
    },
    {
      title: 'Attachment Status',
      propertyName: 'AttachmentStatus',
      order: {
        enable: true,
      },
    }
  ];

  private unsubscribe$ = new Subject<void>();
  @ViewChild(ContextMenuLocalAttachmentsComponent, {static: true } )
  private contextmenu: ContextMenuLocalAttachmentsComponent;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;
  @ViewChild('openeditModal', {static: true})
  openeditModal: ElementRef;

  @ViewChild('closeeditModal', {static: true})
  closeeditModal: ElementRef;

  @ViewChild('openaddModal', {static: true})
  openaddModal: ElementRef;

  @ViewChild('closeaddModal', {static: true})
  closeaddModal: ElementRef;
  @ViewChild('openModal', {static: true})
  openModal: ElementRef;

  @ViewChild('closeModal', {static: true})
  closeModal: ElementRef;
  currentReceipt: CompanyLocalReceipt;
  ngOnInit() {

    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });
    this.companyService.observeLocalReceipt().pipe(takeUntil(this.unsubscribe$)).subscribe(
      (res:CompanyLocalReceipt) => {
        console.log(res);
        if (res !== null && res !== undefined) {
          this.currentReceipt = res;
          this.loadAttachments();
        }
      }
    );
    // this.companyService.observeCompany()
    // .pipe(takeUntil(this.unsubscribe$))
    // .subscribe((obj: SelectedCompany) => {
      
    //   console.log(obj);
    //   if (obj !== null && obj !== undefined) {
    //     this.companyID = obj.companyID;
    //     this.companyName = obj.companyName;
    //     this.focusTransactionID = obj.selectedTransactionID;
    //    this.loadAttachments();
    //   } else {
    //     this.companyID = 1;
    //     this.loadAttachments();
    //   }
    // });
    // this.loadCompanyOEMs();
    const obj: PaginationChange = {
      rowStart: 1,
      rowEnd: 15
    };

  }
  ngOnDestroy() {
    this.companyService.flushCompanyLocalReceipt();
  }

  loadAttachments() {
    const model = {
      request: {
        userID: this.currentUser.userID,
        transactionID: this.currentReceipt.TransactionID,
        rowStart: this.rowStart,
        filter: this.filter,
        rowEnd: this.rowEnd,
        orderBy: this.orderBy,
        orderByDirection: this.orderDirection
      },
      procedure: 'SupplierSMDList'
    };
    // console.log(model);
    this.apiService.post(`${environment.ApiEndpoint}/capture/post`, model).then(
      (res: SupplierC1List) => {

       console.log(res);
        if (res.data.length === 0) {
          this.noData = true;
          this.showLoader = false;
          this.dataList = [];
        } else {
          this.noData = false;
          this.dataset = res;
          this.dataList = res.data;
          // console.log(this.dataList);
          this.rowCount = res.rowCount;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.dataset.data.length - 1;
        }
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
  EditLocalReceipt(flag: boolean) {

  }
  AddLocalReceipt() {

  }
  Add() {}

  recordsPerPageChange($event) {

  }
  openUploadModal() {

    this.openModal.nativeElement.click();
  }
  onFileChange(files: FileList) {
    this.fileUpload = files.item(0);
    this.filePreview = this.fileUpload.name;
  }
  uploadAttachments() {
      this.transactionService.uploadLocalAttachment(
        this.filePreview,
        this.fileUpload,
        'SMD',
        this.currentReceipt.TransactionID,
        this.currentUser.userID,
        this.currentReceipt.Name
      ).then(
        (res: Outcome) => {
          this.notify.successmsg(res.outcome, res.outcomeMessage);
          this.closeModal.nativeElement.click();
        },
        (msg) => {
        this.notify.errorsmsg(
          'Server Error',
          'Something went wrong while trying to access the server.'
        );
        this.closeModal.nativeElement.click();
    }
      );
    }
  pageChange(obj: PaginationChange) {
    // console.log(obj);
    this.rowStart = obj.rowStart;
    this.rowEnd = obj.rowEnd;

    //this.loadTransactions();
  }

  searchBar($event) {
    // console.log('Searching');
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.filter = $event;
    //this.loadTransactions();
  }

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    //this.loadTransactions();
  }

  popClick(event, localReceipt) {
    // console.log(localReceipt);
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;
    this.focusLocalReceiptID = localReceipt.localReceiptID;
    this.focusQuarterID = localReceipt.QuarterID;
    this.focusPeriodYear = localReceipt.PeriodYear;
    if (!this.contextMenu) {
      this.themeService.toggleContextMenu(true);
      this.contextMenu = true;
    } else {
      this.themeService.toggleContextMenu(false);
      this.contextMenu = false;
    }
  }
  popOff() {
    this.contextMenu = false;
    this.selectedRow = -1;
  }
  setClickedRow(obj: SelectedRecord) {
    // console.log(obj);
    // this.selectedRow = index;
    this.contextMenuX = obj.event.clientX + 3;
    this.contextMenuY = obj.event.clientY + 5;
    this.focusLocalReceiptID = obj.record.localReceiptID;
    this.focusQuarterID = obj.record.QuarterID;
    this.focusPeriodYear = obj.record.PeriodYear;
    this.SelectedRecord = obj.record;
    console.log(obj.record);
    this.transactionService.setCurrentAttachment({ 
      transactionID: obj.record.TransactionID,
      attachmentID: obj.record.SupplierC1ID,
      docType: 'SMD',
      transactionType: 'local'
      });
    if (!this.contextMenu) {
      this.themeService.toggleContextMenu(true);
      this.contextMenu = true;
    } else {
      this.themeService.toggleContextMenu(false);
      this.contextMenu = false;
    }
  }
}
