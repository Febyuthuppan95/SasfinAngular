import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { Router } from '@angular/router';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { User } from 'src/app/models/HttpResponses/User';
import { Pagination } from 'src/app/models/Pagination';
import { CompanyItemsResponse, Item } from 'src/app/models/HttpResponses/CompanyItemsResponse';
import { SelectedRecord } from 'src/app/models/Table';
import { ContextMenuComponent } from 'src/app/components/menus/context-menu/context-menu.component';
import { ItemsListResponse, Items } from 'src/app/models/HttpResponses/ItemsListResponse';
import { GetItemList } from 'src/app/models/HttpRequests/GetItemList';
import { AddItemGroup } from 'src/app/models/HttpRequests/AddItemGroup';
import { ItemGroupReponse } from 'src/app/models/HttpResponses/ItemGroupReponse';

@Component({
  selector: 'app-context-company-items-list',
  templateUrl: './context-company-items-list.component.html',
  styleUrls: ['./context-company-items-list.component.scss']
})
export class ContextCompanyItemsListComponent implements OnInit {

  specificUser: any;


  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private themeService: ThemeService,
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

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;

  items: Items[] = [];
  pages: Pagination[];
  showingPages: Pagination[];
  dataset: CompanyItemsResponse;
  dataList: Item[] = [];
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
  focusItemGroupID: number;
  focusItemID: number;
  focusItemName: string;
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
    this.loadCompanyItemsList(true);

    this.loadItems(false);
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

    this.loadCompanyItemsList(false);
  }

  searchBar() {
    this.rowStart = 1;
    this.loadCompanyItemsList(false);
  }


  loadCompanyItemsList(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;

    const model = {
      filter: this.filter,
      userID: this.currentUser.userID,
      specificCompanyID: this.companyID,
      specificItemID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
    this.companyService.items(model).then(
        (res: CompanyItemsResponse) => {

          if (res.outcome.outcome === 'FAILURE') {
            this.notify.errorsmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage
            );
          } else {
            if (displayGrowl) {
              this.notify.successmsg(
                res.outcome.outcome,
                res.outcome.outcomeMessage);
              }
          }

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
            console.log(this.dataList);
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

  loadItems(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model: GetItemList = {
      userID: this.currentUser.userID,
      filter: this.filter,
      specificItemID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection

    };
    this.companyService.getItemList(model).then(
      (res: ItemsListResponse) => {
        if (res.outcome.outcome === 'FAILURE') {
          if (displayGrowl) {
          this.notify.errorsmsg(
            res.outcome.outcome,
            res.outcome.outcomeMessage
          );
          }
        } else {
          if (displayGrowl) {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage);
          }
        }

        if (res.rowCount !== 0) {
          this.items = res.itemsLists;
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
    this.loadCompanyItemsList(false);
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

  popClick(event, groupid, itemid, itemname) {
    if (this.sidebarCollapsed) {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    } else {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    }

    this.focusItemGroupID = groupid;
    this.focusItemID = itemid;
    this.focusItemName = itemname;

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

  OpenGroup($event) {
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.openaddModal.nativeElement.click();
  }

  addtoGroup(groupid, itemid) {
    const requestModel: AddItemGroup = {
      userID: this.currentUser.userID,
      specificItemID: this.focusItemID,
      specificSelectedItemID: itemid,
      specificGroupID: this.focusItemGroupID,
      specificSelectedGroupID: groupid
    };
    this.companyService
    .addtoGroup(requestModel).then(
      (res: ItemGroupReponse) => {
        if (res.outcome.outcome === 'FAILURE') {
          this.notify.errorsmsg(
            res.outcome.outcome,
            res.outcome.outcomeMessage
          );
        } else {
          this.notify.successmsg(
            res.outcome.outcome,
            res.outcome.outcomeMessage
          );
          this.closeaddModal.nativeElement.click();
          this.loadCompanyItemsList(false);
        }
      },
      msg => {
        this.notify.errorsmsg(
          'Server Error',
          'Something went wrong while trying to access the server.'
        );
      }
    );
  }
}
