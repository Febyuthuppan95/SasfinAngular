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
import { CompanyService, SelectedCompany, SelectedClaimReport } from 'src/app/services/Company.Service';
import { ServicesService } from 'src/app/services/Services.Service';
import { Router } from '@angular/router';
import { GetCompanyServiceClaims } from 'src/app/models/HttpRequests/GetCompanyServiceClaims';
import { CompanyServiceClaimsListResponse, CompanyServiceClaim } from 'src/app/models/HttpResponses/CompanyServiceClaimsListResponse';
import { GetPermitsByDate } from 'src/app/models/HttpRequests/GetPermitsByDate';
import { PermitsByDateListResponse, PermitByDate } from 'src/app/models/HttpResponses/PermitsByDateListResponse';
import { GetSAD500LinesByPermits } from 'src/app/models/HttpRequests/GetSAD500LinesByPermits';
import { SAD500LinesByPermit, SAD500LinesByPermitResponse } from 'src/app/models/HttpResponses/SAD500LinesByPermitResponse';
import { SAD500Line } from 'src/app/models/HttpResponses/SAD500Line';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { GetServiceClaimReports } from 'src/app/models/HttpRequests/GetServiceClaimReports';
import { ServiceClaimReportsListResponse, ServiceClaimReport } from 'src/app/models/HttpResponses/ServiceClaimReportsListResponse';
import { MatDialog } from '@angular/material';
import { PreviewReportComponent } from 'src/app/components/preview-report/preview-report.component';

@Component({
  selector: 'app-view-company-serviceclaim-report',
  templateUrl: './view-company-serviceclaim-report.component.html',
  styleUrls: ['./view-company-serviceclaim-report.component.scss']
})
export class ViewCompanyServiceclaimReportComponent implements OnInit {

  constructor(
    private companyService: CompanyService,
    private ServiceService: ServicesService,
    private userService: UserService,
    private themeService: ThemeService,
    private IMenuService: MenuService,
    private router: Router,
    private snackbarService: HelpSnackbar,
    private dialog: MatDialog
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
    companyServiceClaimNumber: number,
    serviceName: string,
  };

  tableHeader: TableHeader = {
    title: `Reports`,
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
      title: 'Report',
      propertyName: 'reportName',
      order: {
        enable: true,
        tag: 'ReportName'
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
      propertyName: 'compnayServiceClaimNumber',
      order: {
        enable: true,
        tag: 'CompanyServiceClaimNumber'
      }
    },
    {
      title: 'Start Date',
      propertyName: 'startDate',
      order: {
        enable: true,
        tag: 'StartDate'
      }
    },
    {
      title: 'End Date',
      propertyName: 'endDate',
      order: {
        enable: true,
        tag: 'EndDate'
      }
    },
    {
      title: 'Status',
      propertyName: 'reportQueueStatus',
      order: {
        enable: true,
        tag: 'ReportQueueStatus'
      }
    }
  ];

  selectedRow = -1;

  permitsByDate = new FormControl();
  ServiceClaimReports: ServiceClaimReport[] = [];
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
  companyServiceID = 0;
  ServiceID = 0;
  serviceName = '';
  companyServiceClaimID = 0;
  permitslist = [];
  startdate: Date;
  enddate: Date;
  complete = false;

  ngOnInit() {

    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.companyService.observeClaimReport().subscribe((obj: SelectedClaimReport) => {
      this.companyID = obj.companyID;
      this.companyName = obj.companyName;
      this.companyServiceID = obj.companyServiceID;
      this.companyServiceClaimID = obj.claimNumber;
      this.ServiceID = obj.serviceId;
      this.serviceName = obj.serviceName;

      this.tableHeader.title = `${ this.companyName } - Reports`;
    });



    this.loadServiceClaimReports(true);
  }

  loadServiceClaimReports(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;

    const model: GetServiceClaimReports = {
      userID: this.currentUser.userID,
      companyServiceClaimID: this.companyServiceClaimID,
      filter: this.filter,
      companyID: this.companyID,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
    this.companyService.getServiceClaimReports(model).then(
      (res: ServiceClaimReportsListResponse) => {
        console.log(res);
        if (res.outcome.outcome === 'SUCCESS') {
          
          if (displayGrowl) {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage);
          }
        }
        this.ServiceClaimReports = res.companyServiceClaimReports;
        this.ServiceClaimReports.forEach((x:ServiceClaimReport) => {
          x.companyServiceClaimID = this.companyServiceClaimID;
        });
        console.log(this.ServiceClaimReports);
        if (res.rowCount === 0) {
          this.noData = true;
          this.showLoader = false;
        } else {
          this.noData = false;
          this.rowCount = res.rowCount;
          this.showingRecords = res.companyServiceClaimReports.length;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.ServiceClaimReports.length - 1;
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
    this.loadServiceClaimReports(false);
  }

  searchBar() {
    this.rowStart = 1;
    this.loadServiceClaimReports(false);
  }


  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadServiceClaimReports(false);
  }

  popClick(event, obj) {
    this.ServiceClaim = obj;
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;
    this.themeService.toggleContextMenu(!this.contextMenu);
    this.contextMenu = true;
  }

  back() {
    this.router.navigate(['companies', 'serviceclaims']);
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
    this.loadServiceClaimReports(true);
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadServiceClaimReports(false);
  }

  previewreport(reportid) {

    console.log(reportid);

    this.dialog.open(PreviewReportComponent, {
      width: '70%',
      height: '80%',
      data: {
        type: 'pdf',
        src: 'your-path-here'
      }
    });

    const model = {
      userID: this.currentUser.userID,
      filter: this.filter,
      reportID: reportid,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
    this.companyService.prieviewReport(model).then(
      (res: ServiceClaimReportsListResponse) => {
        if (res.outcome.outcome === 'SUCCESS') {
          this.dialog.open(PreviewReportComponent, {
            width: '80%',
            height: '90%',
            data: {
              type: 'pdf',
              src: 'your-path-here'
            }
          });
        } else {
          this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
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

  regenerate(reportid) {
    console.log(reportid);

    const model = {
      userID: this.currentUser.userID,
      filter: this.filter,
      reportID: reportid,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
    this.companyService.regenerateReport(model).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.notify.successmsg(res.outcome, res.outcomeMessage);
        } else {
          this.notify.errorsmsg(res.outcome, res.outcomeMessage);
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

  exceldownload(reportid) {
    console.log(reportid);

    const model = {
      userID: this.currentUser.userID,
      filter: this.filter,
      reportID: reportid,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
    this.companyService.downloadReport(model).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.notify.successmsg(res.outcome, res.outcomeMessage);
        } else {
          this.notify.errorsmsg(res.outcome, res.outcomeMessage);
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
}
