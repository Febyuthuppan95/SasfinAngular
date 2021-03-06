import { Component, OnInit, ViewChild, ElementRef, ViewChildren, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { ContextMenuComponent } from 'src/app/components/menus/context-menu/context-menu.component';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/HttpResponses/User';
import { Pagination } from 'src/app/models/Pagination';
import { CompaniesListResponse, Company } from 'src/app/models/HttpResponses/CompaniesListResponse';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { ActivatedRoute, Router } from '@angular/router';
import { Transaction, TransactionListResponse } from 'src/app/models/HttpResponses/TransactionListResponse';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { TransactionTypes, TransactionTypesResponse } from 'src/app/models/HttpResponses/TransactionTypesList';
import { TransactionStatus, TransactionStatusesResponse } from 'src/app/models/HttpResponses/TransactionStatusList';
import { FormGroup, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CaptureService } from 'src/app/services/capture.service';
import { TransactionFileListResponse } from 'src/app/models/HttpResponses/TransactionFileListModel';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material';
import { DialogTransactionDeleteComponent } from './dialog-transaction-delete/dialog-transaction-delete.component';

@Component({
  selector: 'app-view-transactions',
  templateUrl: './view-transactions.component.html',
  styleUrls: ['./view-transactions.component.scss']
})
export class ViewTransactionsComponent implements OnInit, OnDestroy {

  constructor(
    private transationService: TransactionService,
    private userService: UserService,
    private themeService: ThemeService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private captureService: CaptureService,
    private router: Router,
    private companyService: CompanyService,
    private dialog: MatDialog,
  ) {
    this.rowStart = 1;
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

  @ViewChild(ContextMenuComponent, {static: true } )
  private contextmenu: ContextMenuComponent;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild('openModal', { static: true })
  private openModal: ElementRef;

  @ViewChild('closeModal', {static: false})
  private closeModal: ElementRef;

  defaultProfile =
    `${environment.ApiProfileImages}/default.jpg`;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;

  pages: Pagination[];
  showingPages: Pagination[];
  dataset: TransactionListResponse;
  dataList: Transaction[] = [];
  rowCount: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;

  rowStart: number;
  rowEnd: number;
  filter: string;
  orderBy: string;
  orderDirection: string;

  totalShowing: number;
  orderIndicator = 'Name_ASC';
  rowCountPerPage: number;
  showingRecords: number;
  activePage: number;

  focusHelp: number;
  focusHelpName: string;
  focusDescription: string;
  transactionType: string;
  status: string;

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
  selectedStatus: number;
  selectedType: number;

  transName: string;

  transactionTypes: TransactionTypes[];
  transactionStatus: TransactionStatus[];

  selectedTypeIndex = 0;
  selectedStatusIndex = 0;
  selectedEDIIndex = 0;
  statusDisable: boolean;
  typesDisable: boolean;
  ediDisable: boolean;

  selectTypeControl = new FormControl(0);
  selectEDIControl = new FormControl(0);
  selectStatusControl = new FormControl(0);

  newTransaction = {
    name: '',
    transactionTypeID: -1,
    transactionStatusID: 3
  };

  transactionStatusRequest = {
    rowStart: 1,
    rowEnd: 100,
    filter: '',
    orderBy: '',
    orderByDirection: '',
    userID: this.userService.getCurrentUser().userID,
    specificTransactionStatusID: -1
  };

  transactionTypeRequest = {
    rowStart: 1,
    rowEnd: 100,
    filter: '',
    orderBy: '',
    orderByDirection: '',
    userID: this.userService.getCurrentUser().userID,
    specificTransactionTypesID: -1
  };

  ediStatuses: any[] = [];
  transactionsSendAll = false;

  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.companyService.observeCompany()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((obj: SelectedCompany) => {
      if (obj !== null || obj !== undefined) {
        this.companyID = obj.companyID;
        this.companyName = obj.companyName;
      }
    });

    this.loadTransactions();
    this.loadStatuses();
    this.loadTypes();
    this.loadEDIStatuses();
  }

  async loadAttachments() {
    this.dataList.forEach(async (item) => {
      const model = {
        filter: '',
        userID: this.currentUser.userID,
        specificTransactionID: item.transactionID,
        specificAttachmentID: -1,
        rowStart: 1,
        rowEnd: 1000,
        orderBy: '',
        orderByDirection: ''
      };

      this.transationService.listAttatchments(model)
        .then((res: TransactionFileListResponse) => {
          if (res.attachments.filter(x => x.statusID === 3).length === res.attachments.length && res.attachments.length > 0) {
            item.sendAll = true;
          } else {
            item.sendAll = false;
          }
        });
    });
  }

  async deleteTransaction($event) {
    this.dialog.open(DialogTransactionDeleteComponent).afterClosed().subscribe((value) => {
      if (value) {
        this.captureService.post({ request: $event, procedure: 'TranscactionUpdate' }).then(
          (res: any) => {
            this.loadTransactions();
          }
        );
      }
    });
  }

  loadStatuses() {
    this.transationService.statusList(this.transactionStatusRequest).then(
      (res: TransactionStatusesResponse) => {
        this.transactionStatus = res.transactionStatuses;
      },
      (msg) => {
        this.notify.errorsmsg(
          'Server Error',
          'Something went wrong while trying to access the server.'
        );
      }
    );
  }

  onStatusChange(id: number) {
    this.statusDisable = true;
    this.selectedStatus = id;
  }

  loadTypes() {
    this.transationService.typessList(this.transactionTypeRequest).then(
      (res: TransactionTypesResponse) => {
        this.transactionTypes = res.transactionTypes;
        this.transactionTypes = this.transactionTypes.filter(x => x.name !== 'Local receipt' && x.name !== 'Local Invoice' && x.name !== 'SMD Product Avg');
      },
      (msg) => {
        this.notify.errorsmsg(
          'Server Error',
          'Something went wrong while trying to access the server.'
        );
      }
    );
  }

  onTypeChange(id: number) {
    this.selectedType = id;
    console.log(this.selectedType);
    this.typesDisable = true;
  }

  onEDIChange() {
    this.ediDisable = true;
  }

  paginateData() {
    let rowStart = 1;
    let rowEnd = +this.rowCountPerPage;
    const pageCount = +this.rowCount / +this.rowCountPerPage;
    this.pages = Array<Pagination>();

    for (let i = 0; i < pageCount; i++) {
      const item = new Pagination();
      item.page = i + 1;
      item.rowStart = +rowStart;
      item.rowEnd = +rowEnd;
      this.pages[i] = item;
      rowStart = +rowEnd + 1;
      rowEnd += +this.rowCountPerPage;
    }

    this.updatePagination();
  }

  pageChange(pageNumber: number) {
    const page = this.pages[+pageNumber - 1];
    this.rowStart = page.rowStart;
    this.rowEnd = page.rowEnd;
    this.activePage = +pageNumber;
    this.prevPage = +this.activePage - 1;
    this.nextPage = +this.activePage + 1;

    if (this.prevPage < 1) {
      this.prevPageState = true;
    } else {
      this.prevPageState = false;
    }

    let pagenumber = +this.rowCount / +this.rowCountPerPage;
    const mod = +this.rowCount % +this.rowCountPerPage;

    if (mod > 0) {
      pagenumber++;
    }

    if (this.nextPage > pagenumber) {
      this.nextPageState = true;
    } else {
      this.nextPageState = false;
    }

    this.updatePagination();

    this.loadTransactions();
  }

  searchBar() {
    this.rowStart = 1;
    this.loadTransactions();
  }

  loadTransactions() {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;

    const model = {
      filter: this.filter,
      userID: this.currentUser.userID,
      companyID: this.companyID,
      specificTransactionID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };

    this.transationService
      .list(model)
      .then(
        (res: TransactionListResponse) => {
          console.log('Hello');
          console.log(res);
          if (res.transactions.length === 0) {
            this.notify.toastrwarning(
              res.outcome.outcome,
              res.outcome.outcomeMessage
            );
          } else {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage
            );
          }
          this.dataList = res.transactions;
          this.rowCount = res.rowCount;
          this.showingRecords = res.transactions.length;

          this.showLoader = false;

          if (res.rowCount === 0) {
            this.noData = true;
          } else {
            this.noData = false;
            this.dataset = res;
            this.totalShowing = +this.rowStart + +this.dataset.transactions.length - 1;
            this.paginateData();
            this.loadAttachments();
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

  loadEDIStatuses() {
    this.captureService.ediStatusList({}).then(
      (res: any) => {
        this.ediStatuses = res.data;
        // console.log(this.ediStatuses[0]);
      }
    );
  }

  handleStatus(event: Outcome) {
    if (event.outcome === 'SUCCESS') {
      this.notify.successmsg(event.outcome, event.outcomeMessage);
    } else {
      this.notify.errorsmsg(event.outcome, event.outcomeMessage);
    }
    window.location.reload();
  }

  updateSort(orderBy: string) {
    if (this.orderBy === orderBy) {
      if (this.orderDirection === 'ASC') {
        this.orderDirection = 'DESC';
      } else {
        this.orderDirection = 'ASC';
      }
    } else {
      this.orderDirection = 'ASC';
    }

    this.orderBy = orderBy;
    this.orderIndicator = `${this.orderBy}_${this.orderDirection}`;
    this.loadTransactions();
  }

  updatePagination() {
    if (this.dataset.transactions.length <= this.totalShowing) {
      this.prevPageState = false;
      this.nextPageState = false;
    } else {
      this.showingPages = Array<Pagination>();
      this.showingPages[0] = this.pages[this.activePage - 1];
      const pagenumber = +this.rowCount / +this.rowCountPerPage;

      if (this.activePage < pagenumber) {
        this.showingPages[1] = this.pages[+this.activePage];

        if (this.showingPages[1] === undefined) {
          const page = new Pagination();
          page.page = 1;
          page.rowStart = 1;
          page.rowEnd = this.rowEnd;
          this.showingPages[1] = page;
        }
      }

      if (+this.activePage + 1 <= pagenumber) {
        this.showingPages[2] = this.pages[+this.activePage + 1];
      }
    }

  }

  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  popClick(event, id, name, type, status, sendAll) {
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;

    this.focusHelp = id;
    this.transName = name;
    this.transactionType = type;
    this.status = status;
    this.transactionsSendAll = sendAll;

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
  setClickedRow(index) {
    this.selectedRow = index;
  }

  backToCompanies() {
    this.router.navigate(['companies']);
  }

  addTransaction() {
    console.log(this.selectedType);
    console.log(this.newTransaction);
    let errors = 0;
    this.selectedStatus = 3;// Always setting it to Capturable

    if (this.newTransaction.name === undefined || this.newTransaction.name === null) {
      errors++;
    }

    // if (this.selectedStatus <= 0 || this.selectedStatus === undefined) {
    //   errors++;
    // }

    if (this.selectedType <= 0 || this.selectedStatus === undefined) {
      errors++;
    }

    if (errors === 0) {
      console.log('find');
      this.transationService.createdTransaction(
          this.currentUser.userID,
          this.companyID,
          this.selectedType,
          this.selectedStatus,
          this.newTransaction.name,
        ).then(
          (res: Outcome) => {
            if (res.outcome === 'SUCCESS') {
              this.loadTransactions();
              this.notify.successmsg(res.outcome, res.outcomeMessage);
              this.closeModal.nativeElement.click();
            } else {
              this.notify.errorsmsg(res.outcome, res.outcomeMessage);
            }
          },
          (msg) => {
            this.notify.errorsmsg('Failure', 'Could not reach server');
            this.closeModal.nativeElement.click();
          }
        );
    } else {
      this.notify.toastrwarning('Warning', 'Please enter all fields before submitting');
    }
  }

  addTransactionModal() {
    this.newTransaction.name = null;
    // this.newTransaction.transactionStatusID = 3;
    this.newTransaction.transactionTypeID = -1;
    this.typesDisable = false;
    this.statusDisable = false;
    //this.selectStatusControl.reset(0);
    this.selectTypeControl.reset(0);
    this.selectEDIControl.reset(0);

    this.openModal.nativeElement.click();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

