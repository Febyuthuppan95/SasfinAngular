import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from '../../../models/HttpResponses/User';
import {Pagination} from '../../../models/Pagination';
import {UserService} from '../../../services/User.Service';
import {ThemeService} from '../../../services/Theme.Service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotificationComponent} from '../../../components/notification/notification.component';
import {UserRightsListResponse} from '../../../models/HttpResponses/UserRightsListResponse';
import {UpdateDesignationRight} from '../../../models/HttpRequests/UpdateDesignationRight';
import {DesignationRightReponse} from '../../../models/HttpResponses/DesignationRightResponse';
import {UserRightsList} from '../../../models/HttpResponses/UserRightsList';
import {RightService} from '../../../services/Right.Service';
import {GetUserRightsList} from '../../../models/HttpRequests/GetUserRightsList';
import {UserRightService} from '../../../services/UserRight.service';

@Component({
  selector: 'app-view-user-rights-list',
  templateUrl: './view-user-rights-list.component.html',
  styleUrls: ['./view-user-rights-list.component.scss']
})
export class ViewUserRightsListComponent implements OnInit {
  /*Init*/
  constructor(
    private themeService: ThemeService,
    // private rightsService: RightService,
    private userService: UserService
    // private userRightService: UserRightService,
    // private router: Router,
    // private activatedRoute: ActivatedRoute,
    // private modalService: NgbModal

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
    this.orderBy = 'Name';
    this.orderByDirection = 'ASC';
    this.totalShowing = 0;
    // this.loadUserRights();
  }
  /* Initializing Variables */
  // currentUser: User = this.userService.getCurrentUser();
  currentTheme = this.themeService.getTheme();
  currentUserRight: number;
  currentUserRightName: string;
  rightId: number;
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
  orderByDirection: string;
  totalShowing: number;
  orderIndicator = 'Name_ASC';

  showLoader = true;
  displayFilter = false;

  // Modal
  closeResult: string;


  @ViewChild(NotificationComponent, {static: true })
  private notify: NotificationComponent;

  ngOnInit() {
    const themeObservable = this.themeService.getCurrentTheme();
    themeObservable.subscribe((themeData: string) => {
      this.currentTheme = themeData;
    });
    // const currentDesignation = this.activatedRoute.paramMap
    //   .subscribe(params => {
    //     this.currentUserRight = +params.get('id');
    //     this.currentUserRightName = params.get('name');
    //     console.log(this.currentUserRight);
    //   });
  }
  /**
   * Load Designation Rights
   * Returns DesignationRightsListResponse
   */
  // loadUserRights() {
  //   this.rowEnd = +this.rowStart + this.rowCountPerPage - 1;
  //   this.showLoader = true;
  //   const dRModel: GetUserRightsList = {
  //     userID: 3, // this is for testing
  //     specificRightID: -1, // default
  //     specificUserID: -1,
  //     rightName: this.rightName,
  //     filter: this.filter,
  //     orderBy: this.orderBy,
  //     orderDirection: this.orderByDirection,
  //     rowStart: this.rowStart,
  //     rowEnd: this.rowEnd
  //   };
  //   this.userRightService
  //     .getUserRightsList(dRModel).then(
  //     (res: UserRightsListResponse) => {
  //       // Process Success
  //       console.log(res.userRightsList);
  //       this.userRightsList = res.userRightsList;
  //       this.rowCount = res.rowCount;
  //       this.showLoader = false;
  //       this.showingRecords = res.userRightsList.length;
  //       this.totalShowing += this.rowStart + this.userRightsList.length - 1;
  //       // this.paginateData();
  //     },
  //     msg => {
  //       // Process Failure
  //       this.showLoader = false;
  //       this.notify.errorsmsg(
  //         'Server Error',
  //         'Something went wrong while trying to access the server.'
  //       );
  //     }
  //   );
  // }

  // pageChange(pageNumber: number) {
  //   const page = this.pages[+ pageNumber - 1];
  //   this.rowStart = page.rowStart;
  //   this.rowEnd = page.rowEnd;
  //   this.activePage = +pageNumber;
  //   this.prevPage = +this.activePage - 1;
  //   this.nextPage = +this.activePage + 1;
  //
  //   if (this.prevPage < 1) {
  //     this.prevPageState = true;
  //   } else {
  //     this.prevPageState = false;
  //   }
  //
  //   let pagenumber = +this.rowCount / +this.rowCountPerPage;
  //   const mod = +this.rowCount % +this.rowCountPerPage;
  //
  //   if (mod > 0) {
  //     pagenumber++;
  //   }
  //
  //   if (this.nextPage > pagenumber) {
  //     this.nextPageState = true;
  //   } else {
  //     this.nextPageState = false;
  //   }
  //
  //   this.updatePagination();
  //
  //   this.loadUserRights();
  // }
  // searchBar() {
  //   this.rowStart = 1;
  //   this.loadUserRights();
  // }
  // paginateData() {
  //   console.log(this.rowCount);
  //   if (this.rowCount > 0) {
  //     let rowStart = 1;
  //     let rowEnd = +this.rowCountPerPage;
  //     const pageCount = +this.rowCount / +this.rowCountPerPage;
  //     console.log(this.rowCountPerPage);
  //     this.pages = Array<Pagination>();
  //
  //     for (let i = 0; i < pageCount; i++) {
  //       const item = new Pagination();
  //       item.page = i + 1;
  //       item.rowStart = +rowStart;
  //       item.rowEnd = +rowEnd;
  //       this.pages[i] = item;
  //       rowStart = +rowEnd + 1;
  //       rowEnd += +this.rowCountPerPage;
  //     }
  //   } else {
  //     this.rowStart = 0;
  //     this.showingRecords = 1;
  //     const item = new Pagination();
  //     item.page = 1;
  //     item.rowStart = 0;
  //     item.rowEnd = 0;
  //     this.pages[0] = item;
  //   }
  //   console.log(this.pages);
  //   this.updatePagination();
  // }
  //
  // updateSort(orderBy: string) {
  //   if (this.orderBy === orderBy) {
  //     if (this.orderByDirection === 'ASC') {
  //       this.orderByDirection = 'DESC';
  //     } else {
  //       this.orderByDirection = 'ASC';
  //     }
  //   } else {
  //     this.orderByDirection = 'ASC';
  //   }
  //
  //   this.orderBy = orderBy;
  //   this.orderIndicator = `${this.orderBy}_${this.orderByDirection}`;
  //   this.loadUserRights();
  // }
  //
  // updatePagination() {
  //   this.showingPages = Array<Pagination>();
  //   this.showingPages[0] = this.pages[this.activePage - 1];
  //   const pagenumber = +this.rowCount / +this.rowCountPerPage;
  //   console.log(this.showingPages);
  //
  //   if (this.activePage < pagenumber) {
  //     this.showingPages[1] = this.pages[+this.activePage];
  //
  //     if (this.showingPages[1] === undefined) {
  //       const page = new Pagination();
  //       page.page = 1;
  //       page.rowStart = 1;
  //       page.rowEnd = this.rowEnd;
  //       this.showingPages[1] = page;
  //     }
  //   }
  //
  //   if (+this.activePage + 1 <= pagenumber) {
  //     this.showingPages[2] = this.pages[+this.activePage + 1];
  //   }
  // }
  //
  // toggleFilters() {
  //   this.displayFilter = !this.displayFilter;
  // }
  //
  // confirmRemove(content, id, Name) {
  //   this.rightId = id;
  //   this.rightName = Name;
  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     console.log(result);
  //     console.log(this.rightName);
  //     this.removeUserRight(this.rightId, this.rightName);
  //     // Remove the right
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }
  // // private getDismissReason(reason: any) {
  // //   console.log(reason);
  // //   if (reason === ModalDismissReasons.ESC) {
  // //     return 'by pressing ESC';
  // //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  // //     return 'by clicking on a backdrop';
  // //   } else {
  // //     return  `with: ${reason}`;
  // //   }
  // // }
  // private removeUserRight(id: number, name: string) {
  //   const requestModel: UpdateDesignationRight = {
  //     userID: this.currentUser.userID,
  //     designationRightID: id,
  //     rightName: name
  //   };
  //   const result = this.userRightService
  //     .updateUserRight(requestModel).then(
  //       (res: DesignationRightReponse) => {
  //         console.log(res);
  //         this.loadUserRights();
  //       },
  //       msg => {
  //         this.notify.errorsmsg(
  //           'Server Error',
  //           'Something went wrong while trying to access the server.'
  //         );
  //       }
  //     );
  // }
}
