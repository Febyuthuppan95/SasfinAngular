import { TableConfig } from './../../../models/Table';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { CompanyService } from 'src/app/services/Company.Service';
import { CompaniesContextMenuComponent } from 'src/app/components/menus/companies-context-menu/companies-context-menu.component';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/HttpResponses/User';
import { Pagination } from 'src/app/models/Pagination';
import { CompaniesListResponse, Company } from 'src/app/models/HttpResponses/CompaniesListResponse';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { CompanyList, AddCompany, UpdateCompany } from 'src/app/models/HttpRequests/Company';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PaginationChange } from 'src/app/components/pagination/pagination.component';
import { SelectedRecord, TableHeader, TableHeading, Order } from 'src/app/models/Table';

@Component({
  selector: 'app-view-company-list',
  templateUrl: './view-company-list.component.html',
  styleUrls: ['./view-company-list.component.scss']
})
export class ViewCompanyListComponent implements OnInit, OnDestroy {

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private themeService: ThemeService,
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
    this.loadCompanies();
  }

  @ViewChild(CompaniesContextMenuComponent, {static: true } )
  private contextmenu: CompaniesContextMenuComponent;

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

  defaultProfile =
    `${environment.ApiProfileImages}/default.jpg`;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  dataList: Company[];
  pages: Pagination[];
  showingPages: Pagination[];
  dataset: CompaniesListResponse;
  rowCount: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;

  CompanyName = '';
  RegNo = '';
  ExportRegNo = '';
  VATNo = '';

  rowStart: number;
  rowEnd: number;
  filter: string;
  orderBy: string;
  orderDirection: string;

  totalShowing: number;
  orderIndicator = 'Name_ASC';
  rowCountPerPage: number;
  showingRecords = 15;
  activePage: number;

  focusCompanyID: number;
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

  private unsubscribe$ = new Subject<void>();

  tableHeader: TableHeader = {
    title: 'Companies',
    addButton: {
     enable: true,
    },
    backButton: {
      enable: false
    },
    filters: {
      search: true,
      selectRowCount: true,
    }
  };
  tableConfig: TableConfig = {
    header:  {
      title: 'Companies',
      addButton: {
      enable: true,
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
      {
        title: '',
        propertyName: 'rowNum',
        order: {
          enable: false,
        }
      },
      {
        title: 'Name',
        propertyName: 'name',
        order: {
          enable: true,
        },
      },
      {
        title: 'Registration No',
        propertyName: 'regNo',
        order: {
          enable: true,
        },
      },
      {
        title: 'Registration Export No',
        propertyName: 'regExportNo',
        order: {
          enable: true,
        },
      },
      {
        title: 'VAT No',
        propertyName: 'vatNo',
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
      title: '',
      propertyName: 'rowNum',
      order: {
        enable: false,
      }
    },
    {
      title: 'Name',
      propertyName: 'name',
      order: {
        enable: true,
      },
    },
    {
      title: 'Registration No',
      propertyName: 'regNo',
      order: {
        enable: true,
      },
    },
    {
      title: 'Registration Export No',
      propertyName: 'regExportNo',
      order: {
        enable: true,
      },
    },
    {
      title: 'VAT No',
      propertyName: 'vatNo',
      order: {
        enable: true,
      },
    },
  ];

  ngOnInit() {

  this.themeService.observeTheme()
  .pipe(takeUntil(this.unsubscribe$))
  .subscribe((theme) => {
    this.currentTheme = theme;
  });
}

  pageChange(obj: PaginationChange) {
    this.rowStart = obj.rowStart;
    this.rowEnd = obj.rowEnd;

    this.loadCompanies();
  }

  recordsPerPageChange() {

  }

  searchBar(filter: string) {
    this.rowStart = 1;
    this.loadCompanies();
  }

  loadCompanies() {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;

    const model: CompanyList = {
      userID: this.currentUser.userID,
      specificCompanyID: -1,
      rowStart: this.rowStart,
      filter: this.filter,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };

    this.companyService
      .list(model).then(
        (res: CompaniesListResponse) => {
          this.dataList = res.companies;
          if (res.rowCount === 0) {
            this.noData = true;
            this.showLoader = false;
          } else {
            this.noData = false;
            this.dataset = res;
            this.dataList = res.companies;
            this.rowCount = res.rowCount;
            this.showLoader = false;
            this.totalShowing = +this.rowStart + +this.dataset.companies.length - 1;
            // this.paginateData();

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

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadCompanies();
  }

  // updateSort(orderBy: string) {
  //   if (this.orderBy === orderBy) {
  //     if (this.orderDirection === 'ASC') {
  //       this.orderDirection = 'DESC';
  //     } else {
  //       this.orderDirection = 'ASC';
  //     }
  //   } else {
  //     this.orderDirection = 'ASC';
  //   }

  //   this.orderBy = orderBy;
  //   this.orderIndicator = `${this.orderBy}_${this.orderDirection}`;
  //   this.loadCompanies();
  // }

  // updatePagination() {
  //   if (this.dataset.companies.length <= this.totalShowing) {
  //     this.prevPageState = false;
  //     this.nextPageState = false;
  //   } else {
  //     this.showingPages = Array<Pagination>();
  //     this.showingPages[0] = this.pages[this.activePage - 1];
  //     const pagenumber = +this.rowCount / +this.rowCountPerPage;

  //     if (this.activePage < pagenumber) {
  //       this.showingPages[1] = this.pages[+this.activePage];

  //       if (this.showingPages[1] === undefined) {
  //         const page = new Pagination();
  //         page.page = 1;
  //         page.rowStart = 1;
  //         page.rowEnd = this.rowEnd;
  //         this.showingPages[1] = page;
  //       }
  //     }

  //     if (+this.activePage + 1 <= pagenumber) {
  //       this.showingPages[2] = this.pages[+this.activePage + 1];
  //     }
  //   }

  // }

  // toggleFilters() {
  //   this.displayFilter = !this.displayFilter;
  // }

  popClick(event, company) {
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;
    this.focusCompanyID = company.companyID;
    this.focusHelpName = company.name;
    this.CompanyName = company.name;
    this.RegNo = company.regNo;
    this.ExportRegNo = company.regExportNo;
    this.VATNo = company.vatNo;
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
    // this.selectedRow = index;
    this.contextMenuX = obj.event.clientX + 3;
    this.contextMenuY = obj.event.clientY + 5;
    this.focusCompanyID = obj.record.companyID;
    this.focusHelpName = obj.record.name;
    this.CompanyName = obj.record.name;
    this.RegNo = obj.record.regNo;
    this.ExportRegNo = obj.record.regExportNo;
    this.VATNo = obj.record.vatNo;
    if (!this.contextMenu) {
      this.themeService.toggleContextMenu(true);
      this.contextMenu = true;
    } else {
      this.themeService.toggleContextMenu(false);
      this.contextMenu = false;
    }
  }

  EditCompony($event) {
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;

    this.openeditModal.nativeElement.click();
  }

  Add() {
    this.CompanyName = null;
    this.RegNo = null;
    this.ExportRegNo = null;
    this.VATNo = null;
    this.openaddModal.nativeElement.click();
  }

  addCompany() {
    const errors = this.validateCompany();
    if (errors === 0) {
    const requestModel: AddCompany = {
      userID: this.currentUser.userID,
      Name: this.CompanyName,
      RegNo: this.RegNo,
      ExportRegNo: this.ExportRegNo,
      VATNo: this.VATNo
    };

    this.companyService.Add(requestModel).then(
      (res: {outcome: Outcome}) => {
          if (res.outcome.outcome !== 'SUCCESS') {
          this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          } else {
            this.notify.successmsg('SUCCESS', 'Company successfully added');
            this.loadCompanies();
            this.closeaddModal.nativeElement.click();
          }
        },
        msg => {
          this.notify.errorsmsg(
            'Server Error',
            'Something went wrong while trying to access the server.'
          );
          this.closeaddModal.nativeElement.click();
        }
      );
    } else {
      this.notify.toastrwarning('Warning', 'Please enter all fields');
    }
  }


  UpdateCompany() {
    const errors = this.validateCompany();
    if (errors === 0) {
      const requestModel: UpdateCompany = {
        userID: this.currentUser.userID,
        SpesificCopmanyID: this.focusCompanyID,
        Name: this.CompanyName,
        RegNo: this.RegNo,
        ExportRegNo: this.ExportRegNo,
        VATNo: this.VATNo
      };

      this.companyService.Update(requestModel).then(
        (res: {outcome: Outcome}) => {
            if (res.outcome.outcome !== 'SUCCESS') {
              this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
            } else {
              this.notify.successmsg('SUCCESS', 'Company successfully Updated');
              this.closeeditModal.nativeElement.click();
              this.loadCompanies();
            }
          },
          msg => {
            this.notify.errorsmsg(
              'Server Error',
              'Something went wrong while trying to access the server.'
            );
          }
        );
    } else {
      this.notify.toastrwarning('Warning', 'Please enter all fields');
    }
  }

  validateCompany(): number {
    let errors = 0;

    if (this.CompanyName === null || this.CompanyName === undefined || this.CompanyName === '') {
      errors++;
    }

    if (this.RegNo === null || this.RegNo === undefined || this.RegNo === '') {
      errors++;
    }

    if (this.ExportRegNo === null || this.ExportRegNo === undefined || this.ExportRegNo === '') {
      errors++;
    }

    if (this.VATNo === null || this.VATNo === undefined || this.VATNo === '') {
      errors++;
    }

    return errors;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
