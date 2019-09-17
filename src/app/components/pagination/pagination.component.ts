import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';


export class Pagination {
  page: number;
  rowStart: number;
  rowEnd: number;
}


@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() recordsPerPage: number;
  @Input() recordCount: number;
  @Input() rowCount: number;
  @Input() rowStart: number;
  @Input() rowEnd: number;
  @Input() currentTheme: string;

  @Output() pageChangeEvent = new EventEmitter<{ rowStart: number, rowEnd: number }>();

  activePage = +1;
  prevPageState = true;
  nextPageState = false;
  prevPage = +this.activePage - 1;
  nextPage = +this.activePage + 1;
  pages: Pagination[];
  showingPages: Pagination[];
  recordEnd: number;
  showPagination: boolean;
  recordsPerPageTemp: number;

  constructor() { }

  ngOnInit() {
    this.recordsPerPageTemp = this.recordsPerPage;
    this.paginateData();
  }

  ngOnChanges() {
    if (this.recordsPerPage !== this.recordsPerPageTemp) {
      this.recordsPerPageTemp = this.recordsPerPage;
      this.activePage = 1;
      this.paginateData();
    }
  }

  paginateData() {
    let rowStart = 1;
    let rowEnd = +this.recordsPerPage;
    const pageCount = +this.rowCount / +this.recordsPerPage;
    this.pages = Array<Pagination>();

    for (let i = 0; i < pageCount; i++) {
      const item = new Pagination();
      item.page = i + 1;
      item.rowStart = +rowStart;
      item.rowEnd = +rowEnd;
      this.pages[i] = item;
      rowStart = +rowEnd + 1;
      rowEnd += +this.recordsPerPage;
    }
    this.updatePagination();
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

    let pagenumber = +this.rowCount / +this.recordsPerPage;
    const mod = +this.rowCount % +this.recordsPerPage;

    if (mod > 0) {
      pagenumber++;
    }

    if (this.nextPage > pagenumber) {
      this.nextPageState = true;
    } else {
      this.nextPageState = false;
    }

    this.pageChangeEvent.emit({rowStart: this.rowStart, rowEnd: this.rowEnd});
    this.updatePagination();
  }

  updatePagination() {
    if (this.rowCount <= this.recordsPerPage) {
      this.prevPageState = false;
      this.nextPageState = false;
    } else {
      this.showingPages = Array<Pagination>();
      this.showingPages[0] = this.pages[this.activePage - 1];
      const pagenumber = +this.rowCount / +this.recordsPerPage;

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
    this.showPagination = true;
  }

}
