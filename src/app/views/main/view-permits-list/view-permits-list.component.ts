import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { CompanyPermitsListResponse, Permit } from 'src/app/models/HttpResponses/CompanyPermitsListResponse';
import { GetCompanyPermits } from 'src/app/models/HttpRequests/GetCompanyPermits';
import { GetPermitTypes } from 'src/app/models/HttpRequests/GetPermitTypes';
import { PermitTypesListResponse, PermitType } from 'src/app/models/HttpResponses/PermitTypesListResponse';

@Component({
  selector: 'app-view-permits-list',
  templateUrl: './view-permits-list.component.html',
  styleUrls: ['./view-permits-list.component.scss']
})
export class ViewPermitsListComponent implements OnInit {

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

  // @ViewChild('openeditModal', {static: true})
  // openeditModal: ElementRef;

  // @ViewChild('closeeditModal', {static: true})
  // closeeditModal: ElementRef;

  // @ViewChild('openRemoveModal', {static: true})
  // openRemoveModal: ElementRef;
  // @ViewChild('closeRemoveModal', {static: true})
  // closeRemoveModal: ElementRef;

  PermitType: {
    permitTypeID: number;
    permitName: string;
  };

  tableHeader: TableHeader = {
    title: `Permits`,
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
      title: 'permit Name',
      propertyName: 'permitName',
      order: {
        enable: false
      }
    },
    // {
    //   title: 'Permit Code',
    //   propertyName: 'permitCode',
    //   order: {
    //     enable: true,
    //     tag: 'PermitCode'
    //   }
    // },
    // {
    //   title: 'Permit Reference',
    //   propertyName: 'permitReference',
    //   order: {
    //     enable: true,
    //     tag: 'PermitReference'
    //   }
    // },
    // {
    //   title: 'Start Date',
    //   propertyName: 'dateStart',
    //   order: {
    //     enable: true,
    //     tag: 'DateStart'
    //   }
    // },
    // {
    //   title: 'End Date',
    //   propertyName: 'dateEnd',
    //   order: {
    //     enable: true,
    //     tag: 'DateEnd'
    //   }
    // },
    // {
    //   title: 'Import Start Date',
    //   propertyName: 'importdateStart',
    //   order: {
    //     enable: true,
    //     tag: 'ImportdateStart'
    //   }
    // },
    // {
    //   title: 'Import End Date',
    //   propertyName: 'importdateEnd',
    //   order: {
    //     enable: true,
    //     tag: 'ImportdateEnd'
    //   }
    // },
    // {
    //   title: 'Export Start Date',
    //   propertyName: 'exportdateStart',
    //   order: {
    //     enable: true,
    //     tag: 'ExportdateStart'
    //   }
    // },
    // {
    //   title: 'Export End Date',
    //   propertyName: 'exportdateEnd',
    //   order: {
    //     enable: true,
    //     tag: 'ExportdateEnd'
    //   }
    // }
  ];

  selectedRow = -1;

  CompanyPermits: Permit[] = [];
  PermitTypes: PermitType[] = [];

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


  ngOnInit() {

    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.companyService.observeCompany().subscribe((obj: SelectedCompany) => {
      this.companyID = obj.companyID;
      this.companyName = obj.companyName;

      if (this.companyName !== '') {
        this.tableHeader.title = `${this.companyName} - Permits`;
      }
    });

    this.loadPermitTypes(true);
    // this.loadCompanyPermits(true);
  }

  loadPermitTypes(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model: GetPermitTypes = {
      userID: this.currentUser.userID,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
    };
    this.companyService.getPermitTypes(model).then(
      (res: PermitTypesListResponse) => {
        if (res.outcome.outcome === 'SUCCESS') {
          if (displayGrowl) {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage);
          }
        }
        this.PermitTypes = res.permitTypes;
        if (res.rowCount === 0) {
          this.noData = true;
          this.showLoader = false;
        } else {
          this.noData = false;
          this.rowCount = res.rowCount;
          this.showingRecords = res.permitTypes.length;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.CompanyPermits.length - 1;
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

  // loadCompanyPermits(displayGrowl: boolean) {
  //   this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
  //   this.showLoader = true;
  //   const model: GetCompanyPermits = {
  //     userID: this.currentUser.userID,
  //     filter: this.filter,
  //     permitID: -1,
  //     companyID: this.companyID,
  //     rowStart: this.rowStart,
  //     rowEnd: this.rowEnd,
  //     orderBy: this.orderBy,
  //     orderByDirection: this.orderDirection
  //   };
  //   this.companyService.getCompanyPermits(model).then(
  //     (res: CompanyPermitsListResponse) => {
  //       if (res.outcome.outcome === 'SUCCESS') {
  //         if (displayGrowl) {
  //           this.notify.successmsg(
  //             res.outcome.outcome,
  //             res.outcome.outcomeMessage);
  //         }
  //       }
  //       this.CompanyPermits = res.permits;
  //       if (res.rowCount === 0) {
  //         this.noData = true;
  //         this.showLoader = false;
  //       } else {
  //         this.noData = false;
  //         this.rowCount = res.rowCount;
  //         this.showingRecords = res.permits.length;
  //         this.showLoader = false;
  //         this.totalShowing = +this.rowStart + +this.CompanyPermits.length - 1;
  //       }

  //     },
  //     msg => {
  //       this.showLoader = false;
  //       this.notify.errorsmsg(
  //         'Server Error',
  //         'Something went wrong while trying to access the server.'
  //       );
  //     }
  //   );
  // }

  pageChange($event: {rowStart: number, rowEnd: number}) {
    this.rowStart = $event.rowStart;
    this.rowEnd = $event.rowEnd;
    this.loadPermitTypes(false);
  }

  searchBar() {
    this.rowStart = 1;
    this.loadPermitTypes(false);
  }


  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadPermitTypes(false);
  }

  popClick(event, obj) {
    this.PermitType = obj;
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
    this.loadPermitTypes(true);
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadPermitTypes(false);
  }
}




