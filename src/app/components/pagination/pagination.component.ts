import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() recordsPerPage: number;
  @Input() recordCount: number;
  @Input() rowStart: number;
  @Input() rowEnd: number;
  @Input() currentTheme: string;

  @Output() pageChangeEvent = new EventEmitter<{ rowStart: number, rowEnd: number }>();

  activePage: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;
  pages: Pagination[];
  showingPages: Pagination[];
  recordEnd: number;

  constructor() { }

  ngOnInit() {
  }

  paginateData() {
    let rowStart = 1;
    let rowEnd = +this.recordsPerPage;
    const pageCount = +this.recordCount / +this.recordsPerPage;
    this.pages = Array<Pagination>();

    for (let i = 0; i < pageCount; i++) {
      // tslint:disable-next-line: no-use-before-declare
      const item = new Pagination();
      item.page = i + 1;
      item.rowStart = +rowStart;
      item.rowEnd = +rowEnd;
      this.pages[i] = item;
      rowStart = +rowEnd + 1;
      rowEnd += +this.recordsPerPage;
    }

    this.recordEnd = +this.rowStart + +this.recordsPerPage - 1;

    this.updatePagination();
  }

  pageChange(pageNumber: number) {
    const page = this.pages[+pageNumber - 1];
    const rowStart = page.rowStart;
    const rowEnd = page.rowEnd;
    this.activePage = +pageNumber;
    this.prevPage = +this.activePage - 1;
    this.nextPage = +this.activePage + 1;

    if (this.prevPage < 1) {
      this.prevPageState = true;
    } else {
      this.prevPageState = false;
    }

    let pagenumber = +this.recordCount / +this.recordsPerPage;
    const mod = +this.recordCount % +this.recordsPerPage;

    if (mod > 0) {
      pagenumber++;
    }

    if (this.nextPage > pagenumber) {
      this.nextPageState = true;
    } else {
      this.nextPageState = false;
    }

    this.pageChangeEvent.emit({
      rowStart,
      rowEnd
    });

    this.updatePagination();
  }

  updatePagination() {
    if (this.recordCount <= this.recordsPerPage) {
      this.prevPageState = false;
      this.nextPageState = false;
    } else {
      this.showingPages = Array<Pagination>();
      this.showingPages[0] = this.pages[this.activePage - 1];
      const pagenumber = +this.recordCount / +this.recordsPerPage;

      if (this.activePage < pagenumber) {
        this.showingPages[1] = this.pages[+this.activePage];

        if (this.showingPages[1] === undefined) {
          // tslint:disable-next-line: no-use-before-declare
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

    this.recordEnd = +this.rowStart + +this.recordsPerPage - 1;
  }

}

export class Pagination {
  page: number;
  rowStart: number;
  rowEnd: number;
}
