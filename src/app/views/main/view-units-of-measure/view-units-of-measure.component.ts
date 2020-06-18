import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Pagination } from 'src/app/models/Pagination';
import { ThemeService } from 'src/app/services/theme.Service';
import { UnitMeasureService } from 'src/app/services/Units.Service';
import { ListUnitsOfMeasure } from 'src/app/models/HttpResponses/ListUnitsOfMeasure';
import { UnitsOfMeasure } from 'src/app/models/HttpResponses/UnitsOfMeasure';
import { ContextMenuComponent } from 'src/app/components/menus/context-menu/context-menu.component';
import { UpdateUnitOfMeasureRequest } from 'src/app/models/HttpRequests/UpdateUnitsOfMeasure';
import { UpdateUnitsOfMeasureResponse } from 'src/app/models/HttpResponses/UpdateUnitsOfMeasureResponse';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TableHeader, TableConfig, TableHeading, Order, SelectedRecord } from 'src/app/models/Table';
import { PaginationChange } from 'src/app/components/pagination/pagination.component';

@Component({
  selector: 'app-view-units-of-measure',
  templateUrl: './view-units-of-measure.component.html',
  styleUrls: ['./view-units-of-measure.component.scss']
})
export class ViewUnitsOfMeasureComponent implements OnInit, OnDestroy {

  constructor(private themeService: ThemeService,
              private unitService: UnitMeasureService) {
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
              }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  currentTheme = 'light';
  filter: string;
  orderBy: string;
  orderDirection: string;

  @ViewChild(ContextMenuComponent, {static: true } )
  private contextmenu: ContextMenuComponent;

  @ViewChild('openModal', { static: true })
  openModal: ElementRef;

  @ViewChild('closeModal', { static: true })
  closeModal: ElementRef;

  private unsubscribe$ = new Subject<void>();

  selectRowDisplay: number;
  rowCount: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;
  totalRowCount: number;
  totalDisplayCount: number;
  dataset: UnitsOfMeasure[];

  rowStart: number;
  rowEnd: number;
  rowCountPerPage: number;
  activePage: number;
  totalShowing: number;
  orderIndicator = 'Surname_ASC';
  noData = false;
  showLoader = true;
  displayFilter = false;
  pages: Pagination[];
  showingPages: Pagination[];

  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  sidebarCollapsed = true;
  selectedRow = -1;

  focusUnitId: number;
  focusUnitName: string;
  focusUnitDescription: string;

  tableHeader: TableHeader = {
    title: 'Units of Measure',
    addButton: { enable: false, },
    backButton: { enable: false },
    filters: {
      search: true,
      selectRowCount: true,
    }
  };

  tableHeadings: TableHeading[] = [
    { title: '', propertyName: 'rowNum',  order: { enable: false } },
    { title: 'Name', propertyName: 'name', order: { enable: true, tag: 'Name' }, },
    { title: 'Description', propertyName: 'description', order: { enable: true, tag: 'Description' }, },
  ];

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.selectRowDisplay = 15;

    this.loadUnitsOfMeasures();

    this.activePage = +1;
    this.prevPageState = true;
    this.nextPageState = false;
    this.prevPage = +this.activePage - 1;
    this.nextPage = +this.activePage + 1;
  }

  loadUnitsOfMeasures() {
    console.log('running');
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;

    const unitsOfMeasure = {
      userID: 3,
      specificUnitOfMeasureID: -1,
      filter: this.filter,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd
    };
    this.unitService.list(unitsOfMeasure).then(
      (res: ListUnitsOfMeasure) => {
        console.log(res);
        this.showLoader = false;
        {
          if (res.outcome.outcome === 'SUCCESS') {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage
            );
          }
        }

        this.dataset = res.unitOfMeasureList;
        this.totalDisplayCount = res.unitOfMeasureList.length;

        if (res.rowCount === 0) {
          this.noData = true;
          this.showLoader = false;
        } else {
          this.noData = false;
          this.rowCount = res.rowCount;
          this.showLoader = false;
          this.totalDisplayCount = res.unitOfMeasureList.length;
          this.totalShowing = +this.rowStart + +this.dataset.length - 1;
        }
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

  pageChange(obj: PaginationChange) {
    this.rowStart = obj.rowStart;
    this.rowEnd = obj.rowEnd;

    this.loadUnitsOfMeasures();
  }

  updateSort(orderBy: string) {
    if (this.orderBy === orderBy) {
      if (this.orderDirection === 'ASC') {
        this.orderDirection = 'DESC';
      } else {
        this.orderDirection = 'ASC';
      }
    } else {
      this.orderDirection = 'ASC';
    }

    this.orderBy = orderBy;
    this.orderIndicator = `${this.orderBy}_${this.orderDirection}`;
    this.loadUnitsOfMeasures();
  }

  searchBar() {
    this.rowStart = 1;
    this.rowEnd = this.selectRowDisplay;
    this.loadUnitsOfMeasures();
  }

  orderChange($event: Order) {
    console.log($event);
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadUnitsOfMeasures();
  }

  recordsPerPageChange($event: number) {
    this.rowCountPerPage = $event;
    this.loadUnitsOfMeasures();
  }

  popOff() {
    this.contextMenu = false;
    this.selectedRow = -1;
  }

  setClickedRow(obj: SelectedRecord) {
    this.contextMenuX = obj.event.clientX + 3;
    this.contextMenuY = obj.event.clientY + 5;

    this.focusUnitId = obj.record.unitOfMeasureID;
    this.focusUnitName = obj.record.name;
    this.focusUnitDescription = obj.record.description;

    if (!this.contextMenu) {
      this.themeService.toggleContextMenu(true);
      this.contextMenu = true;
    } else {
      this.themeService.toggleContextMenu(false);
      this.contextMenu = false;
    }
  }

  editUnitOfMeasure($event) {
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.openModal.nativeElement.click();
  }

  updateUnit() {
    let errors = 0;

    if (this.focusUnitName === '' || this.focusUnitName === undefined) {
      errors++;
    }

    if (this.focusUnitDescription === '' || this.focusUnitDescription === undefined) {
      errors++;
    }

    if (errors === 0) {
      const requestModel: UpdateUnitOfMeasureRequest = {
        userID: 3,
        unitOfMeasureID: this.focusUnitId,
        name: this.focusUnitName,
        description: this.focusUnitDescription,
        isDeleted: 0,
      };

      this.unitService.update(requestModel).then(
        (res: UpdateUnitsOfMeasureResponse) => {
          this.closeModal.nativeElement.click();
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          this.loadUnitsOfMeasures();
        },
        (msg) => {
          this.notify.errorsmsg('Failure', msg.message);
        }
      );
    } else {
      this.notify.toastrwarning('Warning', 'Please enter all fields when updating a unit of measure item.');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
