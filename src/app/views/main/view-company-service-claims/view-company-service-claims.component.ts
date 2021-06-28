import { CompanyServiceClaim } from './../../../models/HttpResponses/CompanyServiceClaimsListResponse';
import { Component, OnInit, ViewChild, ElementRef, ɵConsole } from '@angular/core';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/services/Menu.Service';
import { Pagination } from '../../../models/Pagination';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { UserService } from '../../../services/user.Service';
import { User } from '../../../models/HttpResponses/User';
import { ThemeService } from 'src/app/services/theme.Service';
import {SnackbarModel} from '../../../models/StateModels/SnackbarModel';
import {HelpSnackbar} from '../../../services/HelpSnackbar.service';
import { TableHeading, SelectedRecord, Order, TableHeader } from 'src/app/models/Table';
import { CompanyService, SelectedCompany, AddComanyServiceClaimResponse } from 'src/app/services/Company.Service';
import { ServicesService, ServiceClaimReadRequest } from 'src/app/services/Services.Service';
import { Router } from '@angular/router';
import { GetCompanyServiceClaims } from 'src/app/models/HttpRequests/GetCompanyServiceClaims';
import { CompanyServiceClaimsListResponse } from 'src/app/models/HttpResponses/CompanyServiceClaimsListResponse';
import { GetPermitsByDate } from 'src/app/models/HttpRequests/GetPermitsByDate';
import { PermitsByDateListResponse, PermitByDate } from 'src/app/models/HttpResponses/PermitsByDateListResponse';
import { GetSAD500LinesByPermits } from 'src/app/models/HttpRequests/GetSAD500LinesByPermits';
import { SAD500LinesByPermit, SAD500LinesByPermitResponse } from 'src/app/models/HttpResponses/SAD500LinesByPermitResponse';
import { isEmpty } from 'rxjs/operators';
import { SAD500Line } from 'src/app/models/HttpResponses/SAD500Line';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { NgbModalWindow } from '@ng-bootstrap/ng-bootstrap/modal/modal-window';
import { R3ComponentMetadata } from '@angular/compiler';
import { SelectionModel } from '@angular/cdk/collections';
import { GetCompanyPermits } from 'src/app/models/HttpRequests/GetCompanyPermits';
import { CompanyPermitsListResponse, Permit, ClaimPermit } from 'src/app/models/HttpResponses/CompanyPermitsListResponse';
import { CompanyServiceResponse, CompService } from 'src/app/models/HttpResponses/CompanyServiceResponse';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { UUID } from 'angular2-uuid';

import { UpdateResponse } from 'src/app/layouts/claim-layout/claim-layout.component';
import { CompanyOEMList, CompanyOEM } from '../view-company-list/view-company-oem-list/view-company-oem-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-company-service-claims',
  templateUrl: './view-company-service-claims.component.html',
  styleUrls: ['./view-company-service-claims.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewCompanyServiceClaimsComponent implements OnInit {

  constructor(
    private companyService: CompanyService,
    //private ServiceService: ServicesService,
    private userService: UserService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private claimService: ServicesService,
    private IMenuService: MenuService,
    private router: Router,
    private snackbarService: HelpSnackbar,
    private transactionService: TransactionService
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
    this.lookBackDays.push(
      {value: 180},
      {value: 270},
      {value: 360},
      {value: 540},
      {value: 730}
      );
    this.extensionDays.push(
      {value: 10},
      {value: 11},
      {value: 12},
      {value: 13},
      {value: 14},
      {value: 15}
      );
    /* Claims Modal Data*/
    // Init with dummy 1
    const fullYear = new Date().getFullYear();
    const fullmonth = new Date().getMonth();


    this.minClaimDate = new Date();
    this.selectedClaimDate = this.minClaimDate;
    this.ServiceClaim = {
      companyServiceID: -1,
      companyServiceClaimNumber: 0,
      serviceName: ''
    };
  }

  removable = true;
  @ViewChild(NotificationComponent, { static: false })
  private notify: NotificationComponent;

  @ViewChild('openPopulateModal', {static: false})
  openPopulateModal: ElementRef;
  @ViewChild('closePopulateModal', {static: false})
  closePopulateModal: ElementRef;

  @ViewChild('openCreateModal', {static: false})
  openCreateModal: ElementRef;
  @ViewChild('closeCreateModal', {static: false})
  closeCreateModal: ElementRef;
  @ViewChild('openCreate522Modal', {static: false})
  openCreate522Modal: ElementRef;
  @ViewChild('closeCreate522Modal', {static: false})
  closeCreate522Modal: ElementRef;

  @ViewChild('openPermitModal', {static: false})
  openPermitModal: ElementRef;
  @ViewChild('closePermitModal', {static: false})
  closePermitModal: ElementRef;

  @ViewChild('openReportsModal', {static: false})
  openReportsModal: ElementRef;
  @ViewChild('closeReportsModal', {static: false})
  closeReportsModal: ElementRef;

  @ViewChild('myInput', { static: false })
  myInputVariable: ElementRef;



  tableHeader: TableHeader = {
    title: `Service Claims`,
    addButton: {
     enable: true,
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
      title: 'User Claim Number',
      propertyName: 'userClaimNumber',
      order: {
        enable: true,
        tag: 'UserClaimNumber'
      }
    },
    {
      title: 'Company Service Claim Number',
      propertyName: 'companyServiceClaimNumber',
      order: {
        enable: true,
        tag: 'CompanyServiceClaimNumber'
      }
    },
    {
      title: 'Status',
      propertyName: 'status',
      order: {
        enable: true,
        tag: 'status'
      }
    }
  ];


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
  companyServiceClaimPermits: ClaimPermit[] = [];
  submissiondate: Date;
  complete = false;
  companyServiceList: CompService[] = [];
  loadingData = false;
  loadingImportData = false;
  focusImport: Import;

  selectable = false;
  // Generate Company Service
  selectedCompanyServiceID = -1;
  selectedCompanyServiceIDControl = new FormControl(-1);
  selectedClaimDate: Date = new Date();
  ClaimNumber: string;
  ServiceClaim: {
    companyServiceID: number,
    companyServiceClaimNumber: number,
    serviceName: string,
    transactionID?: number,
    status?: string;
    serviceID?: number;
    permitCount?: number;

  };
  claimForm = {
    exportStartDate: {
      valid: true,
      error: ''
    },
    exportEndDate: {
      valid: true,
      error: ''
    },

  };
  selectedRow = -1;
  lookBackDays = [];
  extensionDays = [];
  selectedExtensionDays = 15;
  exportStartDate = new Date();
  exportEndDate = new Date();
  claimPermits: [];
  permitsByDate = new FormControl();
  CompanyServiceClaims: CompanyServiceClaim[];
  Permits: Permit[] = [];

  SAD500Lines: SAD500LinesByPermit[] = [];
  SAD500SelectedLines = [];
  isChecked: boolean;

  importComponents: Import[];
  selectProducts: Export[];
  availableExports: Export[] = [];
  assignedExports: ExportLine[] = [];
  displayedColumns: string[] = ['rowNum', 'prodCode', 'quantityPer', 'exportedQuantity', 'totalExportedQuantity', 'select'];

  selection = new SelectionModel<Export>(true, []);

  length = 100;
  pageSize = 5;
  pageSizeOptions: number[] = [5];
  pageEvent: PageEvent;
  claimRequestParams: FormGroup;
  selectedCompanyServiceClaimID: number;

  minClaimDate = new Date();
  /* Claims Modal*/
  dataSource = new MatTableDataSource<Export>(this.availableExports);
  eDataSource = new MatTableDataSource<ExportLine>(this.assignedExports);

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
    this.loadCompanyPermits();
    this.loadCompanyServices();


  }

  submit522() {
    this.openCreate522Modal.nativeElement.click();
  }
  submit522Claim() {
    this.showLoader = true;
    // console.log('Updating claim params..');
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        claimDate: this.selectedClaimDate,
        companyServiceClaimID: this.ServiceClaim.companyServiceClaimNumber,
        companyID: this.companyID
      },
      requestProcedure: `CompanyServiceClaimsUpdate`
    };
    console.log('model');
    console.log(model);
    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/update/claim`, model).then(
      (res: UpdateResponse ) => {
        this.closeCreate522Modal.nativeElement.click();
        this.updateClaimStatus();
      },
      msg => {
        this.showLoader = false;
        this.notify.errorsmsg(
          'Server Error 623.3',
          'Something went wrong while trying to access the server.'
        );
      }
    );

  }
  remove($event: ClaimPermit) {
    console.log($event);
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        companyServiceClaimPermitID: $event.CompanyServiceClaimPermitID,
        companyServiceClaimID: this.ServiceClaim.companyServiceClaimNumber,
        permitID: $event.PermitID,
        isDeleted: true
      },
      requestProcedure: 'CompanyServiceClaimPermitsUpdate'
    };

    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/update/permit`, model).then(
      (res: any) => {
        this.loadServiceClaims(false);
        this.loadCompanyServiceClaimPermits();
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

  removeClaim($event) {
    console.log($event);
    console.log("remove");
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        companyServiceClaimID: $event,
        isDeleted: 1
      },
      requestProcedure: 'CompanyServiceClaimsUpdate'
    };
    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/update/claim`, model).then(
      (res: any) => {
        console.log(res);
        this.loadServiceClaims(false);
        this.loadCompanyServiceClaimPermits();
      }
    )

  }

  loadCompanyServiceClaimPermits() {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        companyServiceClaimID: this.ServiceClaim.companyServiceClaimNumber,
        rowStart: 1,
        rowEnd: 10
      },
      requestProcedure: 'CompanyServiceClaimPemitsList'
    };
    // console.log(model);
    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/536/read`, model).then(
      (res: any) => {
        console.log(res);

        this.companyServiceClaimPermits = res.data;

        console.log('Permits');
        console.log(this.Permits);
        console.log(this.companyServiceClaimPermits);

        if ( this.companyServiceClaimPermits.length > 0) {
          this.companyServiceClaimPermits.forEach((item) => {

            const find = this.Permits.find(x => x.permitID == item.PermitID);

            if (find) {
              this.Permits.splice(this.Permits.indexOf(find), 1);
            }

          });
        }
        if (res.outcome.outcome === 'SUCCESS') {

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
  updateClaimStatus() {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        companyServiceClaimID: this.ServiceClaim.companyServiceClaimNumber,
        statusID: 2
      },
      requestProcedure: 'UpdateCompanyServiceClaimStatus'
    };
    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/update/status`, model).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.loadServiceClaims(true);
        }
      },
      msg => {
        this.showLoader = false;
        this.notify.errorsmsg(
          'Server Error 623.2',
          'Something went wrong while trying to access the server.'
        );
      }

    );
  }
  loadCompanyServices() {
    const model = {
      userID: this.currentUser.userID,
      specificCompanyID: this.companyID,
      specificServiceID: -1,
      filter: '',
      orderBy: '',
      orderByDirection: '',
      rowStart: 1,
      rowEnd: 1000
    };
    this.companyService.service(model).then(
      (res: CompanyServiceResponse) => {
        // console.log(res);
        if (res.outcome.outcome === 'SUCCESS') {
          this.companyServiceList = res.services;
        } else {
          // error
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
        console.log('res claims');
        console.log(res);
        if (res.outcome.outcome === 'SUCCESS') {
          if (displayGrowl) {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage);
          }
        }
        this.rowCount = res.rowCount;
        this.CompanyServiceClaims = res.serviceClaims;

        console.log('CompanyServiceClaims');
        console.log(this.CompanyServiceClaims);

        if (res.rowCount === 0) {
          this.noData = true;
          this.showLoader = false;
        } else {
          this.noData = false;
          this.showingRecords = this.CompanyServiceClaims.length;
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
    // console.log(event);
    this.Permits = null;
    this.loadCompanyPermits();
    this.companyServiceClaimPermits = null;
    this.loadCompanyServiceClaimPermits();
    if (this.ServiceClaim.serviceName === '522') {
      this.ServiceClaim.transactionID = this.getTransactionID();
    }
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;
    this.themeService.toggleContextMenu(!this.contextMenu);
    this.contextMenu = true;
  }

  back() {
    this.router.navigate(['companies']);
  }

  selectedRecord(obj: SelectedRecord) {
    // console.log(obj);

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
    console.log('event');
    console.log($event);
     this.myInputVariable.nativeElement.value = null;

     this.openPopulateModal.nativeElement.click();

     // this.router.navigate()
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
  }

  createCompanyServiceSelected(companyServiceID, name) {

    this.selectedCompanyServiceID = companyServiceID;
    this.ServiceClaim.serviceName = this.companyServiceList.find(x => x.componyServiceID === companyServiceID).serviceName;

    // console.log(this.ServiceClaim.serviceName);

  }

  sad500selected(checked) {
    this.SAD500SelectedLines = [];

    checked.forEach(c => {
      this.SAD500SelectedLines.push(c.value);
    });
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


 setPageSizeOptions(setPageSizeOptionsInput: string) {
  if (setPageSizeOptionsInput) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }
}
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}
checkboxLabel(row?: Export): string {
  if (!row) {
    return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.rowNum + 1}`;
}
masterToggle() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
}
addServiceClaim() {
  this.openCreateModal.nativeElement.click();
}
createCompanyServiceClaim() {
  const model = {
    userID: this.currentUser.userID,
    companyServiceID: this.selectedCompanyServiceID,
    claimNumber: this.ClaimNumber,
    claimDate: this.selectedClaimDate || null
  };
  // console.log(model);
  this.companyService.addCompanyServiceClaim(model).then(
    (res: AddComanyServiceClaimResponse) => {
      this.ServiceClaim.companyServiceClaimNumber = res.companyServiceClaimID;
     //  console.log(this.ServiceClaim);
      if (res.outcome.outcome === 'SUCCESS') {
        // console.log(this.ServiceClaim.serviceName);
        if (this.ServiceClaim.serviceName === '522') {
          this.closeCreateModal.nativeElement.click();
          this.create522Transaction();
        } else {
          this.closeCreateModal.nativeElement.click();
          this.notify.successmsg(
            res.outcome.outcome,
            res.outcome.outcomeMessage
          );
          this.loadServiceClaims(true);
        }

      } else {
        this.notify.errorsmsg(
          res.outcome.outcome,
          res.outcome.outcomeMessage
        );
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
create522Transaction() {
 // console.log(`522-${new Date().toLocaleString()}`);

  this.transactionService.createdTransaction(
    this.currentUser.userID,
    this.companyID,
    2,
    1,
    `522-${new Date().toLocaleString()}`
  ).then(
    (res: Outcome) => {
      if (res.outcome === 'SUCCESS') {

        const transactionID =  this.getTransactionID();
        this.companyService.setCompany({
        companyID: this.companyID,
        companyName: this.companyName,
        selectedTransactionID:  transactionID
        });

        if (transactionID > 0) {
        this.router.navigate(['transaction', 'attachments']);
        } else {
            this.router.navigate(['companies', 'transactions']);
        }

      } else {
        this.notify.errorsmsg(
          res.outcome,
          res.outcomeMessage
        );
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
// createCertificate() {
//   const model = {
//     requestParams: {
//       userID: this.currentUser.userID,
//       companyServiceClaimID: this.ServiceClaim.companyServiceClaimNumber,
//       periodYear: this.focusPeriodYear,
//       quarterID: this.focusPeriodQuarter,
//       oemCompanyID: this.focusOEMID
//     },
//     requestProcedure: 'CompanyServiceClaimParameterAdd'
//   };
//   this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/538/update`, model).then(
//     (res: Outcome) => {
//       if(res.outcome === 'SUCCESS') {
//         this.closeCreateModal.nativeElement.click();
//         this.notify.successmsg(
//           'Success',
//           `Claim Successfully Created`
//         );
//       } else {
//         this.notify.errorsmsg(
//           'Failure',
//           'Could not create the claim'
//         );
//       }
//     },
//     msg => {
//       this.notify.errorsmsg(
//         'Server Error',
//         'Something went wrong while trying to access the server.'
//       );
//     }
//   );
// }
getTransactionID(): number {
  const model = {
    requestParams: {
      userID: this.currentUser.userID,
      companyServiceClaimID: this.ServiceClaim.companyServiceClaimNumber
    },
    requestProcedure: 'CompanyServiceClaimParametersList'
  };
  this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/536/read`, model).then(
    (res: any) => {
      return res.data[0].TransactionID;
    }
  );
  return 0;
}
addCompanyServiceClaimPermits() {
  console.log(this.permitslist);

  if (this.permitslist.length === 0) {
    // error
  }

  let successCount = 0;
  this.permitslist.forEach(x => {
    // Save each permit
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        companyServiceClaimID: this.ServiceClaim.companyServiceClaimNumber,
        permitID: x
      },
      requestProcedure: 'CompanyServiceClaimPermitAdd'
    };
    console.log('model');
     console.log(model);
    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/addClaimPermit`, model).then(
      (res: Outcome) => {
        console.log(res);
        if (res.outcome === 'SUCCESS') {
          successCount++;
        }
        this.closePermitModal.nativeElement.click();
        if (successCount === this.permitslist.length) {
          this.loadServiceClaims(false);
          this.notify.successmsg(
            'Success',
            `Added ${successCount} permits to claim`
          );
        }
      },
      (msg) => {
        this.notify.errorsmsg(
          'Server Error',
          'Something went wrong while trying to access the server.'
        );
      }
    );
  });
  // if (successCount === this.permitslist.length) {
  //     this.claimService.setCompanyClaim({
  //     companyID: this.companyID,
  //     companyName: this.companyName,
  //     serviceID: this.ServiceClaim.serviceID,
  //     serviceName: this.ServiceClaim.serviceName,
  //     companyServiceClaimID: this.ServiceClaim.companyServiceClaimNumber,
  //     claimStatus: 'Active'
  //   });
  //   this.router.navigate(['claim','capture']);
  // }


}
openAddClaimPermits($event) {
  this.loadCompanyServiceClaimPermits();
  this.permitsByDate.reset(null);
  this.openPermitModal.nativeElement.click();
}

loadCompanyPermits() {
  const model: GetCompanyPermits = {
    userID: this.currentUser.userID,
    filter: this.filter,
    permitID: -1,
    companyID: this.companyID,
    rowStart: this.rowStart,
    rowEnd: 10000000,
    orderBy: this.orderBy,
    orderByDirection: this.orderDirection
  };
  this.companyService.getCompanyPermits(model).then(
    (res: CompanyPermitsListResponse) => {

      if (res.outcome.outcome === 'SUCCESS') {
       this.Permits = res.permits;
      }
    },
    msg => {
      this.showLoader = false;
      this.notify.errorsmsg(
        'Server Error 623.1',
        'Something went wrong while trying to access the server.'
      );
    }
  );
}
//




}
export class Import {
  rowNum: number;
  itemID: number;
  itemName: number;
  cjid: number;
  totDuty: number;
  exportQuantity?: number;
  availHSQuantity?: number;
  totalShortfallQuantity?: number;
  totHSQuantity?: number;
  availDuty: number;
  importDate: Date | string;
  mrn?: string;
}

export class ClaimImportComponents {
  imports: Import[];
  rowCount: number;
  outcome: Outcome;
}
// export class ImportComponent {
//   data: ComponentData;
//   exports: Product[];
//   shortfallImports: Product[];
// }

export class ComponentData {
  code: string;
  importQuantity: number;
  exportQuantity: number;
  totalDuty: number;
  totalShortfallQuantity: number;
  // componentElements: ComponentImportElement[];

}
export class ComponentImportElement {

}
// (ComponentCode, ProductCode, QuarterID, Period, TEQuantity, QuantityExported, QuantityPer)
export class ExportListResponse {
  exports: Export[];
  rowCount: number;
  outcome: Outcome;
}
export class ExportLinesResponse {
  lines: ExportLine[];
  rowCount: number;
  outcome: Outcome;
}
export class Export {
  rowNum: number;
  itemID?: number;
  prodName: string;
  expQuantity: number;
  totQuantity: number;
  quantityPer: number;
  cjid?: number;
  availExportQuantity: number;
  exportDate: Date | string;
  mrn?: string;
}

export class ExportLine {
  rowNum: number;
  itemID?: number;
  prodName: string;
  totalExportUnits: number;
  supplyUnit: number;
  quantity: number;
  captureJoinExportID?: number;
  captureJoinImportID: number;
  mrn?: string;
}

// New Classes
export class newComponentItem {
    itemID: number;
    componentCode: string;
    importQuantity: number;
    exportQuantity: number;
    totalDuty: number;
    totalShortfallQuantity: number;
    mrn?: string;
 }

export class newImportComponent {
   captureJoinID: number;
   mrn: string;
   hsQuantity: number;
   supplyUnit: number;
   duty: number;
 }





