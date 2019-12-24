import { Component, OnInit, ViewChild, ElementRef, ɵConsole } from '@angular/core';
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
import { isEmpty } from 'rxjs/operators';
import { SAD500Line } from 'src/app/models/HttpResponses/SAD500Line';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { NgbModalWindow } from '@ng-bootstrap/ng-bootstrap/modal/modal-window';

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

  @ViewChild('myInput', { static: true })
  myInputVariable: ElementRef;

  ServiceClaim: {
    companyServiceID: number,
    companyServiceClaimNumber: number,
    serviceID: number,
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
      title: '',
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
  SAD500SelectedLines = [];
  isChecked: boolean;

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
  submissiondate: Date;
  complete = false;

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
     this.myInputVariable.nativeElement.value = null;
     this.openPopulateModal.nativeElement.click();
  }

  reportscompanyService(id: number) {

     this.openReportsModal.nativeElement.click();
  }

  enddateselected(date: Date) {
    const today = new Date();
    const date2 = new Date(date);
    const result = this.compareDate(date2, today);

    if (result === 1) {
      this.notify.toastrwarning(
        'information',
        'Cannot choose a date earlier then the current date. Please choose a date in the future.'
      );

      this.myInputVariable.nativeElement.value = null;
    } else {
      const model: GetPermitsByDate = {
        userID: this.currentUser.userID,
        filter: this.filter,
        submissiondate: date,
        companyID: this.companyID,
        rowStart: this.rowStart,
        rowEnd: this.rowEnd,
        orderBy: this.orderBy,
        orderByDirection: this.orderDirection
      };
      this.companyService.getPermitsByDate(model).then(
        (res: PermitsByDateListResponse) => {

          this.Permits = res.permitByDatelist;

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
  }

  permitselected(permitIDs) {
    this.permitslist = permitIDs;

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

  sad500selected(checked) {
    this.SAD500SelectedLines = [];

    checked.forEach(c => {
      this.SAD500SelectedLines.push(c.value);
    });

  }

   polulateLines() {
      const requestModel = {
        userID: this.currentUser.userID,
        sad500linesIDs: this.SAD500SelectedLines,
        status: this.complete
      };

      this.companyService.addSAD500Linesclaim(requestModel).then(
        (res: {outcome: Outcome}) => {
          if (res.outcome.outcome === 'SUCCESS') {
              this.notify.successmsg('Success', 'SAD500 lines has been Added');
              this.closePopulateModal.nativeElement.click();
              this.loadServiceClaims(false);
            } else {
            this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          }
        },
        (msg) => {
          this.notify.errorsmsg('Failure', 'SAD500 lines not Added');
        }
      );
   }

  compareDate(date1: Date, date2: Date): number {
    const d1Year = date1.getFullYear();
    const d1Month = date1.getMonth();
    const d1Day = date1.getDate();

    const d2Year = date2.getFullYear();
    const d2Month = date2.getMonth();
    const d2Day = date2.getDate();

    if (d1Year < d2Year) {
      return 1;
    } else if (d1Year > d2Year) {
      return -1;
    } else if (d1Year === d2Year) {
      if (d1Month < d2Month) {
        return 1;
      } else if (d1Month > d2Month) {
        return -1;
      } else if (d1Month === d2Month) {
        if (d1Day < d2Day) {
          return 1;
        } else if (d1Day > d2Day) {
          return -1;
        } else if (d1Day === d2Day) {
          return 0;
        }
      }
    }
  }
}




