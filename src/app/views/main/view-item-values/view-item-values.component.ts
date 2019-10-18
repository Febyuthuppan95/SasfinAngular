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
import { TableHeading, Order, TableHeader, SelectedRecord } from 'src/app/models/Table';
import { GetIAlternateItemList } from 'src/app/models/HttpRequests/GetIAlternateItemList';
import { AlternateItemsListResponse, AlternateItems } from 'src/app/models/HttpResponses/AlternateItemsListResponse';
import { CompanyService, SelectedItem } from 'src/app/services/Company.Service';
import { Router } from '@angular/router';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { UpdateGrouplist } from 'src/app/models/HttpResponses/UpdateGrouplist';
import { GetItemValuesList } from 'src/app/models/HttpRequests/GetItemValuesList';
import { ItemValuesListResponse, ItemValue } from 'src/app/models/HttpResponses/ItemValuesListResponse';
import { UpdateItemValue } from 'src/app/models/HttpResponses/UpdateItemValue';

@Component({
  selector: 'app-view-item-values',
  templateUrl: './view-item-values.component.html',
  styleUrls: ['./view-item-values.component.scss']
})
export class ViewItemValuesComponent implements OnInit {

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private themeService: ThemeService,
    private IMenuService: MenuService,
    private snackbarService: HelpSnackbar,
    private router: Router
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

  @ViewChild('openeditModal', {static: true})
  openeditModal: ElementRef;

  @ViewChild('closeeditModal', {static: true})
  closeeditModal: ElementRef;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  ItemValue: {
    itemValueID: number,
    itemPrice: number,
    freeComponent: string
  };



  tableHeader: TableHeader = {
    title: `Item Values`,
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
      title: 'Item Price',
      propertyName: 'itemPrice',
      order: {
        enable: true,
        tag: 'ItemPrice'
      }
    },
    {
      title: 'Date Added',
      propertyName: 'dateAdded',
      order: {
        enable: true,
        tag: 'DateAdded'
      }
    },
    {
      title: 'FreeComponent',
      propertyName: 'freeComponent',
      order: {
        enable: true,
        tag: 'FreeComponent'
      }
    }
  ];

  selectedRow = -1;
  Price = 0;
  FreeComponent = '';

  selectedFreecomp = 0;
  recordsPerPage = 15;
  itemvalues: ItemValue[] = [];
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
  itemID = 0;
  itemName = '';
  freecomp: string[] = ['true', 'false'];

  ngOnInit() {

    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.companyService.observeItem().subscribe((obj: SelectedItem) => {
      this.itemID = obj.itemID;
      this.itemName = obj.itemName;

      // if (this.groupID === '') {
      //   this.groupID = null;
      // }
    });

    this.loadItemsValues(true);
  }

  loadItemsValues(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model: GetItemValuesList = {
      userID: this.currentUser.userID,
      filter: this.filter,
      itemID: this.itemID,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
    this.companyService.getItemValueList(model).then(
      (res: ItemValuesListResponse) => {
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
        this.itemvalues = res.itemValues;

        if (res.rowCount === 0) {
          this.noData = true;
          this.showLoader = false;
        } else {
          this.noData = false;
          this.rowCount = res.rowCount;
          this.showingRecords = res.itemValues.length;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.itemvalues.length - 1;
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
    this.loadItemsValues(false);
  }

  searchBar() {
    this.rowStart = 1;
    this.loadItemsValues(false);
  }


  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadItemsValues(false);
  }

  popClick(event, obj) {
    this.ItemValue = obj;
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
    this.loadItemsValues(true);
  }

  searchEvent(query: string) {
    this.filter = query;
    console.log(query);
    this.loadItemsValues(false);
  }

  backToItems() {
    this.router.navigate(['companies/items']);
  }

  editItemValue(id: number) {
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.Price = 13.00; // this.ItemValue.itemPrice;
    this.FreeComponent = this.ItemValue.freeComponent;
    console.log(this.Price);
    this.openeditModal.nativeElement.click();
  }

  UpdateItemValue() {
    const requestModel = {
      userID: this.currentUser.userID,
      itemValueID: this.ItemValue.itemValueID,
      price: this.Price,
      freeComp: this.FreeComponent
    };
    console.log(requestModel);

    this.companyService.UpdateItemValueList(requestModel).then(
      (res: UpdateItemValue) => {
        if (res.outcome.outcome === 'SUCCESS') {
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          this.loadItemsValues(false);
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
      itemValueID: this.ItemValue.itemValueID,
      isDeleted: 1
    };

    this.companyService.RemoveItemValueList(requestModel).then(
      (res: UpdateItemValue) => {
        if (res.outcome.outcome === 'SUCCESS') {
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          this.loadItemsValues(false);
        } else {
          this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
        }
      },
      (msg) => this.notify.errorsmsg('Failure', 'Cannot reach server')
    );
  }

  onFreecompChange(state: string) {
    this.FreeComponent = state;
  }


}



