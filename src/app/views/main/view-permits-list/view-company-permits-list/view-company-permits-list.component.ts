import { EditPermitDialogComponent } from './edit-permit-dialog/edit-permit-dialog.component';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/services/Menu.Service';
import { ThemeService } from 'src/app/services/theme.Service.js';
import { TableHeading, SelectedRecord, Order, TableHeader } from 'src/app/models/Table';
import { CompanyService, SelectedCompany, SelectedPermitType } from 'src/app/services/Company.Service';
import { ServicesService } from 'src/app/services/Services.Service';
import { Router } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { CompanyPermitsListResponse, Permit, PRCC, EPC, CompanyPRCCsListResponse, CompanyEPCsListResponse } from 'src/app/models/HttpResponses/CompanyPermitsListResponse';
import { GetCompanyPermits } from 'src/app/models/HttpRequests/GetCompanyPermits';
import { UserService } from 'src/app/services/user.Service';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { User } from 'src/app/models/HttpResponses/User';
import { Pagination } from 'src/app/models/Pagination';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { GetCompanyEPCs } from 'src/app/models/HttpRequests/GetCompanyEPCs';
import { GetCompanyPRCCs } from 'src/app/models/HttpRequests/GetCompanyPRCCs';
import { AddCompanyPermitComponent } from './add-company-permit/add-company-permit.component';
import { env } from 'process';
import { environment } from 'src/environments/environment';
import { Tariff, TariffListResponse } from 'src/app/models/HttpResponses/TariffListResponse';
import { GetTariffList } from 'src/app/models/HttpRequests/GetTariffList';
import { UpdateItemResponse } from 'src/app/models/HttpResponses/UpdateItemResponse';
import { RemovePermitsDialogComponent } from './remove-permits-dialog/remove-permits-dialog.component';


@Component({
  selector: 'app-view-company-permits-list',
  templateUrl: './view-company-permits-list.component.html',
  styleUrls: ['./view-company-permits-list.component.scss']
})
export class ViewCompanyPermitsListComponent implements OnInit {


  constructor(
    private companyService: CompanyService,
    private ServiceService: ServicesService,
    private userService: UserService,
    private themeService: ThemeService,
    private IMenuService: MenuService,
    private router: Router,
    private dialog: MatDialog,
    private api: ApiService,
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


  Permit: {
    permitID: number;
    permitCode: string;
    permitReference: string;
    dateStart: string;
    dateEnd: string;
    importdateStart: string;
    importdateEnd: string;
    exportdateStart: string;
    exportdateEnd: string;
    exportTariff: number;
    tariff: any[]
  };

  tableHeader: TableHeader = {
    title: 'Permits',
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
      title: 'Permit Code',
      propertyName: 'permitCode',
      order: {
        enable: true,
        tag: 'PermitCode'
      }
    },
    // {
    //   title: 'Permit Reference',
    //   propertyName: 'permitReference',
    //   order: {
    //     enable: true,
    //     tag: 'PermitReference'
    //   }
    // },
    {
      title: 'Start Date',
      propertyName: 'dateStart',
      order: {
        enable: true,
        tag: 'DateStart'
      }
    },
    {
      title: 'End Date',
      propertyName: 'dateEnd',
      order: {
        enable: true,
        tag: 'DateEnd'
      }
    },
    {
      title: 'Import Start Date',
      propertyName: 'importdateStart',
      order: {
        enable: true,
        tag: 'ImportdateStart'
      }
    },
    {
      title: 'Import End Date',
      propertyName: 'importdateEnd',
      order: {
        enable: true,
        tag: 'ImportdateEnd'
      }
    },
    {
      title: 'Export Start Date',
      propertyName: 'exportdateStart',
      order: {
        enable: true,
        tag: 'ExportdateStart'
      }
    },
    {
      title: 'Export End Date',
      propertyName: 'exportdateEnd',
      order: {
        enable: true,
        tag: 'ExportdateEnd'
      }
    }
  ];

  selectedRow = -1;

  PermitData: any[] = [];

  CompanyPermits: Permit[] = [];
  CompanyPRCC: PRCC[] = [];
  CompanyEPC: EPC[] = [];


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
  permitTypeID = 0;
  permitTypeName = '';
  tarifflist: Tariff[];

  permitID = 0;
  permitCode =  '';
  permitReference: '';
  dateStart: '';
  dateEnd: '';
  importStartDate = '';
  importEndDate = '';
  exportStartDate = '';
  exportEndDate = '';


  ngOnInit() {

    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.companyService.observeCompany().subscribe((obj: SelectedCompany) => {
      this.companyID = obj.companyID;
      this.companyName = obj.companyName;
    });

    this.companyService.observePermitType().subscribe((obj: SelectedPermitType) => {
      if (obj) {
        this.permitTypeID = obj.permitTypeID;
        this.permitTypeName = obj.permitTypeName;
      }
    });

    if (this.permitTypeID === 1) {

      this.tableHeadings = [
        {
          title: '',
          propertyName: 'rowNum',
          order: {
            enable: false,
          }
        },
        {
          title: 'Permit Code',
          propertyName: 'permitCode',
          order: {
            enable: true,
            tag: 'PermitCode'
          }
        },
        {
          title: 'Start Date',
          propertyName: 'dateStart',
          order: {
            enable: true,
            tag: 'DateStart'
          }
        },
        {
          title: 'End Date',
          propertyName: 'dateEnd',
          order: {
            enable: true,
            tag: 'DateEnd'
          }
        },
        {
          title: 'Import Start Date',
          propertyName: 'importdateStart',
          order: {
            enable: true,
            tag: 'ImportdateStart'
          }
        },
        {
          title: 'Import End Date',
          propertyName: 'importdateEnd',
          order: {
            enable: true,
            tag: 'ImportdateEnd'
          }
        },
        {
          title: 'Export Start Date',
          propertyName: 'exportdateStart',
          order: {
            enable: true,
            tag: 'ExportdateStart'
          }
        },
        {
          title: 'Export End Date',
          propertyName: 'exportdateEnd',
          order: {
            enable: true,
            tag: 'ExportdateEnd'
          }
        }
      ];
      this.loadCompanyPermits(true);
    } else if (this.permitTypeID === 2) {
      this.tableHeadings = [
        {
          title: '',
          propertyName: 'rowNum',
          order: {
            enable: false,
          }
        },
        {
          title: 'PRCC Number',
          propertyName: 'prccNumber',
          order: {
            enable: true,
            tag: 'PRCCNumber'
          }
        },
        {
          title: 'Custom Value',
          propertyName: 'customValue',
          order: {
            enable: true,
            tag: 'CustomValue'
          }
        },
        {
          title: 'Reg No',
          propertyName: 'regNo',
          order: {
            enable: true,
            tag: 'RegNo'
          }
        },
        {
          title: 'File No',
          propertyName: 'fileNo',
          order: {
            enable: true,
            tag: 'FileNo'
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
          title: 'Import Start Date',
          propertyName: 'importStartDate',
          order: {
            enable: true,
            tag: 'ImportStartDate'
          }
        },
        {
          title: 'Import End Date',
          propertyName: 'importEndDate',
          order: {
            enable: true,
            tag: 'ImportEndDate'
          }
        }
      ];
      console.log('2');
      this.loadCompanyPRCCs(true);
    } else if (this.permitTypeID === 3) {
      this.tableHeadings = [
        {
          title: '',
          propertyName: 'rowNum',
          order: {
            enable: false,
          }
        },
        {
          title: 'EPC Code',
          propertyName: 'epcCode',
          order: {
            enable: true,
            tag: 'EPCCode'
          }
        }
      ];
      console.log(3);
      this.loadCompanyEPCs(true);
    }
  }

  loadCompanyPermits(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model: GetCompanyPermits = {
      userID: this.currentUser.userID,
      filter: this.filter,
      permitID: -1,
      companyID: this.companyID,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
    this.companyService.getCompanyPermits(model).then(
      (res: CompanyPermitsListResponse) => {
        if (res.outcome.outcome === 'SUCCESS') {
          if (displayGrowl) {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage);
          }
        }
        this.CompanyPermits = res.permits;
        this.PermitData = this.CompanyPermits;
        console.log('521 PermitData');
        console.log(this.PermitData);

        if (res.rowCount === 0) {
          this.noData = true;
          this.showLoader = false;
        } else {
          this.noData = false;
          this.rowCount = res.rowCount;
          this.showingRecords = res.permits.length;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.PermitData.length - 1;
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

  loadCompanyPRCCs(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model: GetCompanyPRCCs = {
      userID: this.currentUser.userID,
      filter: this.filter,
      PRCCID: -1,
      companyID: this.companyID,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
    this.companyService.getCompanyPRCCs(model).then(
      (res: CompanyPRCCsListResponse) => {
        if (res.outcome.outcome === 'SUCCESS') {
          if (displayGrowl) {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage);
          }
        }
        this.CompanyPRCC = res.prccs;
        this.PermitData = this.CompanyPRCC;
        console.log('PRCC PermitData');
        console.log(this.PermitData);

        if (res.rowCount === 0) {
          this.noData = true;
          this.showLoader = false;
        } else {
          this.noData = false;
          this.rowCount = res.rowCount;
          this.showingRecords = res.prccs.length;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.PermitData.length - 1;
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

  loadCompanyEPCs(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model: GetCompanyEPCs = {
      userID: this.currentUser.userID,
      filter: this.filter,
      EPCID: -1,
      companyID: this.companyID,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
    this.companyService.getCompanyEPCs(model).then(
      (res: CompanyEPCsListResponse) => {
        if (res.outcome.outcome === 'SUCCESS') {
          if (displayGrowl) {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage);
          }
        }
        this.CompanyEPC = res.epcs;
        this.PermitData = this.CompanyEPC;
        console.log('EPC PermitData');
        console.log(this.PermitData);

        if (res.rowCount === 0) {
          this.noData = true;
          this.showLoader = false;
        } else {
          this.noData = false;
          this.rowCount = res.rowCount;
          this.showingRecords = res.epcs.length;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.PermitData.length - 1;
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
    if (this.permitTypeID === 1) {
      console.log('1');
      this.loadCompanyPermits(true);
    } else if (this.permitTypeID === 2) {
      console.log('2');
      this.loadCompanyPRCCs(true);
    } else if (this.permitTypeID === 3) {
      console.log(3);
      this.loadCompanyEPCs(true);
    }
  }

  searchBar() {
    this.rowStart = 1;
    if (this.permitTypeID === 1) {
      console.log('1');
      this.loadCompanyPermits(true);
    } else if (this.permitTypeID === 2) {
      console.log('2');
      this.loadCompanyPRCCs(true);
    } else if (this.permitTypeID === 3) {
      console.log(3);
      this.loadCompanyEPCs(true);
    }
  }


  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    if (this.permitTypeID === 1) {
      console.log('1');
      this.loadCompanyPermits(true);
    } else if (this.permitTypeID === 2) {
      console.log('2');
      this.loadCompanyPRCCs(true);
    } else if (this.permitTypeID === 3) {
      console.log(3);
      this.loadCompanyEPCs(true);
    }
  }

  popClick(event, obj) {
    this.Permit = obj;
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;
    this.themeService.toggleContextMenu(!this.contextMenu);
    this.contextMenu = true;
  }

  back() {
    this.router.navigate(['companies', 'permittypes']);
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
    if (this.permitTypeID === 1) {
      console.log('1');
      this.loadCompanyPermits(true);
    } else if (this.permitTypeID === 2) {
      console.log('2');
      this.loadCompanyPRCCs(true);
    } else if (this.permitTypeID === 3) {
      console.log(3);
      this.loadCompanyEPCs(true);
    }
  }

  searchEvent(query: string) {
    this.filter = query;
    if (this.permitTypeID === 1) {
      console.log('1');
      this.loadCompanyPermits(true);
    } else if (this.permitTypeID === 2) {
      console.log('2');
      this.loadCompanyPRCCs(true);
    } else if (this.permitTypeID === 3) {
      console.log(3);
      this.loadCompanyEPCs(true);
    }
  }

  addPermitDialog() {
    this.dialog.open(AddCompanyPermitComponent, {
      autoFocus: true,
      height: '75vh',
      width: '80%',
      data: {

      }}).afterClosed().subscribe((val) => {
      if (val) {
        if (this.permitTypeID === 1) {
          console.log('1');
          this.loadCompanyPermits(true);
        } else if (this.permitTypeID === 2) {
          console.log('2');
          this.loadCompanyPRCCs(true);
        } else if (this.permitTypeID === 3) {
          console.log(3);
          this.loadCompanyEPCs(true);
        }
      }
    });
  }

  addPermit(permit: any) {
    this.api.post(`${environment.ApiEndpoint}/`, {
      request: {

      }
    });
  }

  updatePermitDialog() {
    this.dialog.open(EditPermitDialogComponent, {
      panelClass: 'custom-dialog-container',
      height: '75vh',
      width: '80%',
      data: {
        permit: this.Permit
      }
    });

  }

  updatePermit() {

  }

  removePermitDialog() {
    this.dialog.open(RemovePermitsDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '512px',

    }).afterClosed().subscribe(UpdatePermit => {
      console.log('awe');
      if (UpdatePermit) {
        console.log('hi');
        this.UpdatePermit(true);
      }
    });
  }

  // editItem(id: number) {
  //   this.loadServices(false);


  //   this.themeService.toggleContextMenu(false);
  //   this.contextMenu = false;
  //   this.itemID = this.Item.itemID;
  //   this.item = this.Item.item;
  //   this.description = this.Item.description;
  //   this.tariff = this.Item.tariff;
  //   this.type = this.Item.type;
  //   this.mIDP = this.Item.mIDP;
  //   this.pI = this.Item.pI;
  //   this.vulnerable = this.Item.vulnerable;
  //   this.openeditModal.nativeElement.click();
  // }
  // removePermit(id: number) {
  //   this.themeService.toggleContextMenu(false);
  //   this.contextMenu = false;
  //   this.permitID = this.Permit.permitID;
  //   this.openRemoveModal.nativeElement.click();
  // }

  async UpdatePermit(deleted: boolean) {
    const model = {
      request: {
        userID: this.currentUser.userID,
        permitID: this.Permit.permitID,
        isDeleted: deleted ? 1 : 0,
      },
      procedure: 'PermitUpdate'
    };

    await this.api.post(`${environment.ApiEndpoint}/capture/post`, model).then(
      (res: any) => {
        console.log(res);

        if (this.permitTypeID === 1) {
          console.log('1');
          this.loadCompanyPermits(true);
        } else if (this.permitTypeID === 2) {
          console.log('2');
          this.loadCompanyPRCCs(true);
        } else if (this.permitTypeID === 3) {
          console.log(3);
          this.loadCompanyEPCs(true);
        }

        console.log('Test');
    });
    // this.companyService.itemupdate(requestModel).then(
    //   (res: UpdateItemResponse) => {
    //     if (res.outcome.outcome === 'SUCCESS') {
    //       this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
    //       this.loadCompanyPermits(false);
    //     } else {
    //       this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
    //     }
    //   },
    //   (msg) => this.notify.errorsmsg('Failure', 'Cannot reach server')
    // );
  }

  // addNewservice(id, name) {
  //   const requestModel = {
  //     userID: this.currentUser.userID,
  //     serviceID: id,
  //     itemID: this.itemID
  //   };

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
  // }

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




