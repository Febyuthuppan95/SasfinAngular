import { Component, OnInit, ViewChild, ElementRef, ɵConsole } from '@angular/core';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
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
import { CompanyService, SelectedCompany, AddComanyServiceClaimResponse } from 'src/app/services/Company.Service';
import { ServicesService, ServiceClaimReadRequest } from 'src/app/services/Services.Service';
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
import { R3ComponentMetadata } from '@angular/compiler';
import { MatTableDataSource, PageEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { GetCompanyPermits } from 'src/app/models/HttpRequests/GetCompanyPermits';
import { CompanyPermitsListResponse, Permit } from 'src/app/models/HttpResponses/CompanyPermitsListResponse';
import { CompanyServiceResponse, CompService } from 'src/app/models/HttpResponses/CompanyServiceResponse';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

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
    private ServiceService: ServicesService,
    private userService: UserService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
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
      const fullmonth = new Date().getMonth()

      this.minClaimDate = new Date(new Date().getFullYear(),new Date().getMonth(), new Date().getDate() + 7);
      this.selectedClaimDate = this.minClaimDate;

  }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild('openPopulateModal', {static: true})
  openPopulateModal: ElementRef;
  @ViewChild('closePopulateModal', {static: true})
  closePopulateModal: ElementRef;

  @ViewChild('openCreateModal', {static: true})
  openCreateModal: ElementRef;
  @ViewChild('closeCreateModal', {static: true})
  closeCreateModal: ElementRef;
  @ViewChild('openPermitModal', {static: true})
  openPermitModal: ElementRef;
  @ViewChild('closePermitModal', {static: true})
  closePermitModal: ElementRef;

  @ViewChild('openReportsModal', {static: true})
  openReportsModal: ElementRef;
  @ViewChild('closeReportsModal', {static: true})
  closeReportsModal: ElementRef;

  @ViewChild('myInput', { static: true })
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
      title: 'Company Service Claim Number',
      propertyName: 'companyServiceClaimNumber',
      order: {
        enable: true,
        tag: 'CompanyServiceClaimNumber'
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
  submissiondate: Date;
  complete = false;
  companyServiceList: CompService[] =[];
  loadingData = false;
  loadingImportData = false;
  focusImport: Import;
  /* Claims Modal*/


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
  initClaimForm() {
    console.log(this.ServiceClaim);
    this.exportStartDate = new Date('1 JAN 2019');
    console.log(this.exportStartDate);
    this.claimRequestParams = this.formBuilder.group({
      lookbackDays: [this.ServiceClaim.lookBackDays, { validators: [Validators.required] , updateOn: 'blur'}],
      extensionDays: [this.ServiceClaim.extensionDays, { validators: [Validators.required] , updateOn: 'blur'}],
      exportStartDate: [this.ServiceClaim.exportStartDate, { validators: [Validators.required] , updateOn: 'blur'}],
      exportEndDate: [this.ServiceClaim.exportEndDate, { validators: [Validators.required] , updateOn: 'blur'}],
      selectedPermits: [this.claimPermits, { validators: [Validators.required] , updateOn: 'blur'}],
      claimDate: [this.selectedClaimDate, { validators: [Validators.required] , updateOn: 'blur'}]
    })
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
        if(res.outcome.outcome ==='SUCCESS') {
          this.companyServiceList = res.services
        } else {
          //error
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
        console.log(res);
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
  loadImportData(component: Import) {
    this.loadingImportData = true;
    console.log(component);
    this.focusImport = component;
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        itemID: this.focusImport.itemID,
        companyServiceClaimID: this.ServiceClaim.companyServiceClaimNumber,
        rowStart: 1,
        rowEnd: 100
      },
      requestProcedure: "ExportList"
    };
    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/read/exports`, model).then(
      (res: ExportListResponse) => {
        if (res.outcome.outcome === 'SUCCESS') {
          this.availableExports = res.exports;
          console.log(this.availableExports);
          this.loadAssignedData(component);
        }
      }
    );
  }
  removeExportline(component: Import, element:ExportLine) {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
          companyServiceClaimID: this.ServiceClaim.companyServiceClaimNumber,
          captureJoinImportID: element.captureJoinImportID,
          captureJoinExportID: element.captureJoinExportID,
          isDeleted: 1
      },
      requestProcedure: "CompanyServiceClaimLineUpdate"
    };
    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/update/line`, model).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.loadImportData(component);
        }
      }
    );
    }
    updateClaimStatus() {
      const model ={
        requestParams: {
          userID: this.currentUser.userID,
          companyServiceClaimID: this.ServiceClaim.companyServiceClaimNumber,
          statusID: 2
        },
        requestProcedure: "UpdateCompanyServiceClaimStatus"
      };
      this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/update/status`, model).then(
        (res: Outcome) => {
          if (res.outcome === 'SUCCESS') {
            this.closePopulateModal.nativeElement.click();
          }
        }
      );
    }
  addExportline(component: Import, element:Export) {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
          companyServiceClaimID: this.ServiceClaim.companyServiceClaimNumber,
          captureJoinImportID: component.cjid,
          captureJoinExportID: element.cjid
      },
      requestProcedure: "CompanyServiceClaimLineAdd"
    };
    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/addClaimLine`, model).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.loadImportData(component);
        }
      }
    );
  }
  loadAssignedData(component: Import) {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        companyServiceClaimID: this.ServiceClaim.companyServiceClaimNumber,
        captureJoinImportID: component.cjid,
        rowStart: 1,
        rowEnd: 100,
        filter: "",
        orderBy: "TransactionID",
        orderByDirection: "DESC"
      },
      requestProcedure: "CompanyServiceClaimLineList"
    };
    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/read/lines`, model).then(
      (res: ExportLinesResponse) => {
        console.log(res);
        this.loadingImportData = false
        this.assignedExports = res.lines;
        // remove asssinged from available
        component.exportQuantity =0;
        component.totalShortfallQuantity =0;
        this.assignedExports.forEach((y:ExportLine) => {
          component.exportQuantity += y.totalExportUnits;

          this.availableExports = this.availableExports.filter(x => x.cjid !== y.captureJoinExportID);
        });
        component.totalShortfallQuantity = component.totHSQuantity - component.exportQuantity;
        // Update Import Totals
        this.importComponents.forEach((x: Import) => {
          if (x.cjid === component.cjid) {
            x = component;
          }
        })
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
     this.initClaimForm();
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
    console.log(permitIDs);
    this.permitslist = permitIDs;
  }
  // Generate Company Service
  selectedCompanyServiceID = -1;
  selectedClaimDate: Date = new Date();
  createCompanyServiceSelected(companyServiceID) {
    this.selectedCompanyServiceID = companyServiceID;
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
            this.loadingData = false;
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
  ServiceClaim: {
    companyServiceID: number,
    companyServiceClaimNumber: number,
    serviceID: number,
    serviceName: string,
    permitCount: number,
    exportStartDate: Date | string,
    exportEndDate: Date | string,
    claimDate: Date | string,
    name: string,
    extensionDays: number,
    lookBackDays: number
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

  }
  selectedRow = -1;
  lookBackDays = [];
  extensionDays = [];
  selectedExtensionDays = 15;
  exportStartDate = new Date();
  exportEndDate = new Date();
  claimPermits: [];
  permitsByDate = new FormControl();
  CompanyServiceClaims: CompanyServiceClaim[] = [];
  Permits: Permit[] = [];

  SAD500Lines: SAD500LinesByPermit[] = [];
  SAD500SelectedLines = [];
  isChecked: boolean;

  importComponents: Import[];
  selectProducts: Export[];
  availableExports: Export[];
  assignedExports: ExportLine[];
  displayedColumns: string[] = ['rowNum', 'prodCode', 'quantityPer', 'exportedQuantity', 'totalExportedQuantity', 'select'];
  dataSource = new MatTableDataSource<Export>(this.availableExports);
  eDataSource = new MatTableDataSource<ExportLine>(this.assignedExports);
  selection = new SelectionModel<Export>(true, []);

  length = 100;
  pageSize = 5;
  pageSizeOptions: number[] = [5];
  pageEvent: PageEvent;
  claimRequestParams: FormGroup;
 selectedCompanyServiceClaimID: number;

 minClaimDate = new Date()


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
toggleSelectedRow(rowNum: number) {
  //When opening or closing or canceling an accordion row
  // have row num
  // If closed: open
  // If opened and !saved: deselect
}
cancelRow() {

}
saveRow() {

}
addServiceClaim() {

  this.openCreateModal.nativeElement.click();
}
createCompanyServiceClaim() {
  const model = {
    userID: this.currentUser.userID,
    companyServiceID: this.selectedCompanyServiceID,
    claimDate: this.selectedClaimDate
  }
  this.companyService.addCompanyServiceClaim(model).then(
    (res: AddComanyServiceClaimResponse) => {
      if (res.outcome.outcome === 'SUCCESS') {

        this.closePopulateModal.nativeElement.click();
        this.loadServiceClaims(true);
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
addCompanyServiceClaimPermits() {
  console.log(this.permitslist.length);
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
      requestProcedure: "CompanyServiceClaimPermitAdd"
    };
    console.log(model);
    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/addClaimPermit`, model).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          successCount++;
        }
        if (successCount === this.permitslist.length) {
          this.closePermitModal.nativeElement.click();
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
  })
}
openAddClaimPermits($event) {
  this.permitsByDate.reset(null);
  this.openPermitModal.nativeElement.click();
}
loadCompanyPermits() {
  const model: GetCompanyPermits = {
    userID: this.currentUser.userID,
    filter: this.filter,
    permitID: -1,
    companyID: 1,
    rowStart: this.rowStart,
    rowEnd: this.rowEnd,
    orderBy: this.orderBy,
    orderByDirection: this.orderDirection
  };
  this.companyService.getCompanyPermits(model).then(
    (res: CompanyPermitsListResponse) => {

      if (res.outcome.outcome === 'SUCCESS') {
       this.Permits = res.permits
       console.log(this.Permits);
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
//
generateClaimRequest() {
 this.updateCompanyServiceClaim();

}
updateCompanyServiceClaim() {
  const model = {
    requestParams: {
      userID: this.currentUser.userID,
      companyServiceClaimID: this.ServiceClaim.companyServiceClaimNumber,
      lookbackDays: this.claimRequestParams.get('lookbackDays').value,
      exportStartDate: this.claimRequestParams.get('exportStartDate').value,
      exportEndDate: this.claimRequestParams.get('exportEndDate').value,
      extensionDays: this.claimRequestParams.get('extensionDays').value,
      claimDate: this.claimRequestParams.get('claimDate').value
    },
    requestProcedure: 'CompanyServiceClaimsUpdate'
  };
  this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/update`, model).then(
    (res: Outcome) => {
      if(res.outcome === 'SUCCESS') {
        this.loadingData = true;
        this.loadClaimRequestData();
      }
    });
  console.log(model);
}
loadClaimRequestData() {
  const reqP = {
    userID: this.currentUser.userID,
      companyServiceClaimID: this.ServiceClaim.companyServiceClaimNumber,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: "",
      orderByDirection: ""
  };
  const model = {
    requestParams: reqP,
    requestProcedure: 'ImportsList'
  };
  this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/read/imports`, model).then(
    (res: ClaimImportComponents) => {
      if (res.outcome.outcome === 'SUCCESS') {
        this.loadingData = false;
        this.importComponents = res.imports;
        this.importComponents.forEach((x: Import) => {
          x.exportQuantity = 0;
          x.totalShortfallQuantity = x.totHSQuantity
        });
      } else {
        this.loadingData = false;
        // error
      }
    },
    (msg) => {

    }
  );
}

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
  importDate: Date | string
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





