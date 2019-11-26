import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { ContactTypesService } from 'src/app/services/ContactTypes.Service';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { ContactTypesListRequest } from 'src/app/models/HttpRequests/ContactTypesList';
import { ContactType } from 'src/app/models/HttpResponses/ContactType';
import { Pagination } from 'src/app/models/Pagination';
import { ListContactTypes } from 'src/app/models/HttpResponses/ListContactTypes';
import { AddContactTypesResponse } from 'src/app/models/HttpResponses/AddContactTypesResponse';
import { UpdateContactTypeRequest } from 'src/app/models/HttpRequests/UpdateContactTypes';
import { UpdateContactTypesResponse } from 'src/app/models/HttpResponses/UpdateContactTypesResponse';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-contact-types-list',
  templateUrl: './view-contact-types-list.component.html',
  styleUrls: ['./view-contact-types-list.component.scss']
})
export class ViewContactTypesListComponent implements OnInit, OnDestroy {

  constructor(private themeService: ThemeService, private contactTypeService: ContactTypesService, private userService: UserService) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  currentTheme = 'light';

    contactTypes: ContactTypesListRequest = {
    userID: 3,
    specificContactTypeID: -1,
    filter: '',
    orderBy: 'Name',
    orderByDirection: 'ASC',
    rowStart: 1,
    rowEnd: 15
  };

  @ViewChild('openModal', { static: true })
  openModal: ElementRef;

  @ViewChild('closeModal', { static: true })
  closeModal: ElementRef;

  @ViewChild('addModalOpen', { static: true })
  addModalOpen: ElementRef;

  @ViewChild('addModalClose', { static: true })
  addModalClose: ElementRef;

  currentUser = this.userService.getCurrentUser();

  selectRowDisplay: number;
  rowCount: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;
  totalRowCount: number;
  totalDisplayCount: number;
  dataset: ContactType[];

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

  focusContactTypeId: number;
  focusContactTypeName: string;
  focusContactTypeDescription: string;

  newContactTypeName: string;
  newContactTypeDescription: string;

  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
  });

    this.selectRowDisplay = 15;

    this.loadContactTypes();

    this.activePage = +1;
    this.prevPageState = true;
    this.nextPageState = false;
    this.prevPage = +this.activePage - 1;
    this.nextPage = +this.activePage + 1;
  }

  loadContactTypes() {
    this.contactTypeService.list(this.contactTypes).then(
      (res: ListContactTypes) => {
        this.showLoader = false;
        {
          if (res.outcome.outcome === 'SUCCESS') {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage
            );
          }
        }


        if (res.outcome.outcome === 'SUCCESS') {
          this.dataset = res.contactTypesList;
          this.rowCount = res.rowCount;

          if (res.rowCount > this.selectRowDisplay) {
            this.totalDisplayCount = res.contactTypesList.length;
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
    this.contactTypes.rowStart = page.rowStart;
    this.contactTypes.rowEnd = page.rowEnd;
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
    this.loadContactTypes();
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
        page.rowEnd = this.contactTypes.rowEnd;
        this.showingPages[1] = page;
      }
    }

    if (+this.activePage + 1 <= pagenumber) {
      this.showingPages[2] = this.pages[+this.activePage + 1];
    }
  }

  updateSort(orderBy: string) {
    if (this.contactTypes.orderBy === orderBy) {
      if (this.contactTypes.orderByDirection === 'ASC') {
        this.contactTypes.orderByDirection = 'DESC';
      } else {
        this.contactTypes.orderByDirection = 'ASC';
      }
    } else {
      this.contactTypes.orderByDirection = 'ASC';
    }

    this.contactTypes.orderBy = orderBy;
    this.orderIndicator = `${this.contactTypes.orderBy}_${this.contactTypes.orderByDirection}`;
    this.loadContactTypes();
  }

  searchBar() {
    this.contactTypes.rowStart = 1;
    this.contactTypes.rowEnd = this.selectRowDisplay;
    this.loadContactTypes();
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

    this.focusContactTypeId = id;
    this.focusContactTypeName = name;
    this.focusContactTypeDescription = description;

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

  editContactTypes($event) {
    this.themeService.toggleContextMenu(false);
    /*this.contextMenu = false;*/
    this.openModal.nativeElement.click();
  }

  updateContactType() {
    let errors = 0;

    if (this.focusContactTypeName === '' || this.focusContactTypeName === undefined) {
      errors++;
    }
    if (this.focusContactTypeDescription === '' || this.focusContactTypeDescription === undefined) {
      errors++;
    }
    const requestModel: UpdateContactTypeRequest = {
      userID: 3,
      contactTypeID: this.focusContactTypeId,
      name: this.focusContactTypeName,
      description: this.focusContactTypeDescription,
      isDeleted: 0
    };
    if (errors === 0) {

      this.contactTypeService.update(requestModel).then(
        (res: UpdateContactTypesResponse) => {
          this.closeModal.nativeElement.click();

          this.contactTypes.rowStart = 1;
          this.contactTypes.rowEnd = this.selectRowDisplay;
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);

          this.loadContactTypes();
        },
        (msg) => {
          this.notify.errorsmsg('Failure', msg.message);
        }
      );
    } else {
      this.notify.toastrwarning('Warning', 'Please enter all fields when updating a help glossary item.');
    }
  }



  /* Add Handlers from context menu */
  addContactTypesModal() {
    this.newContactTypeName = '';
    this.newContactTypeDescription = '';
    this.addModalOpen.nativeElement.click();
  }

  addContactType($event) {
     const requestModel = {
       userID: this.currentUser.userID,
       name: this.newContactTypeName,
       description: this.newContactTypeDescription
     };

     this.contactTypeService.add(requestModel).then(
       (res: AddContactTypesResponse) => {
         if (res.outcome.outcome === 'SUCCESS') {
           this.newContactTypeName = '';
           this.newContactTypeDescription = '';
           this.addModalClose.nativeElement.click();
           this.loadContactTypes();
         } else {
           alert('Error Adding');
         }
       },
       (msg) => {
         alert('Error');
       }
     );
    }

    ngOnDestroy(): void {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }

}
