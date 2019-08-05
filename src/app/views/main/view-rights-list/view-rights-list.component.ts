import { RightService } from '../../../services/Right.Service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RightListResponse } from '../../../models/HttpResponses/RightListResponse';
import { RightList } from '../../../models/HttpResponses/RightList';
import { Pagination } from '../../../models/Pagination';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { UserService } from '../../../services/user.Service';
import { User } from '../../../models/HttpResponses/User';
import { ThemeService } from 'src/app/services/theme.Service.js';

@Component({
  selector: 'app-view-rights-list',
  templateUrl: './view-rights-list.component.html',
  styleUrls: ['./view-rights-list.component.scss']
})
export class ViewRightsListComponent implements OnInit {
  constructor(
    private themeService: ThemeService,
    private userService: UserService,
    private rightService: RightService
  ) {
    this.rowStart = 1;
    this.rowCountPerPage = 15;
    this.rightName = 'Rights';
    this.activePage = +1;
    this.prevPageState = true;
    this.nextPageState = false;
    this.prevPage = +this.activePage - 1;
    this.nextPage = +this.activePage + 1;
    this.filter = '';
    this.orderBy = '';
    this.orderByDirection = 'ASC';
    this.totalShowing = 0;

    this.loadRights();
  }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme = this.themeService.getTheme();

  pages: Pagination[];
  showingPages: Pagination[];
  lastPage: Pagination;
  rightList: RightList[];
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
  ngOnInit() {
    const themeObservable = this.themeService.getCurrentTheme();
    themeObservable.subscribe((themeData: string) => {
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

    this.loadRights();
  }

  searchBar() {
    this.rowStart = 1;
    this.loadRights();
  }

  loadRights() {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;

    this.rightService
      .getRightList(
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
        (res: RightListResponse) => {
          if (res.rowCount === 0) {
            this.noData = true;
            this.showLoader = false;
          } else {
            this.noData = false;
            this.rightList = res.rightList;
            this.rowCount = res.rowCount;
            this.showLoader = false;
            this.showingRecords = res.rightList.length;
            this.totalShowing = +this.rowStart + +this.rightList.length - 1;
            this.paginateData();
          }
        },
        msg => {
          this.showLoader = false;
          // this.notify.errorsmsg(
          //   'Server Error',
          //   'Something went wrong while trying to access the server.'
          // );
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
    this.loadRights();
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
}
