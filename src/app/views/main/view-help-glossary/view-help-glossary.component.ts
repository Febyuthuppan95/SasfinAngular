import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Pagination } from '../../../models/Pagination';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { ImageModalComponent } from '../../../components/image-modal/image-modal.component';
import { UserService } from '../../../services/user.Service';
import { User } from '../../../models/HttpResponses/User';
import { ThemeService } from 'src/app/services/theme.Service.js';
import { environment } from '../../../../environments/environment';
import { ImageModalOptions } from 'src/app/models/ImageModalOptions';
import { HelpGlossaryService } from 'src/app/services/HelpGlossary.Service';
import { ListHelpGlossary } from 'src/app/models/HttpRequests/ListHelpGlossary';
import { ListHelpGlossaryResponse, ListHelpGlossaryItem } from 'src/app/models/HttpResponses/ListHelpGlossaryResponse';
import { ContextMenuComponent } from 'src/app/components/menus/context-menu/context-menu.component';
import { UpdateHelpGlossary } from 'src/app/models/HttpRequests/UpdateHelpGlossary';
import { UpdateHelpGlossaryResponse } from 'src/app/models/HttpResponses/UpdateHelpGlossaryResponse';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-help-glossary',
  templateUrl: './view-help-glossary.component.html',
  styleUrls: ['./view-help-glossary.component.scss']
})
export class ViewHelpGlossaryComponent implements OnInit, OnDestroy {

  constructor(
    private helpGlossaryService: HelpGlossaryService,
    private userService: UserService,
    private themeService: ThemeService,
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
    this.loadHelpGlossary();
  }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild(ImageModalComponent, { static: true })
  private imageModal: ImageModalComponent;


  @ViewChild('openModal', { static: true })
  openModal: ElementRef;

  @ViewChild('closeModal', { static: true })
  closeModal: ElementRef;

  defaultProfile =
    `${environment.ApiProfileImages}/default.jpg`;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;

  pages: Pagination[];
  showingPages: Pagination[];
  dataset: ListHelpGlossaryItem[];
  rowCount: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;

  rowStart: number;
  rowEnd: number;
  filter: string;
  orderBy: string;
  orderDirection: string;

  totalShowing: number;
  orderIndicator = 'Name_ASC';
  rowCountPerPage: number;
  showingRecords: number;
  activePage: number;

  focusHelp: number;
  focusHelpName: string;
  focusDescription: string;

  noData = false;
  showLoader = true;
  displayFilter = false;

  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  sidebarCollapsed = true;
  selectedRow = -1;

  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  paginateData() {
    let rowStart = 1;
    let rowEnd = +this.rowCountPerPage;
    const pageCount = +this.rowCount / +this.rowCountPerPage;
    this.pages = Array<Pagination>();

    for (let i = 0; i < pageCount; i++) {
      const item = new Pagination();
      item.page = i + 1;
      item.rowStart = +rowStart;
      item.rowEnd = +rowEnd;
      this.pages[i] = item;
      rowStart = +rowEnd + 1;
      rowEnd += +this.rowCountPerPage;
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

    let pagenumber = +this.rowCount / +this.rowCountPerPage;
    const mod = +this.rowCount % +this.rowCountPerPage;

    if (mod > 0) {
      pagenumber++;
    }

    if (this.nextPage > pagenumber) {
      this.nextPageState = true;
    } else {
      this.nextPageState = false;
    }

    this.updatePagination();

    this.loadHelpGlossary();
  }

  searchBar() {
    this.rowStart = 1;
    this.loadHelpGlossary();
  }

  loadHelpGlossary() {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;

    const model: ListHelpGlossary = {
      filter: this.filter,
      // userID: this.currentUser.userID,
      userID: 3,
      specificHelpGlossaryID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderDirection: this.orderDirection
    };

    this.helpGlossaryService
      .list(model)
      .then(
        (res: ListHelpGlossaryResponse) => {
          if (res.rowCount === 0) {
            this.noData = true;
            this.showLoader = false;
          } else {
            this.noData = false;
            this.dataset = res.helpGlossaryList;
            this.rowCount = res.rowCount;
            this.showLoader = false;
            this.showingRecords = res.helpGlossaryList.length;
            this.totalShowing = +this.rowStart + +this.dataset.length - 1;
            this.paginateData();
          }
        },
        () => {
          this.showLoader = false;
          this.notify.errorsmsg(
            'Server Error',
            'Something went wrong while trying to access the server.'
          );
        }
      );
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
    this.loadHelpGlossary();
  }

  inspectUserImage(src: string) {
    const options = new ImageModalOptions();
    options.width = '100%';

    this.imageModal.open(src, options);
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

  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  popClick(event, id, name, description) {
    if (this.sidebarCollapsed) {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    } else {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    }

    this.focusHelp = id;
    this.focusHelpName = name;
    this.focusDescription = description;

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

  editHelp() {
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.openModal.nativeElement.click();
  }

  updateGlossary() {
    let errors = 0;

    if (this.focusHelpName === '') {
      errors++;
    }

    if (this.focusDescription === '') {
      errors++;
    }

    if (errors === 0) {
      const requestModel: UpdateHelpGlossary = {
        userID: 3,
        helpGlossaryID: this.focusHelp,
        name: this.focusHelpName,
        description: this.focusDescription
      };

      this.helpGlossaryService.update(requestModel).then(
        (res: UpdateHelpGlossaryResponse) => {
          this.closeModal.nativeElement.click();
          this.loadHelpGlossary();
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
        },
        () => {
          this.notify.errorsmsg('Failure', 'Cannot reach server.');
        }
      );
    } else {
      this.notify.toastrwarning('Warning', 'Please enter all fields when updating a help glossary item.');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
