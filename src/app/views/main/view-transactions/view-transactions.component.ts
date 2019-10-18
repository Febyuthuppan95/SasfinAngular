import { Component, OnInit, ViewChild, ElementRef, ViewChildren } from '@angular/core';
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

@Component({
  selector: 'app-view-transactions',
  templateUrl: './view-transactions.component.html',
  styleUrls: ['./view-transactions.component.scss']
})
export class ViewTransactionsComponent implements OnInit {

  constructor(
    private transationService: TransactionService,
    private userService: UserService,
    private themeService: ThemeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService
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

  transactionTypes: TransactionTypes[];
  transactionStatus: TransactionStatus[];

  selectedTypeIndex = 0;
  selectedStatusIndex = 0;
  statusDisable: boolean;
  typesDisable: boolean;

  selectTypeControl = new FormControl(0);
  selectStatusControl = new FormControl(0);

  newTransaction = {
    name: '',
    transactionTypeID: -1,
    transactionStatusID: -1
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


  ngOnInit() {
    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.companyService.observeCompany().subscribe((obj: SelectedCompany) => {
      if (obj !== null || obj !== undefined) {
        this.companyID = obj.companyID;
        this.companyName = obj.companyName;
      }
    });

    this.loadTransactions();
    this.loadStatuses();
    this.loadTypes();
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
    this.typesDisable = true;
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
          if (res.transactions.length === 0) {
            this.notify.toastrwarning(
              'Warning',
              res.outcome.outcomeMessage
            );
          } else {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage
            );
          }
          if (res.rowCount === 0) {
            this.noData = true;
            this.showLoader = false;
          } else {
            this.noData = false;
            this.dataset = res;
            this.dataList = res.transactions;
            this.rowCount = res.rowCount;
            this.showLoader = false;
            this.showingRecords = res.transactions.length;
            this.totalShowing = +this.rowStart + +this.dataset.transactions.length - 1;
            this.paginateData();
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

  popClick(event, id) {
    if (this.sidebarCollapsed) {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    } else {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    }

    this.focusHelp = id;

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
    let errors = 0;

    if (this.newTransaction.name === undefined || this.newTransaction.name === null) {
      errors++;
    }

    if (this.selectedStatus <= 0 || this.selectedStatus === undefined) {
      errors++;
    }

    if (this.selectedType <= 0 || this.selectedStatus === undefined) {
      errors++;
    }
    if (errors === 0) {
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
    this.newTransaction.transactionStatusID = -1;
    this.newTransaction.transactionTypeID = -1;
    this.typesDisable = false;
    this.statusDisable = false;
    this.selectStatusControl.reset(0);
    this.selectTypeControl.reset(0);

    this.openModal.nativeElement.click();
  }

}
