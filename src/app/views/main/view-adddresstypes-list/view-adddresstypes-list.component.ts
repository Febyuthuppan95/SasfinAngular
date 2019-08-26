import { DesignationService } from '../../../services/Designation.service';
import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { DesignationListResponse } from '../../../models/HttpResponses/DesignationListResponse';
import { DesignationList } from '../../../models/HttpResponses/DesignationList';
import { Pagination } from '../../../models/Pagination';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { UserService } from '../../../services/user.Service';
import { User } from '../../../models/HttpResponses/User';
import { ThemeService } from 'src/app/services/theme.Service.js';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { ContextMenuComponent } from 'src/app/components/context-menu/context-menu.component';
import { ContextMenu } from 'src/app/models/StateModels/ContextMenu';
import { Subscription } from 'rxjs';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { MenuService } from 'src/app/services/Menu.Service';
import { GetAddressTypesList } from 'src/app/models/HttpRequests/GetAddressTypesList';

@Component({
  selector: 'app-view-adddresstypes-list',
  templateUrl: './view-adddresstypes-list.component.html',
  styleUrls: ['./view-adddresstypes-list.component.scss']
})
export class ViewAdddresstypesListComponent implements OnInit {
  constructor(
    private IUserService: UserService,
    private IThemeService: ThemeService,
    private IDesignationService: DesignationService,
    private IMenuService: MenuService
  ) {
    this.rowStart = 1;
    this.rowCountPerPage = 15;
    this.rightName = 'Designation';
    this.activePage = +1;
    this.prevPageState = true;
    this.nextPageState = false;
    this.prevPage = +this.activePage - 1;
    this.nextPage = +this.activePage + 1;
    this.filter = '';
    this.orderBy = '';
    this.orderByDirection = 'ASC';
    this.totalShowing = 0;
    this.loadDesignations();
    this.subscription = this.IMenuService.subSidebarEmit$.subscribe(result => {
      // console.log(result);
      this.sidebarCollapsed = result;
    });
  }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  // @ViewChild(ContextMenuComponent, {static: true } )
  // private contextmenu: ContextMenuComponent;

  @ViewChild(SidebarComponent, {static: true })
  private sidebar: SidebarComponent;

  defaultProfile =
    'http://197.189.218.50:7777/public/images/profile/default.png';
  // popOverX: number;
  // popOverY: number;
  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  sidebarCollapsed = true;

  currentUser: User = this.IUserService.getCurrentUser();
  currentTheme = 'light';
  focusDesgination: string;
  focusDesName: string;

  pages: Pagination[];
  showingPages: Pagination[];
  lastPage: Pagination;
  designationList: DesignationList[];
  rowCount: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;

  rowStart: number;
  rowEnd: number;
  rowCountPerPage: number;
  showingRecords: number;
  filter: string;
  rightName: string;
  activePage: number;
  orderBy: string;
  orderByDirection: string;
  totalShowing: number;
  orderIndicator = 'Name_ASC';
  noData = false;

  showLoader = true;
  displayFilter = false;
  selectedRow = -1;

  subscription: Subscription;

  ngOnInit() {
    this.IThemeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });
  }
  paginateData() {
    let rowStart = this.rowStart;
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

    this.loadDesignations();
  }

  searchBar() {
    this.rowStart = 1;
    this.loadDesignations();
  }

  loadDesignations() {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    const userID = +this.currentUser.userID;
    this.showLoader = true;
    const model: GetAddressTypesList = {
      rowEnd: this.rowEnd,
      rowStart: this.rowStart,
      rightName: this.rightName,
      filter: this.filter,
      userID: this.currentUser.userID,
      orderBy: this.orderBy,
      orderByDirection: this.orderByDirection,
      specificAddressTypeID: -1
    };
    this.IDesignationService
      .getDesignationList(model)
      .then(
        (res: DesignationListResponse) => {
          if (res.rowCount === 0) {
            this.rowStart = 0;
            this.showLoader = false;
            this.noData = true;
            this.rowCount = 0;
            this.showingRecords = 1;
            this.totalShowing = 0;
          } else {
            this.noData = false;
            this.designationList = res.designationList;
            this.rowCount = res.rowCount;
            this.showLoader = false;
            this.showingRecords = res.designationList.length;
            this.totalShowing = +this.rowStart + this.designationList.length - 1;
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
      if (this.orderByDirection === 'ASC') {
        this.orderByDirection = 'DESC';
      } else {
        this.orderByDirection = 'ASC';
      }
    } else {
      this.orderByDirection = 'ASC';
    }

    this.orderBy = orderBy;
    this.orderIndicator = `${this.orderBy}_${this.orderByDirection}`;
    this.loadDesignations();
  }

  updatePagination() {
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

  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  popClick(event, id, name) {
    // this.sidebarCollapsed = this.cookieService.get('sidebar') === 'false' ? false : true;
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;

    this.focusDesgination = id;
    this.focusDesName = name;
    // Will only toggle on if off
    if (!this.contextMenu) {
      this.IThemeService.toggleContextMenu(true); // Set true
      this.contextMenu = true;
      // Show menu
    } else {
      this.IThemeService.toggleContextMenu(false);
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

}

