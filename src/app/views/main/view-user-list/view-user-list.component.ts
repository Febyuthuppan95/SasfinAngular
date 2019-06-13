import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { UserListResponse } from '../../../models/HttpResponses/UserListResponse';
import { UserList } from '../../../models/HttpResponses/UserList';
import { Pagination } from '../../../models/Pagination';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { ImageModalComponent } from './../../../components/image-modal/image-modal.component';
import { UserService } from '../../../services/user.Service';
import { User } from '../../../models/HttpResponses/User';
import { ThemeService } from 'src/app/services/theme.Service.js';

@Component({
  selector: 'app-view-user-list',
  templateUrl: './view-user-list.component.html',
  styleUrls: ['./view-user-list.component.scss']
})
export class ViewUserListComponent implements OnInit {

  constructor(private userService: UserService, private themeService: ThemeService) {
    this.rowStart = 1;
    this.rowCountPerPage = 15;
    this.rightName = 'Users';
    this.activePage = +1;
    this.prevPageState = true;
    this.nextPageState = false;
    this.prevPage = +this.activePage - 1;
    this.nextPage = +this.activePage + 1;
    this.filter = '';
    this.orderBy = 'Surname';
    this.orderDirection = 'ASC';
    this.totalShowing = 0;
    this.loadUsers();
  }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild(ImageModalComponent, { static: true })
  private imageModal: ImageModalComponent;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme = this.themeService.getTheme();

  pages: Pagination[];
  showingPages: Pagination[];
  lastPage: Pagination;
  userList: UserList[];
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

  ngOnInit() {
    const studentsObservable = this.themeService.getCurrentTheme();
    studentsObservable.subscribe((themeData: string) => {
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

    this.loadUsers();
  }

  loadUsers() {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;

    this.userService.getUserList(this.filter, 3, -1, this.rightName, this.rowStart, this.rowEnd, this.orderBy, this.orderDirection).then(
      (res: UserListResponse) => {
        this.userList = res.userList;
        this.rowCount = res.rowCount;
        this.showLoader = false;
        this.showingRecords = res.userList.length;
        this.totalShowing = this.userList.length;
        this.paginateData();
      },
      (msg) => {
        this.showLoader = false;
        this.notify.errorsmsg('Server Error', 'Something went wrong while trying to access the server.');
      },
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
    this.loadUsers();
  }

  inspectUserImage(src: string) {
    this.imageModal.open(src);
  }

  updatePagination() {
    this.showingPages = Array<Pagination>();
    this.showingPages[0] = this.pages[this.activePage - 1];
    const pagenumber = +this.rowCount / +this.rowCountPerPage;

    if ((this.activePage) < pagenumber) {
      this.showingPages[1] = this.pages[+this.activePage];
    }

    if ((+this.activePage + 1) <= pagenumber) {
      this.showingPages[2] = this.pages[+this.activePage + 1];
    }
  }

}
