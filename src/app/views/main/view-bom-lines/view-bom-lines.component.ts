import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { MenuService } from 'src/app/services/Menu.Service';
import { Pagination } from '../../../models/Pagination';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { UserService } from '../../../services/user.Service';
import { User } from '../../../models/HttpResponses/User';
import { ThemeService } from 'src/app/services/theme.Service.js';
import { SnackbarModel } from '../../../models/StateModels/SnackbarModel';
import { HelpSnackbar } from '../../../services/HelpSnackbar.service';
import {
  TableHeading,
  SelectedRecord,
  Order,
  TableHeader,
} from 'src/app/models/Table';
import { CompanyService, SelectedBOM } from 'src/app/services/Company.Service';
import { ServicesService } from 'src/app/services/Services.Service';
import { BOMLine } from 'src/app/models/HttpResponses/BOMsLinesResponse';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';
import { environment } from '../../../../environments/environment';
import { Outcome } from '../../../models/HttpResponses/Outcome';
import { DocumentService } from '../../../services/Document.Service';

@Component({
  selector: 'app-view-bom-lines',
  templateUrl: './view-bom-lines.component.html',
  styleUrls: ['./view-bom-lines.component.scss'],
})
export class ViewBOMLinesComponent implements OnInit, OnDestroy {
  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private themeService: ThemeService,
    private IMenuService: MenuService,
    private router: Router,
    private snackbarService: HelpSnackbar,
    private IDocumentService: DocumentService,
    // tslint:disable-next-line:no-shadowed-variable
    private ApiService: ApiService
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
    this.subscription = this.IMenuService.subSidebarEmit$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.sidebarCollapsed = result;
      });
  }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild('bomFile', { static: false })
  bomFile: ElementRef;

  @ViewChild('openAddModal', { static: true })
  openAddModal: ElementRef;

  @ViewChild('closeAddModal', { static: true })
  closeAddModal: ElementRef;

  // @ViewChild('openeditModal', {static: true})
  // openeditModal: ElementRef;

  // @ViewChild('closeeditModal', {static: true})
  // closeeditModal: ElementRef;

  // @ViewChild('openRemoveModal', {static: true})
  // openRemoveModal: ElementRef;
  // @ViewChild('closeRemoveModal', {static: true})
  // closeRemoveModal: ElementRef;

  Item: {
    itemID: number;
    item: string;
    description: string;
    tariff: number;
    type: string;
    mIDP: string;
    pI: string;
    vulnerable: string;
  };

  tableHeader: TableHeader = {
    title: 'BOM Lines',
    addButton: {
      enable: true,
    },
    backButton: {
      enable: true,
    },
    filters: {
      search: true,
      selectRowCount: true,
    },
  };

  tableHeadings: TableHeading[] = [
    {
      title: '',
      propertyName: 'RowNum',
      order: {
        enable: false,
      },
    },
    {
      title: 'Item Code',
      propertyName: 'ItemCode',
      order: {
        enable: true,
        tag: 'ItemCode',
      },
    },
    {
      title: 'Tariff Code',
      propertyName: 'TariffCode',
      order: {
        enable: true,
        tag: 'TariffCode',
      },
    },
    {
      title: 'Unit Of Measure',
      propertyName: 'UnitOfMeasure',
      order: {
        enable: true,
        tag: 'UnitOfMeasure',
      },
    },
    {
      title: 'Quarter',
      propertyName: 'Quarter',
      order: {
        enable: true,
        tag: 'Quarter',
      },
    },
    {
      title: 'Usage Type',
      propertyName: 'UsageType',
      order: {
        enable: true,
        tag: 'UsageType',
      },
    },
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

  BomFile: File;
  filePreview: string;

  ngOnInit() {
    this.themeService
      .observeTheme()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((theme) => {
        this.currentTheme = theme;
      });

    this.companyService
      .observeBOM()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((obj: SelectedBOM) => {
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
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        bomLineID: this.bomid,
        filter: this.filter,
        orderBy: this.orderBy,
        orderByDirection: this.orderDirection,
        rowStart: this.rowStart,
        rowEnd: this.rowEnd,
      },
      requestProcedure: `BOMLineList`,
    };
    this.ApiService.post(
      `${environment.ApiEndpoint}/companies/BomLines`,
      model
    ).then(
      (res: any) => {
        if (res.outcome.outcome === 'SUCCESS') {
          if (displayGrowl) {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage
            );
          } else {
            if (displayGrowl) {
              this.notify.errorsmsg(
                res.outcome.outcome,
                res.outcome.outcomeMessage
              );
            }
          }
        }
        this.BOMLines = res.data;
        if (res.rowCount === 0) {
          this.noData = true;
          this.showLoader = false;
        } else {
          this.noData = false;
          this.rowCount = res.rowCount;
          this.showingRecords = res.data.length;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.BOMLines.length - 1;
        }
      },
      (msg) => {
        // console.log(msg);
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

  pageChange($event: { rowStart: number; rowEnd: number }) {
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
      if (
        $event.target.attributes.matTooltip !== undefined &&
        $event.target !== undefined
      ) {
        $event.target.setAttribute('mattooltip', 'New Tooltip');
        $event.srcElement.setAttribute('matTooltip', 'New Tooltip');
      }
    }
  }

  recordsPerPageChange(recordsPerPage: number) {
    this.rowCountPerPage = recordsPerPage;
    this.rowStart = 1;
    this.loadBOMLines(false);
  }

  add() {
    // Render modal
    this.filePreview = null;
    this.bomFile.nativeElement.value = '';
    this.BomFile = null;
    this.openAddModal.nativeElement.click();
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadBOMLines(false);
  }

  onFileChange(files: FileList) {
    this.BomFile = files.item(0);
    this.filePreview = this.BomFile.name;
  }

  saveBOMUpload() {
    // Save
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        bomID: this.bomid, // this needs to get the actual bomID
      },
      requestProcedure: `BomLineAdd`,
    };
    this.IDocumentService.upload(this.BomFile, model, 'boms/upload').then(
      (res: Outcome) => {
        // console.log('BOMUploadRes');
        console.log('Response: ' + res);
        if (res.outcome === 'SUCCESS') {
          this.notify.successmsg(res.outcome, res.outcomeMessage);
          this.loadBOMLines(false);
        } else {
          this.notify.errorsmsg(res.outcome, res.outcomeMessage);
        }
      },
      (msg) => {
        // nothing yet
        console.log('Error: ' + msg);
        this.showLoader = false;
        this.notify.errorsmsg(
          'Server Error',
          'Something went wrong while trying to access the server.'
        );
      }
    );
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
