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

  @Output() pageChangeEvent = new EventEmitter<PaginationChange>();

  activePage = +1;
  prevPageState = true;
  nextPageState = false;
  prevPage = +this.activePage - 1;
  nextPage = +this.activePage + 1;
  pages: Pagination[];
  showingPages: Pagination[];
  recordEnd: number;
  showPagination: boolean;

  // Temporary Properties
  recordsPerPageTemp: number;
  rowCountTemp: number;

  constructor() { }

  ngOnInit() {
    this.recordsPerPageTemp = this.recordsPerPage;
    this.rowCountTemp = this.rowCount;
    this.paginateData();
  }

  ngOnChanges() {
    if (this.recordsPerPage !== this.recordsPerPageTemp) {
      this.recordsPerPageTemp = this.recordsPerPage;
      this.activePage = 1;
      this.paginateData();
      this.pageChange(1);
    }

    if (this.rowCountTemp !== this.rowCount) {
      this.rowCountTemp = this.rowCount;
      this.activePage = 1;
      this.paginateData();
    }
  }

  paginateData() {
    let rowStart = 1;
    let rowEnd = rowStart + +this.recordsPerPage - 1;

    // Number of Pages
    const pageCount = +this.rowCount / +this.recordsPerPage;

    this.pages = [];

    for (let i = 0; i < pageCount; i++) {
      this.pages.push({
        page: i + 1,
        rowStart: +rowStart,
        rowEnd: +rowEnd
      });

      rowStart = +rowEnd + 1;
      rowEnd += +this.recordsPerPage;
    }

    this.updatePagination();
  }

  pageChange(pageNumber: number) {
    const page = this.pages[+pageNumber - 1];
    this.rowStart = page ? page.rowStart : 1;
    this.rowEnd = page ? page.rowEnd : 15;
    this.activePage = +pageNumber;
    this.prevPage = +this.activePage - 1;
    this.nextPage = +this.activePage + 1;

    if (this.prevPage < 1) {
      this.prevPageState = true;
    } else {
      this.prevPageState = false;
    }

    // let pagenumber = +this.rowCount / +this.recordsPerPage;
    // const mod = +this.rowCount % +this.recordsPerPage;
    //
    // if (mod > 0) {
    //   pagenumber++;
    // }

    if (this.nextPage > this.pages.length) {
      this.nextPageState = true;
    } else {
      this.nextPageState = false;
    }

    this.pageChangeEvent.emit({rowStart: this.rowStart, rowEnd: this.rowEnd});
    this.updatePagination();
  }

  // page: number;
  // rowStart: number;
  // rowEnd: number;
  updatePagination() {
    if (this.rowCount <= this.recordsPerPage) {
      this.prevPageState = false;
      this.nextPageState = false;
      this.showingPages = [{page: 1, rowStart: 1, rowEnd: +this.recordsPerPage}];
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

      if (+this.activePage + 1 <= pagenumber-1) {
        this.showingPages[2] = this.pages[+this.activePage+1];
      }
    }
    this.showPagination = true;
    // console.log(this.showingPages);
  }

}

export class PaginationChange {
  rowStart: number;
  rowEnd: number;
}
