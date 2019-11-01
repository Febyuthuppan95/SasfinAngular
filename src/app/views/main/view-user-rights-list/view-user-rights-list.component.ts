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
      // console.log(result);
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
  rightsList: RightList[];
  rowCount: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;
  specificUser = -1;
  rowStart: number;
  rowEnd: number;
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

    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  paginateData() {
    if (this.rowCount > 0) {
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
  } else {
    this.rowStart = 0;
    this.showingRecords = 1;
    const item = new Pagination();
    item.page = 1;
    item.rowStart = 0;
    item.rowEnd = 0;
    this.pages[0] = item;
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

  loadAvailableRights() {
    const model: GetRightList = {
      filter: this.filter,
      userID: this.currentUser.userID,
      rowStart: 1,
      rowEnd: 1000,
      specificRightID: -1,
      orderBy: this.orderBy,
      orderByDirection: this.orderByDirection
    };
    this.rightsService
    .getRightList(model)
    .then(
      (res: RightListResponse) => {
        this.rightsList = res.rightList;
        this.userRightsList.forEach(uRight => {
          let count = 0;
          this.rightsList.forEach(right => {
            if (uRight.rightID === right.rightID) {
              this.rightsList.splice(count, 1);
            } else {
              count ++;
            }
          });
        });
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

  loadUserRights() {
    this.rowEnd = +this.rowStart + this.rowCountPerPage - 1;
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
        this.showLoader = false;
        this.showingRecords = res.userRightsList.length;
        this.totalShowing += this.rowStart + this.userRightsList.length - 1;
        if (this.rowCount === 0) {
          this.noData = true;
        } else {
          this.noData = false;
        }

        this.loadAvailableRights();
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

  backToDesignations() {
    this.location.back();
  }

  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  confirmRemove(content, id, Name) {
    this.rightId = id;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      // (result);
      this.removeRight(this.rightId);
      // Remove the right
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  confirmAdd() {
    this.openAddModal.nativeElement.click();
  }
  removeRight(id: number) {

    const requestModel: UpdateUserRight = {
      userID: this.currentUser.userID,
      userRightID: id,
    };
    const result = this.userService
    .updateUserRight(requestModel).then(
      (res: UserRightReponse) => {

        if (res.outcome.outcome === 'FAILURE') {
          this.notify.errorsmsg(
            res.outcome.outcome,
            res.outcome.outcomeMessage
          );
        } else {
          this.notify.successmsg(
            res.outcome.outcome,
            res.outcome.outcomeMessage
          );
        }

        this.loadUserRights();

      },
      msg => {
        this.notify.errorsmsg(
          'Server Error',
          'Something went wrong while trying to access the server.'
        );
      }
    );
  }
  addNewRight(id, name) {
    const requestModel: AddUserRight = {
      userID: this.currentUser.userID,
      addedUserID: this.specificUser,
      rightID: id,
    };
    console.log(requestModel);
    const result = this.userService
    .addUserright(requestModel).then(
      (res: UserRightReponse) => {
        if (res.outcome.outcome === 'FAILURE') {
          this.notify.errorsmsg(
            res.outcome.outcome,
            res.outcome.outcomeMessage
          );
        } else {
          this.notify.successmsg(
            res.outcome.outcome,
            res.outcome.outcomeMessage
          );
        }
        this.loadUserRights();
      },
      msg => {
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
