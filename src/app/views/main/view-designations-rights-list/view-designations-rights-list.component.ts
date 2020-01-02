import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DesignationService } from 'src/app/services/Designation.service';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { Pagination } from '../../../models/Pagination';
import { DesignationRightsList } from '../../../models/HttpResponses/DesignationRightsList';
import { DesignationRightsListResponse } from 'src/app/models/HttpResponses/DesignationRightsListResponse';
import { User } from 'src/app/models/HttpResponses/User';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DesignationRightReponse } from 'src/app/models/HttpResponses/DesignationRightResponse';
import { RightList } from 'src/app/models/HttpResponses/RightList';
import { RightService } from 'src/app/services/Right.Service';
import { RightListResponse } from 'src/app/models/HttpResponses/RightListResponse';
import { MenuService } from 'src/app/services/Menu.Service';
import { Subscription, Subject } from 'rxjs';
import { GetRightList } from 'src/app/models/HttpRequests/Rights';
import { GetDesignationRightsList, UpdateDesignationRight, AddDesignationRight } from 'src/app/models/HttpRequests/Designations';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-view-designations-rights-list',
  templateUrl: './view-designations-rights-list.component.html',
  styleUrls: ['./view-designations-rights-list.component.scss']
})
export class ViewDesignationsRightsListComponent implements OnInit, OnDestroy {

  /* Initializing Variables */
  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  currentDesignation: number;
  currentDesignationName: string;
  rightId: number;
  pages: Pagination[];
  showingPages: Pagination[];
  lastPage: Pagination;
  designationRightsList: DesignationRightsList[];
  rightsList: RightList[];
  rowCount: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;
  contextMenu = false;
  rowStart: number;
  rowEnd: number;
  rowCountPerPage: number;
  showingRecords: number;
  filter: string;
  activePage: number;
  orderBy: string;
  orderByDirection = 'ASC';
  totalShowing: number;
  orderIndicator = 'Name_ASC';
  noData = false;
  showLoader = true;
  displayFilter = false;
  selectedRow = -1;
  currentRightID: number;
  sidebarCollapsed = true;
  subscription: Subscription;
  contextMenuX = 0;
  contextMenuY = 0;
  private unsubscribe$ = new Subject<void>();
  // Modal
  closeResult: string;
  /*Init*/
  constructor(
    private designationsService: DesignationService,
    private userService: UserService,
    private themeService: ThemeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private location: Location,
    private rightsService: RightService,
    private IMenuService: MenuService

    ) {
      this.rowStart = 1;
      this.rowCountPerPage = 15;
      this.activePage = +1;
      this.prevPageState = true;
      this.nextPageState = false;
      this.prevPage = +this.activePage - 1;
      this.nextPage = +this.activePage + 1;
      this.filter = '';
      this.orderBy = 'Name';
      this.orderByDirection = 'ASC';
      this.totalShowing = 0;

      this.subscription = this.IMenuService.subSidebarEmit$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => {
        this.sidebarCollapsed = result;
      });
    }



    @ViewChild(NotificationComponent, {static: true })
    private notify: NotificationComponent;
    @ViewChild('openAddModal', {static: true })
    openAddModal: ElementRef;
    @ViewChild('closeAddModal', {static: true })
    closeAddModal: ElementRef;

  ngOnInit() {
    const currentDesignation = this.activatedRoute.paramMap
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(params => {
      this.currentDesignation = +params.get('id');
      this.currentDesignationName = params.get('name');

    });

    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.loadDesignationRights();

  }
  /**
   * Load Designation Rights
   * Returns DesignationRightsListResponse
   */
  loadAvailableRights() {
    const model: GetRightList = {
      filter: this.filter,
      userID: this.currentUser.userID,
      rowStart: this.rowStart,
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


        this.designationRightsList.forEach(right => {
          this.rightsList = this.rightsList.filter(x => x.rightID !== right.rightID);
        });

        // this.designationRightsList.forEach(dRight => {
        //   let count = 0;
        //   this.rightsList.forEach(right => {
        //     if (dRight.rightID === right.rightID) {
        //       this.rightsList.splice(count, 1);
        //     } else {
        //       count ++;
        //     }
        //   });
        // });
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
  loadDesignationRights() {
    this.rowEnd = +this.rowStart + this.rowCountPerPage - 1;
    this.showLoader = true;
    const dRModel: GetDesignationRightsList = {
      userID: this.currentUser.userID,
      specificRightID: -1, // default
      specificDesignationID: this.currentDesignation,
      filter: this.filter,
      orderBy: this.orderBy,
      orderByDirection: this.orderByDirection,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd
    };

    this.designationsService
    .getDesignationRightsList(dRModel).then(
      (res: DesignationRightsListResponse) => {

        if (res.outcome.outcome === 'FAILURE') {
          this.notify.successmsg(
            res.outcome.outcome,
            res.outcome.outcomeMessage
          );
        }
        this.designationRightsList = res.designationRightsList;

        if (res.rowCount === 0) {
          this.noData = true;
          this.showLoader = false;
          this.rowStart = 0;
          this.showLoader = false;
          this.noData = true;
          this.rowCount = 0;
          this.showingRecords = 1;
          this.totalShowing = 0;

        } else {
        this.noData = false;
        this.rowCount = res.rowCount;
        this.showLoader = false;
        this.showingRecords = res.designationRightsList.length;
        this.totalShowing += this.rowStart + this.designationRightsList.length - 1;

        this.paginateData();

        this.loadAvailableRights();
        }
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
    const requestModel: UpdateDesignationRight = {
      userID: this.currentUser.userID,
      designationRightID: id,
    };
    const result = this.designationsService
    .updateDesignationRight(requestModel).then(
      (res: DesignationRightReponse) => {
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

        this.loadDesignationRights();
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
    const requestModel: AddDesignationRight = {
      userID: this.currentUser.userID,
      designationID: this.currentDesignation,
      rightID: id,
    };
    const result = this.designationsService
    .addDesignationright(requestModel).then(
      (res: DesignationRightReponse) => {
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
        this.loadDesignationRights();
      },
      msg => {
        this.notify.errorsmsg(
          'Server Error',
          'Something went wrong while trying to access the server.'
        );
      }
    );
  }
  backToDesignations() {
    this.location.back();
  }

  setClickedRow(index) {
    this.selectedRow = index;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
