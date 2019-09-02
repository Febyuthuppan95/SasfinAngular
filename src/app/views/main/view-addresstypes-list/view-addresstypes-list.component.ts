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
import { AddressTypesService } from 'src/app/services/AddressTypes.service';
import { AddressTypesListResponse } from 'src/app/models/HttpResponses/AddressTypesListResponse';
import { AddressTypesList } from 'src/app/models/HttpResponses/AddressTypesList';

@Component({
  selector: 'app-view-addresstypes-list',
  templateUrl: './view-addresstypes-list.component.html',
  styleUrls: ['./view-addresstypes-list.component.scss']
})
export class ViewAddresstypesListComponent implements OnInit {
  openModal: any;
  themeService: any;
  focusAddTypeName: string;
  focusAddressTypeID: any;
  closeModal: any;
  addressTypeService: any;
  constructor(
    private IUserService: UserService,
    private IThemeService: ThemeService,
    private IAddressTypesService: AddressTypesService,
    private IMenuService: MenuService
  ) {
    this.rowStart = 1;
    this.rowCountPerPage = 15;
    this.rightName = 'AddressTypes';
    this.activePage = +1;
    this.prevPageState = true;
    this.nextPageState = false;
    this.prevPage = +this.activePage - 1;
    this.nextPage = +this.activePage + 1;
    this.filter = '';
    this.orderBy = '';
    this.orderByDirection = 'ASC';
    this.totalShowing = 0;
    this.loadAddressTypes();
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
  addressTypesList: AddressTypesList[];
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

    this.loadAddressTypes();
  }

  searchBar() {
    this.rowStart = 1;
    this.loadAddressTypes();
  }

  loadAddressTypes() {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    const userID = +this.currentUser.userID;
    this.showLoader = true;
    const model: UpdateAddressTypesRequest = {
      rowEnd: this.rowEnd,
      rowStart: this.rowStart,
      rightName: this.rightName,
      filter: this.filter,
      userID: this.currentUser.userID,
      orderBy: this.orderBy,
      orderByDirection: this.orderByDirection,
      specificAddressTypeID: -1
    };
    this.IAddressTypesService
      .getAddressTypesList(model)
      .then(
        (res: AddressTypesListResponse) => {
          if (res.rowCount === 0) {
            this.rowStart = 0;
            this.showLoader = false;
            this.noData = true;
            this.rowCount = 0;
            this.showingRecords = 1;
            this.totalShowing = 0;
          } else {
            this.noData = false;
            this.addressTypesList = res.addressTypesList;
            this.rowCount = res.rowCount;
            this.showLoader = false;
            this.showingRecords = res.addressTypesList.length;
            this.totalShowing = +this.rowStart + this.addressTypesList.length - 1;
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
    this.loadAddressTypes();
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

  editAddressType($event){
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.openModal.nativeElement.click();
    console.log('open modal');
  }

  updateAddress() {
    let errors = 0;

    if (this.focusAddTypeName === '' || this.focusAddTypeName === undefined) {
      errors++;
    }    

    if (errors === 0) {
      const requestModel: UpdateAddressTypesRequest = {
        userID: 3,
        specificAddressTypeID: this.focusAddressTypeID,
        //addressTypeID: this.focusAddressTypeID,
        rightName: 'AddressType',
        name: this.focusAddTypeName,        
        isDeleted: 0,
      };

      this.addressTypeService.update(requestModel).then(
        (res: AddressTypesListResponse) => {
          this.closeModal.nativeElement.click();

          this.addressTypesList.rowStart = 1;
          this.addressTypesList.rowEnd = this.rowCountPerPage;
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);

          this.loadAddressTypes();
        },
        (msg) => {
          this.notify.errorsmsg('Failure', msg.message);
        }
      );
    } else {
      this.notify.toastrwarning('Warning', 'Please enter all fields when updating a help glossary item.');
    }
  }

}

