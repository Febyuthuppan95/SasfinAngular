import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import { Location } from '@angular/common';
import {ThemeService} from '../../../services/Theme.Service';
import {UserService} from '../../../services/User.Service';
import {NotificationComponent} from '../../../components/notification/notification.component';
import {ImageModalComponent} from '../../../components/image-modal/image-modal.component';
import {environment} from '../../../../environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {User} from '../../../models/HttpResponses/User';
import {Pagination} from '../../../models/Pagination';
import {UserRightService} from '../../../services/UserRight.service';
import {UserRightsListResponse} from '../../../models/HttpResponses/UserRightsListResponse';
import {UserRightsList} from '../../../models/HttpResponses/UserRightsList';
import { ActivatedRoute } from '@angular/router';
import { UserRightReponse } from 'src/app/models/HttpResponses/UserRightResponse';
import { RightService } from 'src/app/services/Right.Service';
import { RightListResponse } from 'src/app/models/HttpResponses/RightListResponse';
import { RightList } from 'src/app/models/HttpResponses/RightList';
import { MenuService } from 'src/app/services/Menu.Service';
import { Subscription, Subject } from 'rxjs';
import { ContextMenuUserrightsComponent } from '../../../components/menus/context-menu-userrights/context-menu-userrights.component';
import { GetRightList } from 'src/app/models/HttpRequests/Rights';
import { GetUserRightsList, UpdateUserRight, AddUserRight } from 'src/app/models/HttpRequests/UserRights';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-view-user-rights-list',
  templateUrl: './view-user-rights-list.component.html',
  styleUrls: ['./view-user-rights-list.component.scss']
})
export class ViewUserRightsListComponent implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
    private themeService: ThemeService,
    private userRightService: UserRightService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private modalService: NgbModal,
    private IMenuService: MenuService,
    private rightsService: RightService
  ) {
    this.rowStart = 1;
    this.rowCountPerPage = 15;
    this.activePage = +1;
    this.prevPageState = true;
    this.nextPageState = false;
    this.prevPage = +this.activePage - 1;
    this.nextPage = +this.activePage + 1;
    this.filter = '';
    this.orderBy = '';
    this.orderByDirection = 'ASC';
    this.totalShowing = 0;

    this.subscription = this.IMenuService.subSidebarEmit$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(result => {
      this.sidebarCollapsed = result;
    });
  }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;
  @ViewChild('openAddModal', {static: true })
  openAddModal: ElementRef;
  @ViewChild('closeAddModal', {static: true })
  closeAddModal: ElementRef;
  @ViewChild(ImageModalComponent, { static: true })
  private imageModal: ImageModalComponent;
  @ViewChild(ContextMenuUserrightsComponent, {static: true})
  private contextMenuUser: ContextMenuUserrightsComponent;

  private unsubscribe$ = new Subject<void>();

  defaultProfile =
    `${environment.ImageRoute}/default.jpg`;

  currentUser: User = this.userService.getCurrentUser();
  currentUserName: string;
  selectedRow = -1;
  currentTheme: string;
  rightId: number;
  pages: Pagination[];
  showingPages: Pagination[];
  lastPage: Pagination;
  userRightsList: UserRightsList[];
  assignedRights: UserRightsList[];
  rightsList: RightList[];
  rowCount: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;
  specificUser = -1;
  rowStart: number;
  rowEnd: number = 15;
  rowCountPerPage: number;
  showingRecords: number;
  filter: string;
  activePage: number;
  orderBy: string;
  orderByDirection: string;
  noData = false;
  totalShowing: number;
  orderIndicator = 'Surname_ASC';
  showLoader = true;
  displayFilter = false;
  contextMenu = false;
  sidebarCollapsed = true;
  subscription: Subscription;
  contextMenuX = 0;
  contextMenuY = 0;
  currentRightID: number;

  closeResult: string;


  ngOnInit() {
    const currentUser = this.activatedRoute.paramMap
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(params => {
       this.specificUser = +params.get('id');
       this.currentUserName = params.get('name');
    });

    this.loadUserRights();
    this.loadAssignedRights();

    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  howManyChange() {
    alert(this.rowCountPerPage);
  }

  pageChange($event: { rowStart: number, rowEnd: number }) {
    this.rowStart = $event.rowStart;
    this.rowEnd = $event.rowEnd;
    this.loadUserRights();
  }

  searchBar() {
    this.rowStart = 1;
    this.loadUserRights();
  }

  loadAvailableRights() {
    console.log('Loading Available Rights');
    const model: GetRightList = {
      filter: this.filter,
      userID: this.currentUser.userID,
      rowStart: 1,
      rowEnd: 100000000,
      specificRightID: -1,
      orderBy: this.orderBy,
      orderByDirection: this.orderByDirection
    };
    this.rightsService
    .getRightList(model)
    .then(
      (res: RightListResponse) => {
        console.log('Loading Available Rights Complete');
        this.showLoader = false;
        this.rightsList = res.rightList;

        this.assignedRights.forEach(right => {
          this.rightsList = this.rightsList.filter(x => x.rightID !== right.rightID);
        });
      },
      msg => {
        console.log('Loading Available Rights Failed');
        this.showLoader = false;
        // this.notify.errorsmsg(
        //   'Server Error',
        //   'Something went wrong while trying to access the server.'
        // );
      }
    );
  }

  loadAssignedRights() {
    this.showLoader = true;
    const uRModel: GetUserRightsList = {
      userID: this.currentUser.userID,
      specificRightID: -1, // default
      specificUserID: this.specificUser,
      filter: this.filter,
      orderBy: this.orderBy,
      orderByDirection: this.orderByDirection,
      rowStart: this.rowStart,
      rowEnd: 100000000
    };
    this.userRightService
      .getUserRightsList(uRModel).then(
      (res: UserRightsListResponse) => {
        // Process Success
        if (!this.openAddModal) {
          if (res.outcome.outcome === 'SUCCESS') {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage
            );
          }
        }


        this.assignedRights = res.userRightsList;
        this.rowCount = res.rowCount;
        this.showingRecords = res.userRightsList.length;
        this.totalShowing += this.rowStart + this.userRightsList.length - 1;
        if (this.rowCount === 0) {
          this.noData = true;
        } else {
          this.noData = false;
        }

        this.loadAvailableRights();
        // this.paginateData();
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

  loadUserRights() {
    this.showLoader = true;
    const uRModel: GetUserRightsList = {
      userID: this.currentUser.userID,
      specificRightID: -1, // default
      specificUserID: this.specificUser,
      filter: this.filter,
      orderBy: this.orderBy,
      orderByDirection: this.orderByDirection,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd
    };
    this.userRightService
      .getUserRightsList(uRModel).then(
      (res: UserRightsListResponse) => {
        console.log(res);
        // Process Success
        if (!this.openAddModal) {
          if (res.outcome.outcome === 'SUCCESS') {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage
            );
          }
        }


        this.userRightsList = res.userRightsList;
        this.rowCount = res.rowCount;
        // this.showLoader = false;
        this.showingRecords = res.userRightsList.length;
        this.totalShowing += this.rowStart + this.userRightsList.length - 1;
        if (this.rowCount === 0) {
          this.noData = true;
        } else {
          this.noData = false;
        }
        // this.paginateData();
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
    this.loadUserRights();
  }

  backToDesignations() {
    this.location.back();
  }

  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  confirmRemove(content, right: UserRightsList) {
    this.rightId = right.rightID;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      // (result);
      this.removeRight(right);
      // Remove the right
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  confirmAdd() {
    this.openAddModal.nativeElement.click();
  }

  removeRight(right: UserRightsList) {
    const rightReturn: RightList = {
      name: right.name,
      description: right.description,
      rightID: right.rightID
    };

    this.rightsList.push(rightReturn);
    this.assignedRights = this.assignedRights.filter(x => x.rightID !== right.rightID);

    const requestModel: UpdateUserRight = {
      userID: this.currentUser.userID,
      userRightID: right.userRightID,
    };

    console.log(requestModel);
    const result = this.userService
    .updateUserRight(requestModel).then(
      (res: UserRightReponse) => {
        if (res.outcome.outcome === 'FAILURE') {
          this.notify.errorsmsg(
            res.outcome.outcome,
            res.outcome.outcomeMessage
          );

          this.assignedRights.push(right);
          this.rightsList = this.rightsList.filter(x => x.rightID !== right.rightID);
        } else {
          this.notify.successmsg(
            res.outcome.outcome,
            res.outcome.outcomeMessage
          );

          this.loadAssignedRights();
        }
      },
      msg => {
        this.notify.errorsmsg(
          'Server Error',
          'Something went wrong while trying to access the server.'
        );

        this.assignedRights.push(right);
        this.rightsList = this.rightsList.filter(x => x.rightID !== right.rightID);
      }
    );
  }

  addNewRight(right: RightList) {
    const rightReturn: UserRightsList = {
      name: right.name,
      description: right.description,
      rightID: right.rightID,
      userRightID: -1
    };

    this.assignedRights.push(rightReturn);
    this.rightsList = this.rightsList.filter(x => x.rightID !== right.rightID);

    const requestModel: AddUserRight = {
      userID: this.currentUser.userID,
      addedUserID: this.specificUser,
      rightID: right.rightID,
    };
    const result = this.userService
    .addUserright(requestModel).then(
      (res: UserRightReponse) => {
        if (res.outcome.outcome === 'FAILURE') {
          this.notify.errorsmsg(
            res.outcome.outcome,
            res.outcome.outcomeMessage
          );

          this.rightsList.push(right);
          this.assignedRights = this.assignedRights.filter(x => x.rightID !== right.rightID);

        } else {
          this.notify.successmsg(
            res.outcome.outcome,
            res.outcome.outcomeMessage
          );

          this.assignedRights.find(x => x.rightID === rightReturn.rightID);
        }
        this.loadUserRights();
      },
      msg => {
        this.rightsList.push(right);
        this.assignedRights = this.assignedRights.filter(x => x.rightID !== right.rightID);

        this.notify.errorsmsg(
          'Server Error',
          'Something went wrong while trying to access the server.'
        );
      }
    );
  }
  popClick(event, uRight) {
    if (this.sidebarCollapsed) {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    } else {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    }
    this.currentRightID = uRight;
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
