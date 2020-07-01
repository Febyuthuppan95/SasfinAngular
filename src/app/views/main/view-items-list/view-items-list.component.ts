import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {MenuService} from 'src/app/services/Menu.Service';
import {Pagination} from '../../../models/Pagination';
import {NotificationComponent} from '../../../components/notification/notification.component';
import {UserService} from '../../../services/user.Service';
import {User} from '../../../models/HttpResponses/User';
import {ThemeService} from 'src/app/services/theme.Service.js';
import {SnackbarModel} from '../../../models/StateModels/SnackbarModel';
import {HelpSnackbar} from '../../../services/HelpSnackbar.service';
import {Order, SelectedRecord, TableHeader, TableHeading} from 'src/app/models/Table';
import {CompanyService} from 'src/app/services/Company.Service';
import {GetItemList} from 'src/app/models/HttpRequests/GetItemList';
import {Items, ItemsListResponse} from 'src/app/models/HttpResponses/ItemsListResponse';
import {UpdateItemResponse} from 'src/app/models/HttpResponses/UpdateItemResponse';
import {GetItemServiceList} from 'src/app/models/HttpRequests/GetItemServiceList';
import {ItemService, ItemServiceListResponse} from 'src/app/models/HttpResponses/ItemServiceListResponse';
import {ServiceListResponse} from 'src/app/models/HttpResponses/ServiceListResponse';
import {GetServiceLList} from 'src/app/models/HttpRequests/GetServiceLList';
import {Service} from 'src/app/models/HttpResponses/Service';
import {ServicesService} from 'src/app/services/Services.Service';
import {AddItemServiceResponse} from 'src/app/models/HttpResponses/AddItemServiceResponse';
import {UpdateItemServiceResponse} from 'src/app/models/HttpResponses/UpdateItemServiceResponse';
import {takeUntil} from 'rxjs/operators';
import {Tariff, TariffListResponse} from 'src/app/models/HttpResponses/TariffListResponse';
import {ItemTypeListResponse} from 'src/app/models/HttpResponses/ItemTypeListResponse';
import {ItemType} from 'src/app/models/HttpResponses/ItemType';
import {GetTariffList} from 'src/app/models/HttpRequests/GetTariffList';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-view-items-list',
  templateUrl: './view-items-list.component.html',
  styleUrls: ['./view-items-list.component.scss']
})
export class ContextItemsListComponent implements OnInit, OnDestroy {

  constructor(
    private companyService: CompanyService,
    private ServiceService: ServicesService,
    private userService: UserService,
    private themeService: ThemeService,
    private IMenuService: MenuService,
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
    this.subscription = this.IMenuService.subSidebarEmit$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(result => {
      this.sidebarCollapsed = result;
    });
  }

  private unsubscribe$ = new Subject<void>();

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild('openeditModal', {static: true})
  openeditModal: ElementRef;

  @ViewChild('closeeditModal', {static: true})
  closeeditModal: ElementRef;

  @ViewChild('openRemoveModal', {static: true})
  openRemoveModal: ElementRef;
  @ViewChild('closeRemoveModal', {static: true})
  closeRemoveModal: ElementRef;

  Item: {
    itemID: number,
    item: string,
    description: string,
    tariffID: number,
    tariff: string,
    typeID: number,
    type: string,
    vulnerable: string,
  };

  tableHeader: TableHeader = {
    title: 'Items',
    addButton: {
     enable: false,
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
      title: '',
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
      propertyName: 'tariffName',
      order: {
        enable: true,
        tag: 'tariffName'
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
  tariff = '';
  tariffID = 0;
  itemtype = '';
  itemtypeID = 0;
  vulnerable = '';

  items: Items[] = [];

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
  YESNO: any[] = [{title: 'True', value: true}, {title: 'False', value: false}];
  itemservicelist: ItemService[] = [];
  servicelist: Service[] = [];
  displayservices: Service[] = [];
  returnedservices: Array<Service>;
  tarifflist: Tariff[] = [];
  itemTypes: ItemType[];
  vulnerableControl = new FormControl();

  ngOnInit() {

    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.loadItems(true);
    this.loadServices(false);
    this.loadTariffs(false);
    this.loadItemTypes(false);

  }

  loaditemServices(displayGrowl: boolean) {
    const model: GetItemServiceList = {
      filter: this.filter,
      userID: this.currentUser.userID,
      itemID: this.Item.itemID,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection

    };
    this.companyService
    .itemservice(model)
    .then(
      (res: ItemServiceListResponse) => {

        this.itemservicelist = res.itemServices;

        if (res.outcome.outcome === 'SUCCESS') {
          this.returnedservices = this.separateMe(this.servicelist, this.itemservicelist);
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

  loadServices(displayGrowl: boolean) {
    const model: GetServiceLList = {
      filter: this.filter,
      userID: this.currentUser.userID,
      specificServiceID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection

    };
    this.ServiceService
    .getServiceList(model)
    .then(
      (res: ServiceListResponse) => {

        this.servicelist = res.serviceses;
        this.returnedservices = Object.assign(this.displayservices, this.servicelist);
        this.loaditemServices(false);

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

  loadItems(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model: GetItemList = {
      userID: this.currentUser.userID,
      filter: this.filter,
      specificItemID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
    this.companyService.getItemList(model).then(
      (res: ItemsListResponse) => {
        if (res.outcome.outcome === 'SUCCESS') {
          if (displayGrowl) {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage);
          }
        }
        this.items = res.itemsLists;

        if (res.rowCount === 0) {
          this.noData = true;
          this.showLoader = false;
        } else {
          this.noData = false;
          this.rowCount = res.rowCount;
          this.showingRecords = res.itemsLists.length;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.items.length - 1;
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

  loadItemTypes(displayGrowl: boolean) {
    const model = {
      userID: this.currentUser.userID,
      filter: this.filter,
      itemTypeID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
    this.companyService.getItemTypesList(model).then(
      (res: ItemTypeListResponse) => {

        this.itemTypes = res.itemTypeLists;

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

  loadTariffs(displayGrowl: boolean) {

    const model: GetTariffList = {
      filter: this.filter,
      userID: this.currentUser.userID,
      specificTariffID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd
    };

    this.companyService
    .getTariffList(model)// model
    .then(
      (res: TariffListResponse) => {

          this.tarifflist = res.tariffList;
          console.log(this.tarifflist);

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
    this.loadItems(false);
  }

  searchBar() {
    this.rowStart = 1;
    this.loadItems(false);
  }


  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadItems(false);
  }

  popClick(event, obj) {
    this.Item = obj;
    console.log(obj);
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
    this.loadItems(true);
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadItems(false);
  }

  editItem(id: number) {
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.itemID = this.Item.itemID;
    this.item = this.Item.item;
    this.description = this.Item.description;
    this.tariff = this.Item.tariff;
    this.tariffID = this.Item.tariffID;
    this.itemtype = this.Item.type;
    this.itemtypeID = this.Item.typeID;
    console.log(this.itemtype);
    console.log(this.itemtypeID);
    this.vulnerableControl.setValue(this.Item.vulnerable === 'True' ? true : false);
    this.vulnerable = this.Item.vulnerable;
    this.openeditModal.nativeElement.click();
  }

  removeItem(id: number) {
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.itemID = this.Item.itemID;
    this.openRemoveModal.nativeElement.click();
  }

  UpdateItem(deleted?: boolean) {
    const requestModel = {
      userID: this.currentUser.userID,
      itemID: this.itemID,
      item: this.item,
      description: this.description,
      tariffID: this.tariffID,
      type: this.itemtypeID,
      vulnerable: this.vulnerable,
      service: '',
      isDeleted: deleted
    };
    this.companyService.itemupdate(requestModel).then(
      (res: UpdateItemResponse) => {
        if (res.outcome.outcome === 'SUCCESS') {
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          this.loadItems(false);
          this.closeeditModal.nativeElement.click();
          if (deleted === true) {
          this.closeRemoveModal.nativeElement.click();
          }
        } else {
          this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
        }
      },
      (msg) => this.notify.errorsmsg('Failure', 'Cannot reach server')
    );
  }

  addNewservice(id, name) {
    const requestModel = {
      userID: this.currentUser.userID,
      serviceID: id,
      itemID: this.itemID
    };

    this.companyService.itemserviceadd(requestModel).then(
      (res: AddItemServiceResponse) => {
        if (res.outcome.outcome === 'SUCCESS') {
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          this.loadServices(false);
        } else {
          this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
        }



      },
      (msg) => this.notify.errorsmsg('Failure', 'Cannot reach server')
    );
  }

  removeservice(id, name) {
    const requestModel = {
      userID: this.currentUser.userID,
      itemServiceID: id,
      itemID: this.itemID
    };

    this.companyService.itemserviceupdate(requestModel).then(
      (res: UpdateItemServiceResponse) => {
        if (res.outcome.outcome === 'SUCCESS') {
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          this.loadServices(false);
        } else {
          this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
        }
        // this.loadItems(false);
      },
      (msg) => this.notify.errorsmsg('Failure', 'Cannot reach server')
    );
  }
  onVulnerablestateChange(state: string) {
    this.vulnerable = state;
  }
  onTypeChange(id: number) {
    this.itemtypeID = id;
    console.log(this.itemtypeID);
  }
  onTariffChange(selectedtariffid: number) {
    this.tariffID = selectedtariffid;
  }

  separateMe(services: Service[], itemServices: ItemService[]): Service[] {
    itemServices.forEach((item, index) => {
      services = services.filter(x => x.serviceID !== item.serviceID);
    });

    return services;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}



