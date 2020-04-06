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
  permitsByDate = new FormControl();
  CompanyServiceClaims: CompanyServiceClaim[] = [];
  Permits: Permit[] = [];
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
  /* Claims Modal*/
  importComponents: ImportComponent[] = [
    {
      data: {
        code: 'IMP8008',
        importQuantity: 1,
        exportQuantity: 0,
        totalDuty: 340,
        totalShortfallQuantity: 10
      },
      shortfallImports: [] = [
        // {
        //   itemID: 1,
        //   captureJoinLineID: 1,
        //   code: '999PLKJ',
        //   hsQuantity: 20,
        //   customsValue: 1,
        //   duty: 345,
        //   isImport: true,
        //   status: 'string',
        //   statusID: 1
        // }
      ],
      exports: [] = [
        // {
        //   itemID: 1,
        //   captureJoinLineID: 1,
        //   code: 'ABC1001',
        //   hsQuantity: 30,
        //   customsValue: 1,
        //   duty: 100,
        //   isImport: false,
        //   status: 'string',
        //   statusID: 1
        // }
      ]
    },
    {
      data: {
        code: 'IMP8009',
        importQuantity: 200,
        exportQuantity: 0,
        totalDuty: 5640,
        totalShortfallQuantity: 0
      },
      shortfallImports: [] = [
        // {
        //   itemID: 1,
        //   captureJoinLineID: 1,
        //   code: '999PLKJ',
        //   hsQuantity: 20,
        //   customsValue: 1,
        //   duty: 345,
        //   isImport: true,
        //   status: 'string',
        //   statusID: 1
        // }
      ],
      exports: [] = [
        // {
        //   itemID: 1,
        //   captureJoinLineID: 1,
        //   code: 'ABC1001',
        //   hsQuantity: 30,
        //   customsValue: 1,
        //   duty: 100,
        //   isImport: false,
        //   status: 'string',
        //   statusID: 1
        // }
      ]
    }
  ];
  selectProducts: Product[] = [
    {rowNum: 1, itemID: -1, captureJoinLineID: -1, code: 'ProdCode001', totalExportQuantity: 100, quantityExported: 100, quantityPer: 1, isImport: false},
    {rowNum: 2, itemID: -1, captureJoinLineID: -1, code: 'ProdCode002', totalExportQuantity: 100, quantityExported: 100, quantityPer: 1, isImport: false},
    {rowNum: 3, itemID: -1, captureJoinLineID: -1, code: 'ProdCode003', totalExportQuantity: 100, quantityExported: 100, quantityPer: 1, isImport: false},
    {rowNum: 4, itemID: -1, captureJoinLineID: -1, code: 'ProdCode004', totalExportQuantity: 100, quantityExported: 100, quantityPer: 1, isImport: false},
  ] 
  displayedColumns: string[] = ['rowNum', 'prodCode', 'quantityPer', 'exportedQuantity', 'totalExportedQuantity', 'select'];
  dataSource = new MatTableDataSource<Product>(this.selectProducts);
  selection = new SelectionModel<Product>(true, []);

  length = 100;
  pageSize = 5;
  pageSizeOptions: number[] = [5];
  pageEvent: PageEvent;

  /*Claims Params*/
  claimRequestParams: {
    lookbackDays: number;
    extensionsDays: number;
    exportStartDate: Date | string;
    exportEndDate: Date | string;
    selectedPermits: number[];
    claimDate: Date | string;
  };
 selectedCompanyServiceClaimID: number;

 
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
  checkboxLabel(row?: Product): string {
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
  generateClaimRequest(serviceType?: number, requestType?: string, model?: object) {
    switch (serviceType)
    {
      case 1: //521
      if (requestType === 'read') {

      }

      break;
    }
    
  }
  loadClaimRequestData($model: object) {
    const reqP: ServiceClaimReadRequest = {
      lookbackDays: this.claimRequestParams.lookbackDays,
      exportStartDate: this.claimRequestParams.exportStartDate,
      exportEndDate: this.claimRequestParams.exportEndDate,
      claimDate: this.claimRequestParams.claimDate,
      extensionDays: this.claimRequestParams.extensionsDays,
      companyServiceClaimID: this.selectedCompanyServiceClaimID,
      rowStart: this.pageEvent.pageIndex * this.pageSize + 1,
      rowEnd: this.rowStart + this.pageSize - 1,
      filter: '',
      orderBy: '',
      rowCount: -1,
      orderByDirection: '',
      permits: this.claimRequestParams.selectedPermits 
    };
    const model = {
      requestParams: reqP,
      requestProcedure: 'ImportsList'
    };
    this.ServiceService.readServiceClaim(model).then(
      (res: object) => {
        console.log(res);
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

export class ImportComponent {
  data: ComponentData;
  exports: Product[];
  shortfallImports: Product[];
}

export class ComponentData {
  code: string;
  importQuantity: number;
  exportQuantity: number;
  totalDuty: number;
  totalShortfallQuantity: number;
}
// (ComponentCode, ProductCode, QuarterID, Period, TEQuantity, QuantityExported, QuantityPer)
export class Product {
  rowNum: number;
  itemID?: number;
  captureJoinLineID?: number;
  code: string;
  totalExportQuantity: number;
  quantityExported: number;
  quantityPer: number;
  customsValue?: number;
  duty?: number;
  isImport: boolean;
  status?: string;
  statusID?: number;
}





