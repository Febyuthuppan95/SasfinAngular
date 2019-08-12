import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Pagination } from 'src/app/models/Pagination';
import { ThemeService } from 'src/app/services/theme.Service';
import { ListUnitsOfMeasureRequest } from 'src/app/models/HttpRequests/ListUnitsOfMeasure';
import { UnitMeasureService } from 'src/app/services/Units.Service';
import { ListUnitsOfMeasure } from 'src/app/models/HttpResponses/ListUnitsOfMeasure';
import { UnitsOfMeasure } from 'src/app/models/HttpResponses/UnitsOfMeasure';

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
  unitsOfMeasure: ListUnitsOfMeasureRequest;
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
  showingRecords: number;
  filter: string;
  rightName: string;
  activePage: number;
  orderBy: string;
  orderDirection: string;
  totalShowing: number;
  orderIndicator = 'Surname_ASC';
  noData = false;
  showLoader = true;
  displayFilter = false;
  pages: Pagination[];
  showingPages: Pagination[];

  ngOnInit() {
    this.unitsOfMeasure = new ListUnitsOfMeasureRequest();

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
        if (res.outcome.outcome !== 'SUCCESS') {
          this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          this.dataset = res.unitsOfMeasureList;
        }
      },
      (msg) => {
        this.notify.errorsmsg('Failure', 'We couldn\'t reach the server');
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
    this.unitsOfMeasure.rowStart = 1;
    this.unitsOfMeasure.rowEnd = this.selectRowDisplay;
    this.loadUnitsOfMeasures();
  }

  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }
}
