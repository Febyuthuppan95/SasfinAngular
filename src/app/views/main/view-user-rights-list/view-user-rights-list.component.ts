import {Component, OnInit, ViewChild} from '@angular/core';
import {ThemeService} from '../../../services/Theme.Service';
import {UserService} from '../../../services/User.Service';
import {NotificationComponent} from '../../../components/notification/notification.component';
import {ImageModalComponent} from '../../../components/image-modal/image-modal.component';
import {environment} from '../../../../environments/environment';
import {User} from '../../../models/HttpResponses/User';
import {Pagination} from '../../../models/Pagination';
import {UserRightService} from '../../../services/UserRight.service';
import {GetUserRightsList} from '../../../models/HttpRequests/GetUserRightsList';
import {UserRightsListResponse} from '../../../models/HttpResponses/UserRightsListResponse';
import {UserRightsList} from '../../../models/HttpResponses/UserRightsList';

@Component({
  selector: 'app-view-user-rights-list',
  templateUrl: './view-user-rights-list.component.html',
  styleUrls: ['./view-user-rights-list.component.scss']
})
export class ViewUserRightsListComponent implements OnInit {

  constructor(
    private userService: UserService,
    private themeService: ThemeService,
    private userRightService: UserRightService
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
    this.orderDirection = 'ASC';
    this.totalShowing = 0;
    this.loadUserRights();
  }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild(ImageModalComponent, { static: true })
  private imageModal: ImageModalComponent;

  defaultProfile =
    `${environment.ImageRoute}/default.jpg`;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme = this.themeService.getTheme();

  pages: Pagination[];
  showingPages: Pagination[];
  lastPage: Pagination;
  userRightsList: UserRightsList[];
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
  orderDirection: string;
  totalShowing: number;
  orderIndicator = 'Surname_ASC';

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

    this.loadUserRights();
  }

  searchBar() {
    this.rowStart = 1;
    this.loadUserRights();
  }

  loadUserRights() {
    this.rowEnd = +this.rowStart + this.rowCountPerPage - 1;
    this.showLoader = true;
    const dRModel: GetUserRightsList = {
      userID: this.currentUser.userID,
      specificRightID: -1, // default
      specificUserID: -1, // default
      rightName: this.rightName,
      filter: this.filter,
      orderBy: this.orderBy,
      orderDirection: this.orderDirection,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd
    };
    this.userRightService
      .getUserRightsList(dRModel).then(
      (res: UserRightsListResponse) => {
        // Process Success
        console.log(res.userRightsList);
        this.userRightsList = res.userRightsList;
        this.rowCount = res.rowCount;
        this.showLoader = false;
        this.showingRecords = res.userRightsList.length;
        this.totalShowing += this.rowStart + this.userRightsList.length - 1;
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
    this.loadUserRights();
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
