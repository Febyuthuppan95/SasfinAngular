import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Pagination } from 'src/app/models/Pagination';
import { ThemeService } from 'src/app/services/theme.Service';
import { ListUnitsOfMeasureRequest } from 'src/app/models/HttpRequests/ListUnitsOfMeasure';
import { UnitMeasureService } from 'src/app/services/Units.Service';
import { ListUnitsOfMeasure } from 'src/app/models/HttpResponses/ListUnitsOfMeasure';
import { UnitsOfMeasure } from 'src/app/models/HttpResponses/UnitsOfMeasure';
import { ContextMenuComponent } from 'src/app/components/menus/context-menu/context-menu.component';
import { UpdateUnitOfMeasureRequest } from 'src/app/models/HttpRequests/UpdateUnitsOfMeasure';
import { UpdateUnitsOfMeasureResponse } from 'src/app/models/HttpResponses/UpdateUnitsOfMeasureResponse';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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

  // unitsOfMeasure: ListUnitsOfMeasureRequest = {
  //   userID: 3,
  //   specificUnitOfMeasureID: -1,
  //   filter: '',
  filter: string;
  orderBy: string;
  orderDirection: string;
  //   rowStart: 1,
  //   rowEnd: 15
  // };

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
      orderBy: 'Name',
      orderByDirection: 'ASC',
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
         // this.paginateData();
        }

        // if (res.rowCount === 0) {
        //   this.noData = true;
        //   this.rowCount = res.rowCount;

          // if (res.rowCount > this.selectRowDisplay) {
          //   this.totalDisplayCount = res.unitOfMeasureList.length;
          // } else {
          //   this.totalDisplayCount = res.rowCount;
          // }

        // } else {
        //   this.noData = false;
        //   this.rowCount = res.rowCount;
        //   this.totalShowing = +this.rowStart + +this.dataset.length - 1;
        // }
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

  pageChange(pageNumber: number) {
    const page = this.pages[+pageNumber - 1];
    this.rowStart = page.rowStart;
    this.rowEnd = page.rowEnd;
    this.activePage = +pageNumber;
    this.prevPage = +this.activePage - 1;
    this.nextPage = +this.activePage + 1;

    if (this.prevPage < 1) {
      this.prevPageState = true;
    } else {
      this.prevPageState = false;
    }

    let pagenumber = +this.totalRowCount / +this.selectRowDisplay;
    const mod = +this.totalRowCount % +this.selectRowDisplay;

    if (mod > 0) {
      pagenumber++;
    }

    if (this.nextPage > pagenumber) {
      this.nextPageState = true;
    } else {
      this.nextPageState = false;
    }

    this.updatePagination();
    this.loadUnitsOfMeasures();
  }

  updatePagination() {
    if (this.dataset.length <= this.totalShowing) {
      this.prevPageState = false;
      this.nextPageState = false;
    } else {
      this.showingPages = Array<Pagination>();
      this.showingPages[0] = this.pages[this.activePage - 1];
      const pagenumber = +this.rowCount / +this.rowCountPerPage;

      if (this.activePage < pagenumber) {
        this.showingPages[1] = this.pages[+this.activePage];

        if (this.showingPages[1] === undefined) {
          const page = new Pagination();
          page.page = 1;
          page.rowStart = 1;
          page.rowEnd = this.rowEnd;
          this.showingPages[1] = page;
        }
      }

      if (+this.activePage + 1 <= pagenumber) {
        this.showingPages[2] = this.pages[+this.activePage + 1];
      }
    }

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

  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  popClick(event, id: number, name: string, description: string) {
    if (this.sidebarCollapsed) {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    } else {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    }

    this.focusUnitId = id;
    this.focusUnitName = name;
    this.focusUnitDescription = description;

    if (!this.contextMenu) {
      this.themeService.toggleContextMenu(true);
      this.contextMenu = true;
    } else {
      this.themeService.toggleContextMenu(false);
      this.contextMenu = false;
    }
  }

  popOff() {
    this.contextMenu = false;
    this.selectedRow = -1;
  }
  setClickedRow(index) {
    this.selectedRow = index;
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

          // const unitsOfMeasure = {
          //   userID: 3,
          //   specificUnitOfMeasureID: -1,
          //   filter: '',
          //   orderBy: 'Name',
          //   orderByDirection: 'ASC',
          //   rowStart: 1,
          //   rowEnd: 15
          // };

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
