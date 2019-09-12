import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { CompanyService } from 'src/app/services/Company.Service';
import { CompaniesContextMenuComponent } from 'src/app/components/menus/companies-context-menu/companies-context-menu.component';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/HttpResponses/User';
import { Pagination } from 'src/app/models/Pagination';
import { CompaniesListResponse, Company } from 'src/app/models/HttpResponses/CompaniesListResponse';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { AddCompany } from 'src/app/models/HttpRequests/AddCompany';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { TouchSequence } from 'selenium-webdriver';
import { UpdateCompany } from 'src/app/models/HttpRequests/UpdateCompany';
import { CompanyList } from 'src/app/models/HttpRequests/CompanyList';

@Component({
  selector: 'app-view-company-list',
  templateUrl: './view-company-list.component.html',
  styleUrls: ['./view-company-list.component.scss']
})
export class ViewCompanyListComponent implements OnInit {

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
  dataList: Company[]
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
  showingRecords: number;
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

  ngOnInit() {

  this.themeService.observeTheme().subscribe((theme) => {
    this.currentTheme = theme;
  });
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

    this.loadCompanies();
  }

  searchBar() {
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
          if (res.rowCount === 0) {
            this.noData = true;
            this.showLoader = false;
          } else {
            this.noData = false;
            this.dataset = res;
            this.dataList = res.companies;
            this.rowCount = res.rowCount;
            this.showLoader = false;
            this.showingRecords = res.companies.length;
            this.totalShowing = +this.rowStart + +this.dataset.companies.length - 1;
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
    this.loadCompanies();
  }

  updatePagination() {
    if (this.dataset.companies.length <= this.totalShowing) {
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

  popClick(event, company) {
    if (this.sidebarCollapsed) {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    } else {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    }

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
  setClickedRow(index) {
    this.selectedRow = index;
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
            this.notify.successmsg('SUCCESS','Company successfully added');
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


  UpdateCompany(){
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

    if (this.CompanyName === null || this.CompanyName === undefined) {
      errors++;
    }

    if (this.RegNo === null || this.CompanyName === undefined) {
      errors++;
    }

    if (this.ExportRegNo === null || this.CompanyName === undefined) {
      errors++;
    }

    if (this.VATNo === null || this.CompanyName === undefined) {
      errors++;
    }

    return errors;
  }
}
