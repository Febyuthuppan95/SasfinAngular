import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Pagination } from 'src/app/models/Pagination';
import { ThemeService } from 'src/app/services/theme.Service';
import { ListUnitsOfMeasureRequest } from 'src/app/models/HttpRequests/ListUnitsOfMeasure';
import { UnitMeasureService } from 'src/app/services/Units.Service';
import { ListUnitsOfMeasure } from 'src/app/models/HttpResponses/ListUnitsOfMeasure';
import { UnitsOfMeasure } from 'src/app/models/HttpResponses/UnitsOfMeasure';
import { ContextMenuComponent } from 'src/app/components/context-menu/context-menu.component';
import { UpdateUnitOfMeasureRequest } from 'src/app/models/HttpRequests/UpdateUnitsOfMeasure';
import { UpdateUnitsOfMeasureResponse } from 'src/app/models/HttpResponses/UpdateUnitsOfMeasureResponse';

@Component({
  selector: 'app-view-units-of-measure',
  templateUrl: './view-units-of-measure.component.html',
  styleUrls: ['./view-units-of-measure.component.scss']
})
export class ViewUnitsOfMeasureComponent implements OnInit {

  constructor(private themeService: ThemeService, private unitService: UnitMeasureService) {}

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  currentTheme = 'light';

  unitsOfMeasure: ListUnitsOfMeasureRequest = {
    userID: 3,
    specificUnitOfMeasureID: -1,
    filter: '',
    orderBy: 'Name',
    orderByDirection: 'ASC',
    rowStart: 1,
    rowEnd: 15
  };

  @ViewChild(ContextMenuComponent, {static: true } )
  private contextmenu: ContextMenuComponent;

  @ViewChild('openModal', { static: true })
  openModal: ElementRef;

  @ViewChild('closeModal', { static: true })
  closeModal: ElementRef;

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
    this.themeService.observeTheme().subscribe((theme) => {
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
    this.unitService.list(this.unitsOfMeasure).then(
      (res: ListUnitsOfMeasure) => {
        this.showLoader = false;
        //if()
        {
          if(res.outcome.outcome === "FAILURE"){
            this.notify.errorsmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage
            );
          }
          else
          {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage
            );
          }
        }


        if (res.outcome.outcome === 'SUCCESS') {
          this.dataset = res.unitOfMeasureList;
          this.rowCount = res.rowCount;

          if (res.rowCount > this.selectRowDisplay) {
            this.totalDisplayCount = res.unitOfMeasureList.length;
          } else {
            this.totalDisplayCount = res.rowCount;
          }

        } else {
          this.noData = true;
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

  pageChange(pageNumber: number) {
    const page = this.pages[+pageNumber - 1];
    this.unitsOfMeasure.rowStart = page.rowStart;
    this.unitsOfMeasure.rowEnd = page.rowEnd;
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
    this.showingPages = Array<Pagination>();
    this.showingPages[0] = this.pages[this.activePage - 1];
    const pagenumber = +this.totalRowCount / +this.selectRowDisplay;

    if (this.activePage < pagenumber) {
      this.showingPages[1] = this.pages[+this.activePage];

      if (this.showingPages[1] === undefined) {
        const page = new Pagination();
        page.page = 1;
        page.rowStart = 1;
        page.rowEnd = this.unitsOfMeasure.rowEnd;
        this.showingPages[1] = page;
      }
    }

    if (+this.activePage + 1 <= pagenumber) {
      this.showingPages[2] = this.pages[+this.activePage + 1];
    }
  }

  updateSort(orderBy: string) {
    if (this.unitsOfMeasure.orderBy === orderBy) {
      if (this.unitsOfMeasure.orderByDirection === 'ASC') {
        this.unitsOfMeasure.orderByDirection = 'DESC';
      } else {
        this.unitsOfMeasure.orderByDirection = 'ASC';
      }
    } else {
      this.unitsOfMeasure.orderByDirection = 'ASC';
    }

    this.unitsOfMeasure.orderBy = orderBy;
    this.orderIndicator = `${this.unitsOfMeasure.orderBy}_${this.unitsOfMeasure.orderByDirection}`;
    this.loadUnitsOfMeasures();
  }

  searchBar() {
    this.unitsOfMeasure.rowStart = 1;
    this.unitsOfMeasure.rowEnd = this.selectRowDisplay;
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
          console.log(res);
          this.closeModal.nativeElement.click();

          this.unitsOfMeasure = {
            userID: 3,
            specificUnitOfMeasureID: -1,
            filter: '',
            orderBy: 'Name',
            orderByDirection: 'ASC',
            rowStart: 1,
            rowEnd: 15
          };

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
}
