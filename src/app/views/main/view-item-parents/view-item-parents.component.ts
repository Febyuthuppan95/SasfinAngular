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
import { CompanyService, SelectedItem } from 'src/app/services/Company.Service';
import { Router } from '@angular/router';
import { GetItemParentsList } from 'src/app/models/HttpRequests/GetItemParentsList';
import { ItemParentsListResponse, ItemParent } from 'src/app/models/HttpResponses/ItemParentsListResponse';
import { UpdateItemParent } from 'src/app/models/HttpResponses/UpdateItemParent';
import { UnitsOfMeasure } from 'src/app/models/HttpResponses/UnitsOfMeasure';
import { ListUnitsOfMeasure } from 'src/app/models/HttpResponses/ListUnitsOfMeasure';
import { ListUnitsOfMeasureRequest } from 'src/app/models/HttpRequests/ListUnitsOfMeasure';
import { UnitMeasureService } from 'src/app/services/Units.Service';

@Component({
  selector: 'app-view-item-parents',
  templateUrl: './view-item-parents.component.html',
  styleUrls: ['./view-item-parents.component.scss']
})
export class ViewItemParentsComponent implements OnInit {

  constructor(
    private companyService: CompanyService,
    private unitService: UnitMeasureService,
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

  ItemParent: {
    itemParentID: number
    parentID: number,
    itemID: number,
    unitsOfMeasureID: number,
    quantity: number,
    startDate: Date,
    endDate: Date
  };

  tableHeader: TableHeader = {
    title: `Item Parent`,
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
      title: '#',
      propertyName: 'rowNum',
      order: {
        enable: true,
      }
    },
    {
      title: 'Parent Item',
      propertyName: 'parentName',
      order: {
        enable: true,
        tag: 'ParentName'
      }
    },
    {
      title: 'Child Item',
      propertyName: 'itemName',
      order: {
        enable: true,
        tag: 'ItemName'
      }
    },
    {
      title: 'Quantity',
      propertyName: 'quantity',
      order: {
        enable: true,
        tag: 'Quantity'
      }
    },
    {
      title: 'Units of Measure',
      propertyName: 'unitsOfMeasureName',
      order: {
        enable: true,
        tag: 'UnitsOfMeasureName'
      }
    },
    {
      title: 'Start Date',
      propertyName: 'startDateText',
      order: {
        enable: true,
        tag: 'StartDate'
      }
    },
    {
      title: 'End Date',
      propertyName: 'endDateText',
      order: {
        enable: true,
        tag: 'EndDate'
      }
    }
  ];

  selectedRow = -1;
  ParentItemID = 0;
  ParentItem = '';
  ChildItemID = 0;
  ChildItem = '';
  Quantity = 0;
  UnitsofMeasure = '';
  UnitsofMeasureID = 0;
  StartDate: Date = new Date();
  EndDate: Date;

  selectedFreecomp = 0;
  recordsPerPage = 15;
  itemParents: ItemParent[] = [];
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
  UOMList: UnitsOfMeasure[] = [];
  selectedUOM = 0;

  ngOnInit() {

    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.companyService.observeItem().subscribe((obj: SelectedItem) => {
      this.itemID = obj.itemID;
      this.itemName = obj.itemName;
    });

    this.loadItemsParents(true);

    this.loadUnitsOfMeasures();
  }

  loadItemsParents(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model: GetItemParentsList = {
      userID: this.currentUser.userID,
      filter: this.filter,
      itemID: this.itemID,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
    this.companyService.getItemParentsList(model).then(
      (res: ItemParentsListResponse) => {
        if (res.outcome.outcome === 'SUCCESS') {
          if (displayGrowl) {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage
            );
          }
        }

        this.itemParents = res.itemParents;
        this.itemParents.forEach((item) => {
          item.startDateText = new Date(item.startDate).toDateString();
          item.endDateText = new Date(item.endDate).toDateString();
        });
        this.showLoader = false;

        if (res.rowCount === 0) {
          this.noData = true;
        } else {
          this.noData = false;
          this.rowCount = res.rowCount;
          this.showingRecords = res.itemParents.length;
          this.totalShowing = +this.rowStart + +this.itemParents.length - 1;
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

  loadUnitsOfMeasures() {
    const model: ListUnitsOfMeasureRequest = {
      userID: this.currentUser.userID,
      specificUnitOfMeasureID: -1,
      filter: this.filter,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
    this.unitService.list(model).then(
      (res: ListUnitsOfMeasure) => {

        this.UOMList = res.unitOfMeasureList;

      },
      (msg) => {
        this.showLoader = false;
        this.notify.errorsmsg(
          'Server Error',
          'Something went wrong while trying to access the server'
         );
      }
    );
  }

  pageChange($event: {rowStart: number, rowEnd: number}) {
    this.rowStart = $event.rowStart;
    this.rowEnd = $event.rowEnd;
    this.loadItemsParents(false);
  }

  searchBar() {
    this.rowStart = 1;
    this.loadItemsParents(false);
  }


  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadItemsParents(false);
  }

  popClick(event, obj) {
    this.ItemParent = obj;
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
    this.loadItemsParents(true);
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadItemsParents(false);
  }

  backToItems() {
    this.router.navigate(['companies/items']);
  }

  editItemParent(id: number) {
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.Quantity = this.ItemParent.quantity;
    this.UnitsofMeasureID = this.ItemParent.unitsOfMeasureID;
    this.StartDate = this.ItemParent.startDate;
    this.EndDate = this.ItemParent.endDate;
    this.openeditModal.nativeElement.click();
  }

  UpdateItemParent(id: number) {
    const requestModel = {
      userID: this.currentUser.userID,
      itemParentID: this.ItemParent.itemParentID,
      quantity: this.Quantity,
      unitOfMeasureID: this.UnitsofMeasureID,
      startDate: this.StartDate,
      endDate: this.EndDate
    };

    this.companyService.UpdateItemParent(requestModel).then(
      (res: UpdateItemParent) => {
        if (res.outcome.outcome === 'SUCCESS') {
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          this.closeeditModal.nativeElement.click();
          this.loadItemsParents(false);
        } else {
          this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
        }
      },
      (msg) => this.notify.errorsmsg('Failure', 'Cannot reach server')
    );
  }

  removeItemParent(id: number) {
    const requestModel = {
      userID: this.currentUser.userID,
      itemParentID: this.ItemParent.itemParentID,
      isDeleted: 1
    };

    this.companyService.RemoveItemParent(requestModel).then(
      (res: UpdateItemParent) => {
        if (res.outcome.outcome === 'SUCCESS') {
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          this.loadItemsParents(false);
        } else {
          this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
        }
      },
      (msg) => this.notify.errorsmsg('Failure', 'Cannot reach server')
    );
  }

  onUOMChange(id: number) {
    this.UnitsofMeasureID = id;
  }
}




