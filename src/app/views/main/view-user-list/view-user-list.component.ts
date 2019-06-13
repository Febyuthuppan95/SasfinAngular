import { Component, OnInit, ViewChild } from '@angular/core';
import { UserListResponse } from '../../../models/UserListResponse';
import { UserList } from '../../../models/UserList';
import { Pagination } from '../../../models/Pagination';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { ImageModalComponent } from './../../../components/image-modal/image-modal.component';
import { UserService } from '../../../services/User.Service';
import { User } from './../../../models/User';
import { EditDashboardStyleComponent } from './../../../components/edit-dashboard-style/edit-dashboard-style.component';
import { FloatingButtonComponent } from 'src/app/components/floating-button/floating-button.component.js';
import { ThemeService } from 'src/app/services/Theme.Service.js';

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

  @ViewChild(EditDashboardStyleComponent, { static: true })
  private editSidebar: EditDashboardStyleComponent;

  @ViewChild(FloatingButtonComponent, { static: true })
  private floatingButton: EditDashboardStyleComponent;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme = 'light';

  pages: Pagination[];
  lastPage: Pagination;
  userList: UserList[];
  rowCount: number;

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
  }

  pageChange(rowStart: number, rowEnd: number, activePage: number) {
    this.rowStart = +rowStart;
    this.rowEnd = +rowEnd;
    this.activePage = +activePage;
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

  openEditTile() {
    this.editSidebar.show = true;
  }

  closeEditTile() {
    this.editSidebar.show = false;
  }

}
