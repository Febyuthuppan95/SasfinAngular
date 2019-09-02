import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { ContextMenuComponent } from 'src/app/components/context-menu/context-menu.component';
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
    this.rightName = 'Companies';
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

  @ViewChild('closeModal', { static: true })
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
  rightName: string;
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

  newTransaction = {
    name: '',
    transactionTypeID: -1,
    transactionStatusID: -1
  }

  ngOnInit() {
    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.companyService.observeCompany().subscribe((obj: SelectedCompany) => {
      this.companyID = obj.companyID;
      this.companyName = obj.companyName;
    });
    // this.activatedRoute.paramMap
    // .subscribe(params => {
    //   this.companyID = +params.get('id');
    //   this.companyName = params.get('name');
    // });

    this.loadTransactions();
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
      rightName: this.rightName,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };

    console.log(JSON.stringify(model));

    this.transationService
      .list(model)
      .then(
        (res: TransactionListResponse) => {
          if(res.outcome.outcome === 'FAILURE'){
            this.notify.errorsmsg(
              res.outcome.outcome,
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
    this.transationService.createdTransaction(
      this.currentUser.userID,
      this.companyID,
      1,
      1,
      this.newTransaction.name,
      'Transactions'
    ).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.loadTransactions();
          this.notify.successmsg(res.outcome, res.outcomeMessage);
          this.closeModal.nativeElement.click();
        }
      },
      (msg) => {
        this.notify.errorsmsg('Failure', 'Could not reach server');
        this.closeModal.nativeElement.click();
      }
    );
  }

  addTransactionModal() {
    this.openModal.nativeElement.click();
  }

}
