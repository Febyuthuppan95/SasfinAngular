import { DesignationService } from '../../../services/Designation.service';
import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { DesignationListResponse } from '../../../models/HttpResponses/DesignationListResponse';
import { DesignationList } from '../../../models/HttpResponses/DesignationList';
import { Pagination } from '../../../models/Pagination';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { UserService } from '../../../services/user.Service';
import { User } from '../../../models/HttpResponses/User';
import { ThemeService } from 'src/app/services/theme.Service.js';
import {NgbPopoverConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-designations-list',
  templateUrl: './view-designations-list.component.html',
  styleUrls: ['./view-designations-list.component.scss']
})
export class ViewDesignationsListComponent implements OnInit {
  constructor(
    private userService: UserService,
    private themeService: ThemeService,
    private designationService: DesignationService,
    private popConfig: NgbPopoverConfig
  ) {
    this.rowStart = 1;
    this.rowCountPerPage = 15;
    this.rightName = 'Designations';
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
  }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild('popCont', {static: false})
  private popOver: ElementRef;

  defaultProfile =
    'http://197.189.218.50:7777/public/images/profile/default.png';
  
  popOverX: number;
  popOverY: number;

  currentUser: User = this.userService.getCurrentUser();
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

  showLoader = true;
  displayFilter = false;

  ngOnInit() {
    const themeObserver = this.themeService.getCurrentTheme();
    themeObserver.subscribe((themeData: string) => {
      this.currentTheme = themeData;
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

    this.loadDesignations();
  }

  searchBar() {
    this.rowStart = 1;
    this.loadDesignations();
  }

  loadDesignations() {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;

    this.designationService
      .getDesignationList(
        this.filter,
        this.currentUser.userID,
        -1,
        this.rightName,
        this.rowStart,
        this.rowEnd,
        this.orderBy,
        this.orderByDirection
      )
      .then(
        (res: DesignationListResponse) => {
          this.designationList = res.designationList;
          this.rowCount = res.rowCount;
          this.showLoader = false;
          this.showingRecords = res.designationList.length;
          this.totalShowing = +this.rowStart + this.designationList.length - 1;
          this.paginateData();
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
    this.popOverX = event.x;
    this.popOverY = event.y;
    this.popConfig.placement = 'auto';
    this.focusDesgination = id;
    this.focusDesName = name;
    console.log(this.focusDesgination);
  }
  popupMenu() {
    // alert(document.getElementById(document.getSelection));
    document.getElementById('myPopup').style.top = document.getElementById('cursorX').nodeValue;
    document.getElementById('myPopup').style.left = document.getElementById('cursorY').nodeValue;
    document.getElementById('myPopup').hidden = false;
  }

}
