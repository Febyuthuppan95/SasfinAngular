import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { MenuService } from 'src/app/services/Menu.Service';
import { Pagination } from '../../../models/Pagination';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { UserService } from '../../../services/user.Service';
import { User } from '../../../models/HttpResponses/User';
import { ThemeService } from 'src/app/services/theme.Service.js';
import {SnackbarModel} from '../../../models/StateModels/SnackbarModel';
import {HelpSnackbar} from '../../../services/HelpSnackbar.service';
import { TableHeading, SelectedRecord, Order, TableHeader } from 'src/app/models/Table';
import { CompanyService, SelectedBOM } from 'src/app/services/Company.Service';
import { Service } from 'src/app/models/HttpResponses/Service';
import { ServicesService } from 'src/app/services/Services.Service';
import { GetBOMLines } from 'src/app/models/HttpRequests/GetBOMLines';
import { BOMsLinesResponse, BOMLine } from 'src/app/models/HttpResponses/BOMsLinesResponse';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-view-bom-lines',
  templateUrl: './view-bom-lines.component.html',
  styleUrls: ['./view-bom-lines.component.scss']
})
export class ViewBOMLinesComponent implements OnInit, OnDestroy {

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
    this.subscription = this.IMenuService.subSidebarEmit$.pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
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

  Item: {
    itemID: number,
    item: string,
    description: string,
    tariff: number,
    type: string,
    mIDP: string,
    pI: string,
    vulnerable: string,

  };

  tableHeader: TableHeader = {
    title: 'BOM Lines',
    addButton: {
     enable: true,
    },
    backButton: {
      enable: false
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
      title: 'Item',
      propertyName: 'item',
      order: {
        enable: true,
        tag: 'Item'
      }
    },
    {
      title: 'Description',
      propertyName: 'description',
      order: {
        enable: true,
        tag: 'Description'
      }
    },
    {
      title: 'Tariff',
      propertyName: 'tariff',
      order: {
        enable: true,
        tag: 'Tariff'
      }
    },
    {
      title: 'Type',
      propertyName: 'type',
      order: {
        enable: true,
        tag: 'Type'
      }
    },
    {
      title: 'Vulnerable',
      propertyName: 'vulnerable',
      order: {
        enable: true,
        tag: 'Vulnerable'
      }
    }
  ];

  selectedRow = -1;
  itemID = 0;
  item = '';
  description = '';
  tariff = 0;
  type = '';
  mIDP = '';
  pI = '';
  vulnerable = '';

  private unsubscribe$ = new Subject<void>();
  BOMLines: BOMLine[] = [];
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
  bomid = -1;
  bomstatus = '';


  ngOnInit() {

    this.themeService.observeTheme().pipe(takeUntil(this.unsubscribe$)).subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.companyService.observeBOM().pipe(takeUntil(this.unsubscribe$)).subscribe((obj: SelectedBOM) => {
      if (obj !== undefined) {
        this.bomid = obj.bomid;
        this.bomstatus = obj.status;

        this.loadBOMLines(true);
      }
    });


  }

  loadBOMLines(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model: GetBOMLines = {
      userID: this.currentUser.userID,
      filter: this.filter,
      bomID: this.bomid,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
    this.companyService.getBOMLines(model).then(
      (res: BOMsLinesResponse) => {

        if (res.outcome.outcome === 'SUCCESS') {
          if (displayGrowl) {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage);
          }
        }
        this.BOMLines = res.BOMLines;
        console.log(this.BOMLines);

        if (res.rowCount === 0) {
          this.noData = true;
          this.showLoader = false;
        } else {
          this.noData = false;
          this.rowCount = res.rowCount;
          this.showingRecords = res.BOMLines.length;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.BOMLines.length - 1;
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

  back() {
    this.router.navigate(['companies', 'boms']);
  }

  pageChange($event: {rowStart: number, rowEnd: number}) {
    this.rowStart = $event.rowStart;
    this.rowEnd = $event.rowEnd;
    this.loadBOMLines(false);
  }

  searchBar() {
    this.rowStart = 1;
    this.loadBOMLines(false);
  }


  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadBOMLines(false);
  }

  popClick(event, obj) {
    this.Item = obj;
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;
    this.themeService.toggleContextMenu(!this.contextMenu);
    this.contextMenu = true;
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
    this.loadBOMLines(true);
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadBOMLines(false);
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
  // removeItem(id: number) {
  //   console.log(this.Item.itemID);
  //   this.themeService.toggleContextMenu(false);
  //   this.contextMenu = false;
  //   this.itemID = this.Item.itemID;
  //   this.openRemoveModal.nativeElement.click();
  // }

  // UpdateItem(deleted: boolean) {
  //   const requestModel = {
  //     userID: this.currentUser.userID,
  //     itemID: this.itemID,
  //     item: this.item,
  //     description: this.description,
  //     tariff: this.tariff,
  //     type: this.type,
  //     mIDP: this.mIDP,
  //     pI: this.pI,
  //     vulnerable: this.vulnerable,
  //     service: '',
  //     isDeleted: deleted
  //   };
  //   console.log(requestModel);
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
  // }

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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    }

}





