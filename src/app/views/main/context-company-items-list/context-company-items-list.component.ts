import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextMenuComponent } from 'src/app/components/menus/context-menu/context-menu.component';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { User } from 'src/app/models/HttpResponses/User';
import { Pagination } from 'src/app/models/Pagination';
import {FormControl} from '@angular/forms';
import { MatAutocomplete } from '@angular/material';
import { CompanyServiceResponse, Service } from 'src/app/models/HttpResponses/CompanyServiceResponse';
import { AddCompanyService } from 'src/app/models/HttpRequests/AddCompanyService';
import { UpdateCompanyService } from 'src/app/models/HttpRequests/UpdateCompanyService';
import { CompanyItemsResponse } from 'src/app/models/HttpResponses/CompanyItemsResponse';
import { Items } from 'src/app/models/HttpResponses/ItemsListResponse';
import { AddCompanyItem } from 'src/app/models/HttpRequests/AddCompanyItem';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { UpdateCompanyItem } from 'src/app/models/HttpRequests/UpdateCompanyItem';

@Component({
  selector: 'app-context-company-items-list',
  templateUrl: './context-company-items-list.component.html',
  styleUrls: ['./context-company-items-list.component.scss']
})
export class ContextCompanyItemsListComponent implements OnInit {


  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private themeService: ThemeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
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
    this.loadCompanyItemsList();
  }

  @ViewChild('openeditModal', {static: true})
  openeditModal: ElementRef;

  @ViewChild('closeeditModal', {static: true})
  closeeditModal: ElementRef;

  @ViewChild('openaddModal', {static: true})
  openaddModal: ElementRef;

  @ViewChild('closeaddModal', {static: true})
  closeaddModal: ElementRef;

  @ViewChild(ContextMenuComponent, {static: true } )
  private contextmenu: ContextMenuComponent;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;
  @ViewChild('auto', {static: false})
  private autoComplete: MatAutocomplete;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;

  pages: Pagination[];
  showingPages: Pagination[];
  dataset: CompanyItemsResponse;
  dataList: Items[] = [];
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
  focusItemID: number;
  selectedRow = -1;
  Item = '';
  Discription = '';
  Tariff = 0;
  Type = '';
  Usage = '';
  MIDP = -1;
  PI = '';
  Vulnerable = '';
  N521 = 0;
  N536 = '';
  N31761 = '';
  N31762 = '';
  N31702 = '';
  noData = false;
  showLoader = true;
  displayFilter = false;

  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  sidebarCollapsed = true;


  companyName: string;
  companyID: number;

  ngOnInit() {
    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.companyService.observeCompany().subscribe((obj: SelectedCompany) => {
      this.companyID = obj.companyID;
      this.companyName = obj.companyName;
    });
  }

  backToCompanies() {
    this.router.navigate(['companies']);
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

    this.loadCompanyItemsList();
  }

  searchBar() {
    this.rowStart = 1;
    this.loadCompanyItemsList();
  }


  loadCompanyItemsList() {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;

    const model = {
      filter: this.filter,
      userID: this.currentUser.userID,
      specificCompanyID: -1,
      specificItemID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };

    this.companyService.items(model).then(
        (res: CompanyItemsResponse) => {
          if (res.rowCount === 0) {
            this.noData = true;
            this.showLoader = false;
          } else {
            this.noData = false;
            this.dataset = res;
            this.dataList = res.items;
            this.rowCount = res.rowCount;
            this.showLoader = false;
            this.showingRecords = res.items.length;
            this.totalShowing = +this.rowStart + +this.dataset.items.length - 1;
            this.paginateData();
          }
        },
        msg => {
          this.showLoader = false;
          this.notify.errorsmsg(
            'Server Error',
            'Something went wrong while trying to access the server.'
          );
          console.log(JSON.stringify(msg));
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
    this.loadCompanyItemsList();
  }

  updatePagination() {
    if (this.dataset.items.length <= this.totalShowing) {
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

    this.focusItemID = id;

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

  Add() {
    this.openaddModal.nativeElement.click();
  }

  addCompanyItem() {
    const requestModel: AddCompanyItem = {
      userID: this.currentUser.userID,
      companyID: this.companyID,
      spesificitemID: this.focusItemID,
    };

    this.companyService.additem(requestModel).then(
      (res: {outcome: Outcome}) => {
          if (res.outcome.outcome !== 'SUCCESS') {
          this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          } else {
            this.notify.successmsg('SUCCESS', 'Company item successfully added');
            this.loadCompanyItemsList();
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
  }

  editCompanyAddress($event) {
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.openeditModal.nativeElement.click();
  }

  UpdateCompanyItem() {
    const requestModel: UpdateCompanyItem = {
      userID: this.currentUser.userID,
      spesificitemID: this.focusItemID,

    };
    this.companyService.updateitem(requestModel).then(
      (res: {outcome: Outcome}) => {
          if (res.outcome.outcome !== 'SUCCESS') {
            this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          } else {
            this.notify.successmsg('SUCCESS', 'Company item successfully Updated');
            this.closeeditModal.nativeElement.click();
            this.loadCompanyItemsList();
        }
      },
        msg => {
          this.notify.errorsmsg(
          'Server Error', 'Something went wrong while trying to access the server.');
      });
  }

  // onConsultantChange(id: number)   {
  //   this.disableAddressSelect = true;
  //   this.Type = id;
  // }

  // onCapturerChange(id: number)   {
  //   this.disableAddressSelect = true;
  //   this.Type = id;
  // }

}


