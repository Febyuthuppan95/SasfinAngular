import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DesignationService } from 'src/app/services/Designation.service';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { Pagination } from '../../../models/Pagination';
import { DesignationRightsList } from '../../../models/HttpResponses/DesignationRightsList';
import { GetDesignationRightsList } from 'src/app/models/HttpRequests/GetDesignationRightsList';
import { DesignationRightsListResponse } from 'src/app/models/HttpResponses/DesignationRightsListResponse';
import { User } from 'src/app/models/HttpResponses/User';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UpdateDesignationRight } from 'src/app/models/HttpRequests/UpdateDesignationRight';
import { DesignationRightReponse } from 'src/app/models/HttpResponses/DesignationRightResponse';
import { RightList } from 'src/app/models/HttpResponses/RightList';
import { RightService } from 'src/app/services/Right.Service';
import { RightListResponse } from 'src/app/models/HttpResponses/RightListResponse';
import { AddDesignationRight } from 'src/app/models/HttpRequests/AddDesignationRight';




@Component({
  selector: 'app-view-designations-rights-list',
  templateUrl: './view-designations-rights-list.component.html',
  styleUrls: ['./view-designations-rights-list.component.scss']
})
export class ViewDesignationsRightsListComponent implements OnInit {

  /* Initializing Variables */
  currentUser: User = this.userService.getCurrentUser();
  currentTheme = this.themeService.getTheme();
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
    private rightsService: RightService

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

    }

    @ViewChild(NotificationComponent, {static: true })
    private notify: NotificationComponent;
  ngOnInit() {
    const themeObservable = this.themeService.getCurrentTheme();
    themeObservable.subscribe((themeData: string) => {
      this.currentTheme = themeData;
    });
    const currentDesignation = this.activatedRoute.paramMap
    .subscribe(params => {
      this.currentDesignation = +params.get('id');
      this.currentDesignationName = params.get('name');
      // console.log(this.currentDesignation);
    });

    this.loadDesignationRights();
    this.loadAvailableRights();


  }
  /**
   * Load Designation Rights
   * Returns DesignationRightsListResponse
   */
  loadAvailableRights() {
    this.rightsService
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
        this.rightsList = res.rightList;
        this.designationRightsList.forEach(dRight => {
          let count = 0;
          this.rightsList.forEach(right => {
            if (dRight.rightID !== right.rightId) {
              console.log(right);
              this.rightsList.splice(count, 1);
              console.log(this.rightsList);
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
  loadDesignationRights() {
    this.rowEnd = +this.rowStart + this.rowCountPerPage - 1;
    this.showLoader = true;
    const dRModel: GetDesignationRightsList = {
      userID: this.currentUser.userID,
      specificRightID: -1, // default
      specifcDesignationID: this.currentDesignation,
      rightName: 'Designations',
      filter: this.filter,
      orderBy: this.orderBy,
      orderDirection: this.orderByDirection,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd
    };
    this.designationsService
    .getDesignationRightsList(dRModel).then(
      (res: DesignationRightsListResponse) => {
        console.log(res);
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
        // Process Success
        // console.log(res.designationRightsList);
        this.designationRightsList = res.designationRightsList;
        this.rowCount = res.rowCount;
        this.showLoader = false;
        this.showingRecords = res.designationRightsList.length;
        this.totalShowing += this.rowStart + this.designationRightsList.length - 1;
        this.paginateData();
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
    // console.log(this.rowCount);
    if (this.rowCount > 0) {
      let rowStart = this.rowStart;
      let rowEnd = +this.rowCountPerPage;
      const pageCount = +this.rowCount / +this.rowCountPerPage;
      // console.log(this.rowCountPerPage);
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
    // console.log(this.pages);
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
    // console.log(this.showingPages);

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

  confirmRemove(content, id, Name) {
    this.rightId = id;
    this.rightName = 'Designations';
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      // (result);
      // console.log(this.rightName);
      this.removeRight(this.rightId, this.rightName);
      // Remove the right
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  confirmAdd(add) {
    this.modalService.open(add, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      // console.log(result);
      // this.addNewRight(this.rightId, this.rightName);
      // Remove the right
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  removeRight(id: number, name: string) {
    const requestModel: UpdateDesignationRight = {
      userID: this.currentUser.userID,
      designationRightID: id,
      rightName: 'Designations'
    };
    const result = this.designationsService
    .updateDesignationRight(requestModel).then(
      (res: DesignationRightReponse) => {
        // console.log(res);
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
      rightName: 'Designations'
    };
    const result = this.designationsService
    .addDesignationright(requestModel).then(
      (res: DesignationRightReponse) => {
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
}
