import { Component, OnInit, ViewChild } from '@angular/core';
import { DesignationService } from 'src/app/services/Designation.service';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { Pagination } from '../../../models/Pagination';
import { DesignationRightsList } from '../../../models/HttpResponses/DesignationRightsList';
import { GetDesignationRightsList } from 'src/app/models/HttpRequests/GetDesignationRightsList';
import { DesignationRightsListResponse } from 'src/app/models/HttpResponses/DesignationRightsListResponse';
import { User } from 'src/app/models/HttpResponses/User';
import { NotificationComponent } from 'src/app/components/notification/notification.component';


@Component({
  selector: 'app-view-designations-rights-list',
  templateUrl: './view-designations-rights-list.component.html',
  styleUrls: ['./view-designations-rights-list.component.scss']
})
export class ViewDesignationsRightsListComponent implements OnInit {

  /* Initializing Variables */
  currentUser: User = this.userService.getCurrentUser();
  currentTheme = this.themeService.getTheme();

  pages: Pagination[];
  showingPages: Pagination[];
  lastPage: Pagination;
  designationRightsList: DesignationRightsList[];
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
  /*Init*/
  constructor(
    private designationsService: DesignationService,
    private userService: UserService,
    private themeService: ThemeService

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
      this.orderBy = 'Name';
      this.orderByDirection = 'ASC';
      this.totalShowing = 0;
      this.loadDesignationRights();
    }

    @ViewChild(NotificationComponent, {static: true })
    private notify: NotificationComponent;

  ngOnInit() {
    const themeObservable = this.themeService.getCurrentTheme();
    themeObservable.subscribe((themeData: string) => {
      this.currentTheme = themeData;
    });
  }
  /**
   * Load Designation Rights
   * Returns DesignationRightsListResponse
   */
  loadDesignationRights() {
    this.rowEnd = +this.rowStart + this.rowCountPerPage - 1;
    this.showLoader = true;
    const dRModel: GetDesignationRightsList = {
      userID: this.currentUser.userID,
      specificRightID: -1, // default
      specifcDesignationID: -1, // default
      rightName: this.rightName,
      filter: this.filter,
      orderBy: this.orderBy,
      orderDirection: this.orderByDirection,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd
    };
    this.designationsService
    .getDesignationRightsList(dRModel).then(
      (res: DesignationRightsListResponse) => {
        // Process Success
        this.designationRightsList = res.designationRightsList;
        this.rowCount = res.rowCount;
        this.showLoader = false;
        this.showingRecords = res.designationRightsList.length;
        this.totalShowing += this.rowStart + this.designationRightsList.length - 1;
        console.log(res);
        this.paginateData();
      },
      msg => {
        // Process Failure
        this.showLoader = false;
        this.notify.errorsmsg(
          'Server Error',
          'Something went wrong while trying to access the server.'
        );

      }
    );
  }

  pageChange(pageNumber: number) {
    const page = this.pages[+ pageNumber - 1];
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

    this.loadDesignationRights();
  }
  searchBar() {
    this.rowStart = 1;
    this.loadDesignationRights();
  }
  paginateData() {
    let rowStart = 1;
    let rowEnd = +this.rowCountPerPage;
    const pageCount = +this.rowCount / +this.rowCountPerPage;
    console.log(this.rowCountPerPage);
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
    console.log(this.pages);
    this.updatePagination();
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
    this.loadDesignationRights();
  }

  updatePagination() {
    this.showingPages = Array<Pagination>();
    this.showingPages[0] = this.pages[this.activePage - 1];
    const pagenumber = +this.rowCount / +this.rowCountPerPage;
    console.log(this.showingPages);

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
