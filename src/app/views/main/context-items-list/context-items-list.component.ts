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
import { CompanyService } from 'src/app/services/Company.Service';
import { GetItemList } from 'src/app/models/HttpRequests/GetItemList';
import { ItemsListResponse, Items } from 'src/app/models/HttpResponses/ItemsListResponse';
import { UpdateItemResponse } from 'src/app/models/HttpResponses/UpdateItemResponse';

@Component({
  selector: 'app-context-items-list',
  templateUrl: './context-items-list.component.html',
  styleUrls: ['./context-items-list.component.scss']
})
export class ContextItemsListComponent implements OnInit {

  constructor(
    private companyService: CompanyService,
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
    this.subscription = this.IMenuService.subSidebarEmit$.subscribe(result => {
      this.sidebarCollapsed = result;
    });
  }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild('openeditModal', {static: true})
  openeditModal: ElementRef;

  @ViewChild('closeeditModal', {static: true})
  closeeditModal: ElementRef;

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
    title: 'Items',
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
      title: 'MIDP',
      propertyName: 'mIDP',
      order: {
        enable: true,
        tag: 'MIDP'
      }
    },
    {
      title: 'PI',
      propertyName: 'pI',
      order: {
        enable: true,
        tag: 'PI'
      }
    },
    {
      title: 'Vulnerable',
      propertyName: 'vulnerable',
      order: {
        enable: true,
        tag: 'Vulnerable'
      }
    },
    {
      title: 'Services',
      propertyName: 'services',
      order: {
        enable: true,
        tag: 'Services'
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

  items: Items[] = [];

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
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
  YESNO: string[] = ['Yes', 'No'];

  ngOnInit() {

    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.loadItems(true);
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
        if (res.outcome.outcome === 'FAILURE') {
          this.notify.errorsmsg(
            res.outcome.outcome,
            res.outcome.outcomeMessage
          );
        } else {
          if (displayGrowl) {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage);
          }
        }
        this.items = res.itemsLists;

        console.log(this.items);

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
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;
    this.themeService.toggleContextMenu(!this.contextMenu);
    this.contextMenu = true;
    console.log(this.Item);
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
    this.type = this.Item.type;
    this.mIDP = this.Item.mIDP;
    this.pI = this.Item.pI;
    this.vulnerable = this.Item.vulnerable;
    this.openeditModal.nativeElement.click();
    console.log(this.Item.mIDP);
    console.log(this.pI);
  }

  UpdateItem(id: number) {
    const requestModel = {
      userID: this.currentUser.userID,
      itemID: this.itemID,
      item: this.item,
      description: this.description,
      tariff: this.tariff,
      type: this.type,
      mIDP: this.mIDP,
      pI: this.pI,
      vulnerable: this.vulnerable,
      service: ''
    };
    console.log(requestModel);

    this.companyService.itemupdate(requestModel).then(
      (res: UpdateItemResponse) => {
        if (res.outcome.outcome === 'SUCCESS') {
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          this.loadItems(false);
        } else {
          this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
        }
      },
      (msg) => this.notify.errorsmsg('Failure', 'Cannot reach server')
    );
  }

  removeItemValue(id: number) {
    const requestModel = {
      userID: this.currentUser.userID,
      itemID: this.Item.itemID,
      isDeleted: 1
    };

    this.companyService.RemoveItemList(requestModel).then(
      (res: UpdateItemResponse) => {
        if (res.outcome.outcome === 'SUCCESS') {
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          this.loadItems(false);
        } else {
          this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
        }
      },
      (msg) => this.notify.errorsmsg('Failure', 'Cannot reach server')
    );
  }

  onVulnerablestateChange(state: string) {
    this.vulnerable = state;
  }

  onPIstateChange(state: string) {
    this.pI = state;
  }

  onMIDPstateChange(state: string) {
    this.mIDP = state;
  }

}



