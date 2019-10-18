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
import { validateHorizontalPosition } from '@angular/cdk/overlay';

@Component({
  selector: 'app-view-company-items-list',
  templateUrl: './view-company-items-list.component.html',
  styleUrls: ['./view-company-items-list.component.scss']
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
    this.itemsrowStart = 1;
    this.rowCountPerPage = 15;
    this.itemsrowCountPerPage = 5;
    this.activePage = +1;
    this.itemsactivePage = +1;
    this.prevPageState = true;
    this.itemsprevPageState = true;
    this.nextPageState = false;
    this.itemsnextPageState = false;
    this.prevPage = +this.activePage - 1;
    this.itemsprevPage = +this.itemsactivePage - 1;
    this.nextPage = +this.activePage + 1;
    this.itemsnextPage = +this.itemsactivePage + 1;
    this.filter = '';
    this.itemsfilter = '';
    this.orderBy = 'Name';
    this.orderDirection = 'ASC';
    this.totalShowing = 0;
    this.itemstotalShowing = 0;
  }

  @ViewChild('openeditModal', {static: true})
  openeditModal: ElementRef;

  @ViewChild('closeeditModal', {static: true})
  closeeditModal: ElementRef;

  @ViewChild('openaddModal', {static: true})
  openaddModal: ElementRef;

  @ViewChild('closeaddModal', {static: true})
  closeaddModal: ElementRef;

  @ViewChild('openviewModal', {static: true})
  openviewModal: ElementRef;

  @ViewChild('closeviewModal', {static: true})
  closeviewModal: ElementRef;

  @ViewChild(ContextMenuComponent, {static: true } )
  private contextmenu: ContextMenuComponent;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;

  itemsdraft: Items[] = [];
  items: Items[] = [];
  pages: Pagination[];
  itemspages: Pagination[];
  showingPages: Pagination[];
  itemsshowingPages: Pagination[];
  dataset: CompanyItemsResponse;
  itemsdataset: ItemsListResponse;
  dataList: Item[] = [];
  rowCount: number;
  itemsrowCount: number;
  nextPage: number;
  itemsnextPage: number;
  nextPageState: boolean;
  itemsnextPageState: boolean;
  prevPage: number;
  itemsprevPage: number;
  prevPageState: boolean;
  itemsprevPageState: boolean;
  rowStart: number;
  itemsrowStart: number;
  rowEnd: number;
  itemsrowEnd: number;
  filter: string;
  orderBy: string;
  orderDirection: string;
  totalShowing: number;
  itemstotalShowing: number;
  orderIndicator = 'Name_ASC';
  rowCountPerPage: number;
  itemsrowCountPerPage: number;
  showingRecords: number;
  itemsshowingRecords: number;
  activePage: number;
  itemsactivePage: number;
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
  noitemData = false;
  showLoader = true;
  displayFilter = false;
  itemsfilter = '';

  ItemName = '';
  ItemDescription = '';
  ItemType = '';
  ItemPrice = '';
  ItemDate = '';
  FreeComp = false;

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

  itemspaginateData() {
    let itemsrowStart = 1;
    let itemsrowEnd = +this.itemsrowCountPerPage;
    const pageCount = +this.itemsrowCount / +this.itemsrowCountPerPage;
    this.itemspages = Array<Pagination>();

    for (let i = 0; i < pageCount; i++) {
      const item = new Pagination();
      item.page = i + 1;
      item.rowStart = +itemsrowStart;
      item.rowEnd = +itemsrowEnd;
      this.itemspages[i] = item;
      itemsrowStart = +itemsrowEnd + 1;
      itemsrowEnd += +this.itemsrowCountPerPage;
    }

    this.updateitemsPagination();
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

  itemspageChange(itemspageNumber: number) {
    const itemspage = this.itemspages[+itemspageNumber - 1];
    this.itemsrowStart = itemspage.rowStart;
    this.itemsrowEnd = itemspage.rowEnd;
    this.itemsactivePage = +itemspageNumber;
    this.itemsprevPage = +this.itemsactivePage - 1;
    this.itemsnextPage = +this.itemsactivePage + 1;

    if (this.itemsprevPage < 1) {
      this.itemsprevPageState = true;
    } else {
      this.itemsprevPageState = false;
    }

    let itemspagenumber = +this.itemsrowCount / +this.itemsrowCountPerPage;
    const mod = +this.itemsrowCount % +this.itemsrowCountPerPage;

    if (mod > 0) {
      itemspagenumber++;
    }

    if (this.itemsnextPage > itemspagenumber) {
      this.itemsnextPageState = true;
    } else {
      this.itemsnextPageState = false;
    }

    this.updateitemsPagination();

    this.loadItems(false);
  }

  searchBar() {
    this.rowStart = 1;
    this.loadCompanyItemsList(false);
  }

  searchitemsBar() {
    this.itemsrowStart = 1;
    this.loadItems(false);
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
    console.log(model);
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
    this.itemsrowEnd = +this.itemsrowStart + +this.itemsrowCountPerPage - 1;
    const model: GetItemList = {
      userID: this.currentUser.userID,
      filter: this.itemsfilter,
      specificItemID: -1,
      rowStart: this.itemsrowStart,
      rowEnd: this.itemsrowEnd,
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
          this.noitemData = false;
          this.itemsdataset = res;
          this.itemsdraft = res.itemsLists;
          this.itemsrowCount = res.rowCount;
          this.itemsshowingRecords = res.itemsLists.length;
          this.itemstotalShowing = +this.itemsrowStart + +this.itemsdataset.itemsLists.length - 1;
          this.itemspaginateData();
        } else {
          this.noitemData = true;
        }
        this.Finalitemlist();
      },
      msg => {
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

  updateitemsPagination() {
    if (this.itemsdataset.itemsLists.length <= this.itemstotalShowing) {
      this.itemsprevPageState = false;
      this.itemsnextPageState = false;
    } else {
      this.itemsshowingPages = Array<Pagination>();
      this.itemsshowingPages[0] = this.itemspages[this.itemsactivePage - 1];
      const itemspagenumber = +this.itemsrowCount / +this.itemsrowCountPerPage;

      if (this.itemsactivePage < itemspagenumber) {
        this.itemsshowingPages[1] = this.itemspages[+this.itemsactivePage];

        if (this.itemsshowingPages[1] === undefined) {
          const itemspage = new Pagination();
          itemspage.page = 1;
          itemspage.rowStart = 1;
          itemspage.rowEnd = this.itemsrowEnd;
          this.itemsshowingPages[1] = itemspage;
        }
      }

      if (+this.itemsactivePage + 1 <= itemspagenumber) {
        this.itemsshowingPages[2] = this.itemspages[+this.itemsactivePage + 1];
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

  Finalitemlist() {
    this.items.splice(0, this.items.length);
    let count = 0;
    this.itemsdraft.forEach((item, index) => {
      if (item.itemID !== this.focusItemID) {
        count++;
        this.items.push(item);
      }
    });

    this.itemsrowCount = count;
    this.itemsshowingRecords = count;
  }


  popOff() {
    this.contextMenu = false;
    this.selectedRow = -1;
  }
  setClickedRow(index) {
    this.selectedRow = index;
  }

  OpenGroup($event) {

    this.Finalitemlist();
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.openaddModal.nativeElement.click();
  }

  addtoGroup(groupid, itemid) {
    const requestModel: AddItemGroup = {
      userID: this.currentUser.userID,
      itemID: this.focusItemID,
      addedItemID: itemid
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
