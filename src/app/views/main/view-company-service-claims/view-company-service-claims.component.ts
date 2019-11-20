import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormControl} from '@angular/forms';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/services/Menu.Service';
import { Pagination } from '../../../models/Pagination';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { UserService } from '../../../services/user.Service';
import { User } from '../../../models/HttpResponses/User';
import { ThemeService } from 'src/app/services/theme.Service.js';
import {SnackbarModel} from '../../../models/StateModels/SnackbarModel';
import {HelpSnackbar} from '../../../services/HelpSnackbar.service';
import { TableHeading, SelectedRecord, Order, TableHeader } from 'src/app/models/Table';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { ServicesService } from 'src/app/services/Services.Service';
import { Router } from '@angular/router';
import { GetCompanyServiceClaims } from 'src/app/models/HttpRequests/GetCompanyServiceClaims';
import { CompanyServiceClaimsListResponse, CompanyServiceClaim } from 'src/app/models/HttpResponses/CompanyServiceClaimsListResponse';
import { GetPermitsByDate } from 'src/app/models/HttpRequests/GetPermitsByDate';
import { PermitsByDateListResponse, PermitByDate } from 'src/app/models/HttpResponses/PermitsByDateListResponse';
import { GetSAD500LinesByPermits } from 'src/app/models/HttpRequests/GetSAD500LinesByPermits';
import { SAD500LinesByPermit, SAD500LinesByPermitResponse } from 'src/app/models/HttpResponses/SAD500LinesByPermitResponse';

@Component({
  selector: 'app-view-company-service-claims',
  templateUrl: './view-company-service-claims.component.html',
  styleUrls: ['./view-company-service-claims.component.scss']
})
export class ViewCompanyServiceClaimsComponent implements OnInit {

  constructor(
    private companyService: CompanyService,
    private ServiceService: ServicesService,
    private userService: UserService,
    private themeService: ThemeService,
    private IMenuService: MenuService,
    private router: Router,
    private snackbarService: HelpSnackbar
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
    this.orderDirection = 'ASC';
    this.totalShowing = 0;
    this.subscription = this.IMenuService.subSidebarEmit$.subscribe(result => {
      this.sidebarCollapsed = result;
    });
  }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild('openPopulateModal', {static: true})
  openPopulateModal: ElementRef;
  @ViewChild('closePopulateModal', {static: true})
  closePopulateModal: ElementRef;

  @ViewChild('openReportsModal', {static: true})
  openReportsModal: ElementRef;
  @ViewChild('closeReportsModal', {static: true})
  closeReportsModal: ElementRef;

  ServiceClaim: {
    companyServiceClaimNumber: number,
    serviceName: string,
  };

  tableHeader: TableHeader = {
    title: `Service Claims`,
    addButton: {
     enable: false,
    },
    backButton: {
      enable: true
    },
    filters: {
      search: true,
      selectRowCount: true,
    }
  };

  tableHeadings: TableHeading[] = [
    {
      title: '#',
      propertyName: 'rowNum',
      order: {
        enable: false,
      }
    },
    {
      title: 'Service',
      propertyName: 'serviceName',
      order: {
        enable: true,
        tag: 'ServiceName'
      }
    },
    {
      title: 'Company Service Claim Number',
      propertyName: 'companyServiceClaimNumber',
      order: {
        enable: true,
        tag: 'CompanyServiceClaimNumber'
      }
    }
  ];

  selectedRow = -1;

  permitsByDate = new FormControl();
  CompanyServiceClaims: CompanyServiceClaim[] = [];
  Permits: PermitByDate[] = [];
  SAD500Lines: SAD500LinesByPermit[] = [];

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  recordsPerPage = 15;
  sidebarCollapsed = true;
  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  showingPages: Pagination[];
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
  noData = false;
  showLoader = true;
  displayFilter = false;
  isAdmin: false;
  companyID = 0;
  companyName = '';
  permitslist = [];



  ngOnInit() {

    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.companyService.observeCompany().subscribe((obj: SelectedCompany) => {
      this.companyID = obj.companyID;
      this.companyName = obj.companyName;

      this.tableHeader.title = `${ this.companyName } - Service Claims`;
    });

    this.loadServiceClaims(true);

  }

  loadServiceClaims(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model: GetCompanyServiceClaims = {
      userID: this.currentUser.userID,
      filter: this.filter,
      serviceID: -1,
      companyID: this.companyID,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
    this.companyService.getCompanyServiceClaims(model).then(
      (res: CompanyServiceClaimsListResponse) => {
        if (res.outcome.outcome === 'SUCCESS') {
          if (displayGrowl) {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage);
          }
        }
        this.CompanyServiceClaims = res.serviceClaims;

        if (res.rowCount === 0) {
          this.noData = true;
          this.showLoader = false;
        } else {
          this.noData = false;
          this.rowCount = res.rowCount;
          this.showingRecords = res.serviceClaims.length;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.CompanyServiceClaims.length - 1;
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

  pageChange($event: {rowStart: number, rowEnd: number}) {
    this.rowStart = $event.rowStart;
    this.rowEnd = $event.rowEnd;
    this.loadServiceClaims(false);
  }

  searchBar() {
    this.rowStart = 1;
    this.loadServiceClaims(false);
  }


  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadServiceClaims(false);
  }

  popClick(event, obj) {
    this.ServiceClaim = obj;
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;
    this.themeService.toggleContextMenu(!this.contextMenu);
    this.contextMenu = true;
  }

  back() {
    this.router.navigate(['companies']);
  }

  selectedRecord(obj: SelectedRecord) {
    this.selectedRow = obj.index;
    this.popClick(obj.event, obj.record);
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
    this.loadServiceClaims(true);
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadServiceClaims(false);
  }

  populatecompanyService($event) {
     this.openPopulateModal.nativeElement.click();
  }

  reportscompanyService(id: number) {

     this.openReportsModal.nativeElement.click();
  }

  dateselected(date) {
    const model: GetPermitsByDate = {
      userID: this.currentUser.userID,
      filter: this.filter,
      permitID: -1,
      permitDate: date,
      companyID: this.companyID,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
    this.companyService.getPermitsByDate(model).then(
      (res: PermitsByDateListResponse) => {

        this.Permits = res.permits;

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

  permitselected(permit) {
    this.permitslist.push(permit);

    this.fetcSAD500Bypermits(this.permitslist);
  }
  fetcSAD500Bypermits(permitIDs) {
    const model: GetSAD500LinesByPermits = {
      userID: this.currentUser.userID,
      filter: this.filter,
      SAD500LineID: -1,
      permitID: permitIDs,
      companyID: this.companyID,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
    this.companyService.getSAD500LinesByPermits(model).then(
      (res: SAD500LinesByPermitResponse) => {

        this.SAD500Lines = res.permits;
        console.log(this.SAD500Lines);

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

  permitdeselected(permitDeSel) {
    this.permitslist.forEach((permit, index) => {
      if (permit === permitDeSel) {
        this.permitslist.splice(index, 1);
      }
    });

    this.fetcSAD500Bypermits(this.permitslist);
  }

   populate() {
     const requestModel = {

     };
  //   this.companyService.itemupdate(requestModel).then(
  //     (res: UpdateItemResponse) => {
  //       if (res.outcome.outcome === 'SUCCESS') {
  //         this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
  //         this.loadItems(false);
  //       } else {
  //         this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
  //       }
  //     },
  //     (msg) => this.notify.errorsmsg('Failure', 'Cannot reach server')
  //   );
   }

   reports() {
     const requestModel = {

     };

  //   this.companyService.itemserviceadd(requestModel).then(
  //     (res: AddItemServiceResponse) => {
  //       if (res.outcome.outcome === 'SUCCESS') {
  //         this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
  //       } else {
  //         this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
  //       }
  //       this.loadItems(false);
  //       this.loadServices(false);
  //     },
  //     (msg) => this.notify.errorsmsg('Failure', 'Cannot reach server')
  //   );
   }

  // removeservice(id, name) {
  //   const requestModel = {
  //     userID: this.currentUser.userID,
  //     itemServiceID: id,
  //     itemID: this.itemID
  //   };

  //   this.companyService.itemserviceupdate(requestModel).then(
  //     (res: UpdateItemServiceResponse) => {
  //       if (res.outcome.outcome === 'SUCCESS') {
  //         this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);

  //       } else {
  //         this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
  //       }
  //       this.loadItems(false);
  //       this.loadServices(false);
  //     },
  //     (msg) => this.notify.errorsmsg('Failure', 'Cannot reach server')
  //   );
  // }

  // removeItemValue(id: number) {
  //   const requestModel = {
  //     userID: this.currentUser.userID,
  //     itemID: this.Item.itemID,
  //     isDeleted: 1
  //   };

  //   this.companyService.RemoveItemList(requestModel).then(
  //     (res: UpdateItemResponse) => {
  //       if (res.outcome.outcome === 'SUCCESS') {
  //         this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
  //         this.loadItems(false);
  //       } else {
  //         this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
  //       }
  //     },
  //     (msg) => this.notify.errorsmsg('Failure', 'Cannot reach server')
  //   );
  // }

  // onVulnerablestateChange(state: string) {
  //   this.vulnerable = state;
  // }

}




