import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { Router } from '@angular/router';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { User } from 'src/app/models/HttpResponses/User';
import { Pagination } from 'src/app/models/Pagination';
import { CompanyItemsResponse, Item } from 'src/app/models/HttpResponses/CompanyItemsResponse';
import { SelectedRecord, TableHeading, TableHeader, Order } from 'src/app/models/Table';
import { ContextMenuComponent } from 'src/app/components/menus/context-menu/context-menu.component';
import { ItemsListResponse, Items } from 'src/app/models/HttpResponses/ItemsListResponse';
import { GetItemList } from 'src/app/models/HttpRequests/GetItemList';
import { AddItemGroup } from 'src/app/models/HttpRequests/AddItemGroup';
import { ItemGroupReponse } from 'src/app/models/HttpResponses/ItemGroupReponse';
import { ItemParentAddReponse } from 'src/app/models/HttpResponses/ItemParentAddReponse';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {Outcome} from '../../../models/HttpResponses/Outcome';
import {DocumentService} from '../../../services/Document.Service';
import { PaginationChange } from 'src/app/components/pagination/pagination.component';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-company-items-list',
  templateUrl: './view-company-items-list.component.html',
  styleUrls: ['./view-company-items-list.component.scss']
})
export class ContextCompanyItemsListComponent implements OnInit, OnDestroy {

  specificUser: any;


  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private themeService: ThemeService,
    private router: Router,
    private api: ApiService,
    private IDocumentService: DocumentService,
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

  @ViewChild('openAddModal', {static: true})
  openAddModal: ElementRef;

  @ViewChild('closeAddModal', {static: true})
  closeAddModal: ElementRef;

  @ViewChild('itemFile', { static: false })
  bomFile: ElementRef;

  @ViewChild('openaddGroupModal', {static: true})
  openaddGroupModal: ElementRef;

  @ViewChild('closeaddGroupModal', {static: true})
  closeaddGroupModal: ElementRef;

  @ViewChild('openaddParentModal', {static: true})
  openaddParentModal: ElementRef;

  @ViewChild('closeaddParentModal', {static: true})
  closeaddParentModal: ElementRef;

  @ViewChild(ContextMenuComponent, {static: true } )
  private contextmenu: ContextMenuComponent;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;

  itemsdraft: Items[] = [];
  items: any[] = [];
  itemparents: Items[] = [];
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
  focusItemParentID: number;
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
  private unsubscribe$ = new Subject<void>();

  companyName: string;
  companyID: number;

  isParent: boolean;

  ItemFile: File;
  filePreview: string;

  tableHeader: TableHeader = {
    title: 'Items',
    addButton: { enable: false, },
    backButton: { enable: true },
    filters: {
      search: true,
      selectRowCount: true,
    }
  };

  tableHeadings: TableHeading[] = [
    { title: '', propertyName: 'rowNum',  order: { enable: false } },
    { title: 'Item', propertyName: 'item', order: { enable: true, tag: 'Item' }, },
    { title: 'Description', propertyName: 'description', order: { enable: true, tag: 'Description' }, },
    { title: 'Tariff', propertyName: 'tariff', order: { enable: true, tag: 'Tariff' }, },
    { title: 'Type', propertyName: 'type', order: { enable: true, tag: 'Type' }, },
    { title: 'Vulnerable', propertyName: 'vulnerable', order: { enable: true, tag: 'Vulnerable' }, },
  ];

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.companyService.observeCompany()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((obj: SelectedCompany) => {
      this.companyID = obj.companyID;
      this.companyName = obj.companyName;
      this.tableHeader.title = `${obj.companyName} - Items`;
    });

    this.loadCompanyItemsList(true);

  }

  onFileChange(files: FileList) {
    this.ItemFile = files.item(0);
    this.filePreview = this.ItemFile.name;
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

  recordsPerPageChange($event: number) {
    this.rowCountPerPage = $event;
    this.loadCompanyItemsList(false);
  }

  pageChange(obj: PaginationChange) {
    this.rowStart = obj.rowStart;
    this.rowEnd = obj.rowEnd;

    this.loadCompanyItemsList();
  }

  orderChange($event: Order) {
    // console.log($event);
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
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

    this.loadItems(false, this.isParent);
  }

  searchBar(event) {
    this.filter = event;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadCompanyItemsList();
  }

  searchitemsBar() {
    console.log(this.itemsfilter);
    this.itemsrowStart = 1;
    this.loadItems(false, this.isParent);
  }

  loadCompanyItemsList(displayGrowl?: boolean) {
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
          // console.log('res' + JSON.stringify(res));
          if (res.outcome.outcome === 'SUCCESS') {
              this.notify.successmsg(
                res.outcome.outcome,
                res.outcome.outcomeMessage);
          }

          this.dataList = res.items;

          if (res.rowCount === 0) {
            this.noData = true;
            this.showLoader = false;
          } else {
            this.noData = false;
            this.dataset = res;
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

  loadItems(displayGrowl: boolean, isParent: boolean) {
    this.itemsrowEnd = +this.itemsrowStart + +this.itemsrowCountPerPage - 1;
    //Changed to use a generic API endpoint instead of the one it did use
    const model = {
      request :{
        userID: this.currentUser.userID,
        filter: this.itemsfilter,
        itemsID: this.focusItemID,
        rowStart: this.itemsrowStart,
        rowEnd: this.itemsrowEnd,
        orderBy: this.orderBy,
        orderByDirection: this.orderDirection,
      },
      procedure: 'ItemsList'
    };
    //this.companyService.getItemjoinList(model).then(
    this.api.post(`${environment.ApiEndpoint}/capture/list`,model).then(
      (res: any) => {
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
        console.log(res);
        if (res.data) {
          this.noitemData = false;
          this.itemsdataset = res;
          this.items = res.data;
          console.log(this.items);
          this.itemsrowCount = res.rowCount;
          this.itemsshowingRecords = res.itemsLists.length;
          this.itemstotalShowing = +this.itemsrowStart + +this.itemsdataset.itemsLists.length - 1;
          // console.log(this.itemsdataset);

          this.itemspaginateData();
        } else {
          this.noitemData = true;
        }
        // this.Finalitemlist();
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

  selectedRecord($event: SelectedRecord) {
    // console.log($event.record);
    this.popClick($event.event, $event.record.groupID, $event.record.itemID, $event.record.itemname, $event.record.itemparentid);
  }

  popClick(event, groupid, itemid, itemname, itemparentid) {
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;
    this.focusItemGroupID = groupid;
    this.focusItemID = itemid;
    this.focusItemName = itemname;
    this.focusItemParentID = itemparentid;

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
    let countitems = 0;


    this.itemsdraft.forEach((item, index) => {
      if (item.itemID !== this.focusItemID) {
        countitems++;
        this.items.push(item);
      }
    });

    this.itemsrowCount = countitems;
    this.itemsshowingRecords = countitems;
  }

  Finalitemparentslist() {
    this.itemparents.splice(0, this.itemparents.length);
    let countitemparent = 0;

    this.items.forEach((item, index) => {
      if (item.itemID !== this.focusItemParentID) {
        countitemparent++;
        this.itemparents.push(item);
      }
    });

    this.itemsrowCount = countitemparent;
    this.itemsshowingRecords = countitemparent;
  }


  popOff() {
    this.contextMenu = false;
    this.selectedRow = -1;
  }
  setClickedRow(index) {
    this.selectedRow = index;
  }

  OpenGroup($event) {
    this.itemsrowCount = 0;
    this.itemsrowStart = 1;
    this.itemsrowEnd = 5;
    this.isParent = false;
    this.loadItems(false, this.isParent);
    // this.Finalitemlist();
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.openaddGroupModal.nativeElement.click();
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
          this.closeaddGroupModal.nativeElement.click();
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

  OpenParent($event) {
    this.itemsrowCount = 0;
    this.itemsrowStart = 1;
    this.itemsrowEnd = 5;
    // this.Finalitemlist();
    // this.Finalitemparentslist();
    this.isParent = true;
    this.loadItems(false, this.isParent);
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.openaddParentModal.nativeElement.click();
  }

  addtoParent(itemid) {
    const requestModel = {
      userID: this.currentUser.userID,
      itemID: this.focusItemID,
      parentID: itemid
    };
    this.companyService
    .AddItemParent(requestModel).then(
      (res: ItemParentAddReponse) => {
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
          this.closeaddParentModal.nativeElement.click();
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // addButton(): void {
  //   this.openAddModal.nativeElement.click();
  // }


  // saveItemUpload() {
  //   // Save
  //   console.log('save');
  //   const model = {
  //     requestParams: {
  //       userID: this.currentUser.userID,
  //       BOMID: -1,
  //       companyID: this.companyID
  //     },
  //     requestProcedure: `BOMItemAdd`
  //   };
  //   console.log(this.ItemFile, model, 'boms/items/upload');

  //   this.IDocumentService.upload(this.ItemFile, model, 'boms/items/upload').then(
  //     (res: Outcome) => {
  //       // console.log('BOMUploadRes');
  //       console.log('Response: ' + res);
  //       if (res.outcome === 'SUCCESS') {
  //         this.notify.successmsg(
  //           res.outcome,
  //           res.outcomeMessage);
  //         this.loadCompanyItemsList(false);
  //       } else {
  //         this.notify.errorsmsg(
  //           res.outcome,
  //           res.outcomeMessage
  //         );
  //       }
  //     },
  //     (msg) => {
  //       // nothing yet
  //       console.log('Error: ' + msg);
  //       this.showLoader = false;
  //       this.notify.errorsmsg(
  //         'Server Error',
  //         'Something went wrong while trying to access the server.'
  //       );
  //     }
  //   );
  // }

}
