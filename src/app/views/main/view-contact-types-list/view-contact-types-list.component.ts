import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { ContactTypesService } from 'src/app/services/ContactTypes.Service';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { ContactTypesListRequest } from 'src/app/models/HttpRequests/ContactTypesList';
import { ContactType } from 'src/app/models/HttpResponses/ContactType';
import { Pagination } from 'src/app/models/Pagination';
import { ListContactTypes } from 'src/app/models/HttpResponses/ListContactTypes';

@Component({
  selector: 'app-view-contact-types-list',
  templateUrl: './view-contact-types-list.component.html',
  styleUrls: ['./view-contact-types-list.component.scss']
})
export class ViewContactTypesListComponent implements OnInit {

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

  newAddressTypeName: string;
  newContactTypeDescription: string;

  ngOnInit() {
    this.themeService.observeTheme().subscribe((theme) => {
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


}
