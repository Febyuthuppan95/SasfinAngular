import { DesignationService } from './../../../services/Designation.service';
import { Status } from './../../../models/Enums/Statuses';
import { Subscription, Subject } from 'rxjs';
import { MenuService } from 'src/app/services/Menu.Service';
import { ContextMenuUserComponent } from '../../../components/menus/context-menu-user/context-menu-user.component';
import { Component, OnInit, ViewChild, Input, ElementRef, OnDestroy } from '@angular/core';
import { UserListResponse } from '../../../models/HttpResponses/UserListResponse';
import { UserList } from '../../../models/HttpResponses/UserList';
import { Pagination } from '../../../models/Pagination';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { ImageModalComponent } from '../../../components/image-modal/image-modal.component';
import { UserService } from '../../../services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service.js';
import { environment } from '../../../../environments/environment';
import { ImageModalOptions } from 'src/app/models/ImageModalOptions';
import { DesignationList } from 'src/app/models/HttpResponses/DesignationList';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { DesignationListResponse } from 'src/app/models/HttpResponses/DesignationListResponse';
import {HelpSnackbar} from '../../../services/HelpSnackbar.service';
import { TableHeading, SelectedRecord, Order, TableHeader } from 'src/app/models/Table';
import { GetDesignationList } from 'src/app/models/HttpRequests/Designations';
import { GetUserList, AddUserRequest, UpdateUserRequest } from 'src/app/models/HttpRequests/Users';
import { User } from 'src/app/models/HttpResponses/User';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { ValidateService } from 'src/app/services/Validation.Service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-view-user-list',
  templateUrl: './view-user-list.component.html',
  styleUrls: ['./view-user-list.component.scss']
})
export class ViewUserListComponent implements OnInit, OnDestroy {
  constructor(
    private userService: UserService,
    private themeService: ThemeService,
    private IMenuService: MenuService,
    private DIDesignationService: DesignationService,
    private snackbarService: HelpSnackbar,
    private validateService: ValidateService
  ) {
    this.rowStart = 1;
    this.rowCountPerPage = 15;
    this.activePage = +1;
    this.prevPageState = true;
    this.nextPageState = false;
    this.prevPage = +this.activePage - 1;
    this.nextPage = +this.activePage + 1;
    this.filter = '';
    this.orderBy = 'Surname';
    this.orderDirection = 'ASC';
    this.totalShowing = 0;
    this.loadUsers(true);
    this.subscription = this.IMenuService.subSidebarEmit$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(result => {
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

  @ViewChild('openAddModal', {static: true})
  openAddModal: ElementRef;

  @ViewChild('closeAddModal', {static: true})
  closeAddModal: ElementRef;

  private unsubscribe$ = new Subject<void>();

  tableHeader: TableHeader = {
    title: 'Users',
    addButton: {
     enable: true,
    },
    backButton: {
      enable: false
    },
    filters: {
      search: true,
      selectRowCount: true,
    }
  };

  tableHeadings: TableHeading[] = [
    {
      title: '',
      propertyName: 'rowNum',
      order: {
        enable: false,
      }
    },
    {
      title: '',
      propertyName: 'profileImage',
      order: {
        enable: false,
      },
      styleType: 'user-profile'
    },
    {
      title: 'Emp No',
      propertyName: 'empNo',
      order: {
        enable: true,
        tag: 'EmpNo'
      }
    },
    {
      title: 'First Name',
      propertyName: 'firstName',
      order: {
        enable: true,
        tag: 'FirstName'
      }
    },
    {
      title: 'Surname',
      propertyName: 'surname',
      order: {
        enable: true,
        tag: 'Surname'
      }
    },
    {
      title: 'Email',
      propertyName: 'email',
      order: {
        enable: true,
        tag: 'Email'
      }
    },
    {
      title: 'Ext',
      propertyName: 'extension',
      order: {
        enable: true,
        tag: 'Extension'
      }
    },
    {
      title: 'Designation',
      propertyName: 'designation',
      order: {
        enable: true,
        tag: 'Designation'
      }
    },
    {
      title: 'Status',
      propertyName: 'status',
      order: {
        enable: true,
        tag: 'Status'
      },
      styleType: 'badge',
      style: {
        posClass: 'badge badge-success',
        negClass: 'badge badge-danger',
        pos: 'Active',
        neg: 'Inactive'
      }
    },
  ];

  defaultProfile =
    `${environment.ImageRoute}/default.jpg`;
  selectedRow = -1;
  selectedFirstName = null;
  selectedSurName = null;
  selectedEmail = null;
  selectedDesignation = -1;
  selectedStatus = -1;
  selectedStatusIndex = 0;
  EmpNo = '';
  Extension = null;
  ProfileImage = '';
  selectedUserID = -1;
  password = null;
  confirmpassword = null;
  EmployeeNumb = null;

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
  userList: UserList[] = null;
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
  activePage: number;
  orderBy: string;
  orderDirection: string;
  totalShowing: number;
  orderIndicator = 'Surname_ASC';
  noData = false;
  showLoader = true;
  displayFilter = false;
  designations: DesignationList[];
  selectedDesignationIndex = 0;
  fileToUpload: File = null;
  preview: any;
  disableDesSelect = false;

  isAdmin: false;

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });
    this.statusList = new Array<Status>();
    this.statusList.push({name: 'Active', id: 1}, {name: 'Inactive', id: 2});
    this.loadDesignations();
  }

  loadDesignations() {
    const model: GetDesignationList = {
      userID: this.currentUser.userID,
      orderBy: 'Name',
      orderByDirection: 'DESC',
      rowStart: 1,
      rowEnd: 1000,
      specificDesignationID: -1,
      filter: ''
    };
    this.DIDesignationService
    .getDesignationList(model)
    .then(
      (res: DesignationListResponse) => {
        this.designations = res.designationList;
      },
      msg => {
        this.notify.errorsmsg(
          'Server Error',
          'Something went wrong while trying to access the server.'
        );
      }
    );
  }

  pageChange($event: {rowStart: number, rowEnd: number}) {
    this.rowStart = $event.rowStart;
    this.rowEnd = $event.rowEnd;
    this.loadUsers(false);
  }

  searchBar() {
    this.rowStart = 1;
    this.loadUsers(false);
  }

  loadUsers(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model: GetUserList = {
      filter: this.filter,
      userID: this.currentUser.userID,
      specificUserID: -1,
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

          if (res.outcome.outcome === 'SUCCESS') {
            if (displayGrowl) {
              this.notify.successmsg(
                res.outcome.outcome,
                res.outcome.outcomeMessage
              );
            }
          }

          this.userList = res.userList;

          if (res.rowCount === 0) {
            this.noData = true;
            this.showLoader = false;
            this.userList = [];
          } else {
            this.noData = false;
            this.rowCount = res.rowCount;
            this.showingRecords = res.userList.length;

            this.showLoader = false;
            this.totalShowing = +this.rowStart + +this.userList.length - 1;
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

  inspectUserImage(src: string) {
    const options = new ImageModalOptions();
    options.width = '';

    this.imageModal.open(src, options);
  }

  onDesignationChange(id: number) {
    this.selectedDesignation = id;
    this.disableDesSelect = true;
  }

  onStatusChange(id: number) {
    this.selectedStatus = id;
  }

  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadUsers(false);
  }

  popClick(event, user) {
    if (this.sidebarCollapsed) {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    } else {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    }

    this.selectedStatus = user.statusID;
    this.currentUserID = +user.userId;
    this.currentUserName = user.firstName;
    this.EmpNo = user.empNo;
    this.selectedFirstName = user.firstName;
    this.selectedSurName = user.surname;
    this.selectedEmail = user.email;
    this.Extension = user.extension;
    this.ProfileImage = user.profileImage;
    this.preview = user.profileImage;
    this.selectedUserID = +user.userId;


    for (let index = 0; index < this.designations.length; index++) {
      if (this.designations[index].name === user.designation) {
        let des = this.designations[index];
        this.selectedDesignation = des.designationID;
      }
    }

    for (let index = 0; index < this.statusList.length; index++) {
      if (this.statusList[index].name === user.status) {
        this.selectedStatus = +this.statusList[index].id;
      }
    }


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

  selectedRecord(obj: SelectedRecord) {
    this.selectedRow = obj.index;
    this.popClick(obj.event, obj.record);
  }

  editUser($event) {
    this.preview = null;
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.openModal.nativeElement.click();
  }

  addNewUser() {
    this.selectedFirstName = null;
    this.selectedSurName = null;
    this.selectedEmail = null;
    this.password = null;
    this.confirmpassword = null;
    this.selectedDesignation = null;
    this.ProfileImage = null;
    this.EmployeeNumb = null;
    this.selectedDesignationIndex = 0;
    this.selectedStatusIndex = 0;
    this.disableDesSelect = false;
    this.preview = null;
    this.Extension = null;
    this.openAddModal.nativeElement.click();
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

  addUser($event) {
    $event.preventDefault();
    let ImageName = null;
    let errors = 0;

    if (this.fileToUpload !== null  && this.fileToUpload !== undefined) {
      ImageName = this.fileToUpload.name;
    }

    if (this.EmployeeNumb === null || this.EmployeeNumb === undefined  || this.EmployeeNumb === '') {
      errors++;
    }
    if (this.selectedFirstName === null || this.selectedFirstName === undefined || this.selectedFirstName === '') {
      errors++;
    }
    if (this.selectedSurName === null || this.selectedSurName === undefined || this.selectedSurName === '') {
      errors++;
    }
    if (this.selectedEmail === null || this.selectedEmail === undefined  || this.selectedEmail === '') {
      errors++;
    }
    if (this.password === null || this.password === undefined || this.password === '') {
      errors++;
    }
    if (this.confirmpassword === null || this.confirmpassword === undefined  || this.confirmpassword === '') {
      errors++;
    }
    if (this.selectedDesignation === null || this.selectedDesignation === undefined && this.selectedDesignation === -1) {
      errors++;
    }
    if (this.Extension === null || this.Extension === undefined || this.Extension === '') {
      errors++;
    }

    const emailCheck = this.validateService.regexTest(this.validateService.emailRegex, this.selectedEmail);

    if (!emailCheck) {
      errors++;
    }


    const requestModelTest: AddUserRequest = {
      userID: this.currentUser.userID,
      empNo: this.EmployeeNumb,
      firstName: this.selectedFirstName,
      surname: this.selectedSurName,
      email: this.selectedEmail,
      password: this.password,
      specificDesignationID: +this.selectedDesignation,
      profileImage: ImageName,
      extension: this.Extension
    };

    const validateResponse = this.validateService.model(requestModelTest);

    if (errors === 0) {
      if (this.password === this.confirmpassword) {
        const requestModel: AddUserRequest = {
          userID: this.currentUser.userID,
          empNo: this.EmployeeNumb,
          firstName: this.selectedFirstName,
          surname: this.selectedSurName,
          email: this.selectedEmail,
          password: this.password,
          specificDesignationID: +this.selectedDesignation,
          profileImage: ImageName,
          extension: this.Extension
        };

        this.userService.UserAdd(requestModel).then(
          (res: {outcome: Outcome}) => {
            if (res.outcome.outcome === 'SUCCESS') {
              if (this.fileToUpload !== undefined && this.fileToUpload !== null) {
                this.userService.UserUpdateProfileImage(this.fileToUpload).then(
                  (uploadRes) => {
                    this.notify.successmsg('Success', 'User has been Added');
                    this.closeAddModal.nativeElement.click();
                    this.loadUsers(false);
                  },
                  (uploadMsg) => {
                    this.notify.errorsmsg('Failure', 'User record Added, but image failed to Add');
                  }
                );
              } else {
                this.notify.successmsg('Success', 'User has been Added');
                this.closeAddModal.nativeElement.click();
                this.loadUsers(false);
              }
            } else {
              this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
            }
          },
          (msg) => {
            this.notify.errorsmsg('Failure', 'User not Added');
          }
        );
      } else {
        this.notify.errorsmsg('Failure', 'Passwords do not match!');
      }
    } else {
      if (errors === 1 && !emailCheck) {
        this.notify.toastrwarning('Warning', 'User email needs to be in the correct format');
      } else {
        this.notify.toastrwarning('Warning', 'Please enter all fields before submitting');
      }

    }
  }

  updateUser($event) {
    $event.preventDefault();



    let ImageName = null;

    if (this.fileToUpload !== null  && this.fileToUpload !== undefined) {
      ImageName = this.fileToUpload.name;
    }

    let errors = 0;

    if (this.fileToUpload !== null  && this.fileToUpload !== undefined) {
      ImageName = this.fileToUpload.name;
    }

    if (this.EmpNo === null || this.EmpNo === undefined || this.EmpNo === '') {
      errors++;
    }
    if (this.selectedFirstName === null || this.selectedFirstName === undefined || this.selectedFirstName === '') {
      errors++;
    }
    if (this.selectedSurName === null || this.selectedSurName === undefined || this.selectedSurName === '') {
      errors++;
    }
    if (this.selectedEmail === null || this.selectedEmail === undefined || this.selectedEmail === '') {
      errors++;
    }
    if (this.selectedDesignation === null || this.selectedDesignation === undefined && this.selectedDesignation === -1) {
      errors++;
    }
    if (this.Extension === null || this.Extension === undefined  || this.Extension === '') {
      errors++;
    }
    if (this.selectedStatus === null || this.selectedStatus === undefined) {
      errors++;
    }

    const emailCheck = this.validateService.regexTest(this.validateService.emailRegex, this.selectedEmail);

    if (!emailCheck) {
      errors++;
    }

    if (errors === 0) {
      const requestModel: UpdateUserRequest = {
        userID: this.currentUser.userID,
        specificUserID: this.selectedUserID,
        firstName: this.selectedFirstName,
        surname: this.selectedSurName,
        email: this.selectedEmail,
        empNo: this.EmpNo,
        specificDesignationID: +this.selectedDesignation,
        specificStatusID: +this.selectedStatus,
        profileImage: ImageName,
        extension: this.Extension
      };

      this.userService.UserUpdate(requestModel).then(
        (res: {outcome: Outcome}) => {
          if (res.outcome.outcome === 'SUCCESS') {
            if (this.fileToUpload !== undefined && this.fileToUpload !== null) {
              this.userService.UserUpdateProfileImage(this.fileToUpload).then(
                (uploadRes) => {
                  this.notify.successmsg('Success', 'User has been updated');
                  this.closeModal.nativeElement.click();
                  this.loadUsers(false);
                },
                (uploadMsg) => {
                  this.notify.errorsmsg('Failure', 'User record updated, but image failed to upload');
                }
              );
            } else {
              this.closeModal.nativeElement.click();
              this.loadUsers(false);
              this.notify.successmsg('Success', res.outcome.outcomeMessage);
            }
          } else {
            this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          }
        },
        (msg) => {
          this.notify.errorsmsg('Failure', 'User not updated');
        }
      );
    } else {
      if (errors === 1 && !emailCheck) {
        this.notify.toastrwarning('Warning', 'User email needs to be in the correct format');
      } else {
        this.notify.toastrwarning('Warning', 'Please enter all fields before submitting');
      }    }
  }

  updateHelpContext(slug: string, $event?) {
    if (this.isAdmin) {
      const newContext: SnackbarModel = {
        display: true,
        slug,
      };

      this.snackbarService.setHelpContext(newContext);
    } else {
      if ($event.target.attributes.matTooltip !== undefined && $event.target !== undefined) {
        $event.target.setAttribute('mattooltip', 'New Tooltip');
        $event.srcElement.setAttribute('matTooltip', 'New Tooltip');
      }
    }
  }

  recordsPerPageChange(recordsPerPage: number) {
    this.rowCountPerPage = recordsPerPage;
    this.rowStart = 1;
    this.loadUsers(true);
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadUsers(false);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
