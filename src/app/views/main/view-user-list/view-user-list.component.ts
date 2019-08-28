//import { DesignationListResponse } from './../../../models/HttpResponses/DesignationListResponse';
import { DesignationService } from './../../../services/Designation.service';
import { UpdateUserRequest } from './../../../models/HttpRequests/UpdateUserRequest';
import { Status } from './../../../models/Enums/Statuses';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/services/Menu.Service';
import { ContextMenuUserComponent } from './../../../components/context-menu-user/context-menu-user.component';
import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { UserListResponse } from '../../../models/HttpResponses/UserListResponse';
import { UserList } from '../../../models/HttpResponses/UserList';
import { Pagination } from '../../../models/Pagination';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { ImageModalComponent } from '../../../components/image-modal/image-modal.component';
import { UserService } from '../../../services/user.Service';
import { User } from '../../../models/HttpResponses/User';
import { ThemeService } from 'src/app/services/theme.Service.js';
import { environment } from '../../../../environments/environment';
import { ImageModalOptions } from 'src/app/models/ImageModalOptions';
import { GetUserList } from 'src/app/models/HttpRequests/GetUserList';
import { Location } from '@angular/common';
// import { DesignationList } from 'src/app/models/HttpResponses/DesignationList';
// import { GetDesignationList } from 'src/app/models/HttpRequests/GetDesignationList';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';

@Component({
  selector: 'app-view-user-list',
  templateUrl: './view-user-list.component.html',
  styleUrls: ['./view-user-list.component.scss']
})
export class ViewUserListComponent implements OnInit {
  constructor(
    private userService: UserService,
    private themeService: ThemeService,
    private IMenuService: MenuService,
    private location: Location,
    private DIDesignationService: DesignationService
  ) {
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
    this.subscription = this.IMenuService.subSidebarEmit$.subscribe(result => {
      // console.log(result);
      this.sidebarCollapsed = result;
    });
  }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild(ImageModalComponent, { static: true })
  private imageModal: ImageModalComponent;

  @ViewChild(ContextMenuUserComponent, {static: true})
  private contextMenuUser: ContextMenuUserComponent;

  @ViewChild('openModal', {static: true})
  openModal: ElementRef;

  @ViewChild('closeModal', {static: true})
  closeModal: ElementRef;

  defaultProfile =
    `${environment.ImageRoute}/default.jpg`;
  selectedRow = -1;
  selectedFirstName = '';
  selectedSurName = '';
  selectedEmail = '';
  selectedDesignation = '';
  selectedStatus = '';
  EmpNo = '';
  Extension = '';
  ProfileImage = '';

  statusList: Status[];
  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  sidebarCollapsed = true;
  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  currentUserID: number;
  currentUserName: string;
  pages: Pagination[];
  showingPages: Pagination[];
  userList: UserList[];
  rowCount: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;
  subscription: Subscription;
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
  noData = false;
  showLoader = true;
  displayFilter = false;
  //designations: DesignationList[];

  fileToUpload: File = null;
  preview: any;


  ngOnInit() {
    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });
    this.statusList = new Array<Status>();
    this.statusList.push({name: 'Active', id: 1}, {name: 'Inactive', id: 2});
    // this.loadDesignations();
  }

  // loadDesignations() {
  //   const model: GetDesignationList = {
  //     userID: this.currentUser.userID,
  //     orderBy: 'Name',
  //     orderByDirection: 'DESC',
  //     rowStart: 1,
  //     rowEnd: 1000,
  //     rightName: 'Designations',
  //     specificDesignationID: -1,
  //     filter: ''
  //   };
  //   this.DIDesignationService
  //   .getDesignationList(model)
  //   .then(
  //     (res: DesignationListResponse) => {
  //       this.designations = res.designationList;
  //     },
  //     msg => {
  //       this.notify.errorsmsg(
  //         'Server Error',
  //         'Something went wrong while trying to access the server.'
  //       );
  //     }
  //   );
  // }
  paginateData() {
    let rowStart = 1;
    let rowEnd = +this.rowCountPerPage;
    const pageCount = +this.rowCount / +this.rowCountPerPage;
    this.pages = new Array<Pagination>();

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

  searchBar() {
    this.rowStart = 1;
    this.loadUsers();
  }

  loadUsers() {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model: GetUserList = {
      filter: this.filter,
      userID: this.currentUser.userID,
      specificUserID: -1,
      rightName: this.rightName,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderDirection: this.orderDirection
    };
    this.userService
      .getUserList(model)
      .then(
        (res: UserListResponse) => {
          for (const user of res.userList) {
            if (user.profileImage === null) {
              user.profileImage = `${environment.ApiProfileImages}/default.png`;
            } else {
              user.profileImage = `${environment.ApiProfileImages}/${user.profileImage}`;
            }
          }
          
          if(res.outcome.outcome === "FAILURE"){
            this.notify.errorsmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage
            );
          }
          else
          {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage
            );
          }

          if (res.rowCount === 0) {
            this.noData = true;
            this.showLoader = false;
          } else {
            this.noData = false;
            this.userList = res.userList;
            this.rowCount = res.rowCount;
            this.showLoader = false;
            this.showingRecords = res.userList.length;
            this.totalShowing = +this.rowStart + +this.userList.length - 1;
            
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
    const options = new ImageModalOptions();
    options.width = '';

    this.imageModal.open(src, options);
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

  popClick(event, user) {
    if (this.sidebarCollapsed) {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    } else {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    }

    this.currentUserName = user.firstName;
    this.EmpNo = user.empNo;
    this.selectedFirstName = user.firstName;
    this.selectedSurName = user.surname;
    this.selectedDesignation = user.designation;
    this.selectedEmail = user.email;
    this.selectedStatus = user.status;
    this.currentUserID = user.userId;
    this.Extension = user.extension;
    this.ProfileImage = user.profileImage;
    this.preview = user.profileImage;
    // Will only toggle on if off
    if (!this.contextMenu) {
      this.themeService.toggleContextMenu(true); // Set true
      this.contextMenu = true;
      // Show menu
    } else {
      this.themeService.toggleContextMenu(false);
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

  editUser($event) {
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.openModal.nativeElement.click();
  }
  addNewUser(id, name) {
    // const requestModel: AddDesignationRight = {
    //   userID: this.currentUser.userID,
    //   designationID: this.currentDesignation,
    //   rightID: id,
    //   rightName: 'Designations'
    // };
    // const result = this.designationsService
    // .addDesignationright(requestModel).then(
    //   (res: DesignationRightReponse) => {
    //     this.loadDesignationRights();
    //   },
    //   msg => {
    //     this.notify.errorsmsg(
    //       'Server Error',
    //       'Something went wrong while trying to access the server.'
    //     );
    //   }
    // );
  }

  readFile(event): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.preview = reader.result;
      };

      reader.readAsDataURL(file);
    }
  }

  onFileChange(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  updateUser() {
    const requestModel: UpdateUserRequest = {
      specificUserID: this.currentUser.userID,
      firstName: this.selectedFirstName,
      surname: this.selectedSurName,
      email: this.selectedEmail,
      empNo: +this.EmpNo,
      specificDesignationID: +this.selectedDesignation,
      specificStatusID: +this.selectedStatus,
      profileImage: this.fileToUpload.name
    };

    this.userService.UserUpdate(requestModel).then(
      (res: {outcome: Outcome}) => {
        if (res.outcome.outcome === 'SUCCESS') {
          this.userService.UserUpdateProfileImage(this.fileToUpload).then(
            (uploadRes) => {
              this.notify.successmsg('Success', 'User has been updated');
            },
            (uploadMsg) => {
              this.notify.errorsmsg('Failure', 'User record updated, but image failed to upload');
            }
          );
        }
      },
      (msg) => {
        this.notify.errorsmsg('Failure', 'User not updated');
      }
    );
  }
}
