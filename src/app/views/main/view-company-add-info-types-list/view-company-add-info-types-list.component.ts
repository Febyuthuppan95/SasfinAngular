import { AddAddressTypesResponse } from './../../../models/HttpResponses/AddAddressTypesResponse';
import { AddressTypesListResponse } from './../../../models/HttpResponses/AddressTypesListResponse';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Pagination } from 'src/app/models/Pagination';
import { ThemeService } from 'src/app/services/theme.Service';
import { ListUnitsOfMeasureRequest } from 'src/app/models/HttpRequests/ListUnitsOfMeasure';
import { UnitsOfMeasure } from 'src/app/models/HttpResponses/UnitsOfMeasure';
import { UpdateAddressTypesResponse } from 'src/app/models/HttpResponses/UpdateAddressTypesResponse';
import { AddressTypesListRequest } from 'src/app/models/HttpRequests/AddressTypesList';
import { AddressType } from 'src/app/models/HttpResponses/AddressType';
import { ListAddressTypes } from 'src/app/models/HttpResponses/ListAddressTypes';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { UpdateAddressTypeRequest } from 'src/app/models/HttpRequests/UpdateAddressTypes';
import { AddressTypesService } from 'src/app/services/AddressTypes.Service';
import { UserService } from 'src/app/services/user.Service';
import { CompanyAddInfoTypesListRequest } from 'src/app/models/HttpRequests/CompanyAddInfoTypesList';
import { CompanyAddInfoTypesService } from 'src/app/services/CompanyAddInfoTypes.Service';
import { CompanyAddInfoType } from 'src/app/models/HttpResponses/CompanyAddInfoType';
import { ListCompanyAddInfoTypes } from 'src/app/models/HttpResponses/ListCompanyAddInfoTypes';
import { AddCompanyAddInfoTypesResponse } from 'src/app/models/HttpResponses/AddCompanyAddInfoTypesResponse';

@Component({
  selector: 'app-view-company-add-info-types-list',
  templateUrl: './view-company-add-info-types-list.component.html',
  styleUrls: ['./view-company-add-info-types-list.component.scss']
})
export class ViewCompanyAddInfoTypesListComponent implements OnInit {

  constructor(private themeService: ThemeService, private companyAddInfoTypeService: CompanyAddInfoTypesService, private userService: UserService) {}

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  currentTheme = 'light';

  companyAddInfoTypes: CompanyAddInfoTypesListRequest = {
    userID: 3,
    specificCompanyAddInfoTypeID: -1,
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
  dataset: CompanyAddInfoType[];

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

  focusCompanyAddInfoTypeId: number;
  focusCompanyAddInfoTypeName: string;

  newCompanyAddInfoTypeName: string;

  ngOnInit() {
    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.selectRowDisplay = 15;

    this.loadCompanyAddInfoTypes();

    this.activePage = +1;
    this.prevPageState = true;
    this.nextPageState = false;
    this.prevPage = +this.activePage - 1;
    this.nextPage = +this.activePage + 1;
  }

  loadCompanyAddInfoTypes() {
    this.companyAddInfoTypeService.list(this.companyAddInfoTypes).then(
      (res: ListCompanyAddInfoTypes) => {
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
          this.dataset = res.companyAddInfoTypesList;
          this.rowCount = res.rowCount;

          if (res.rowCount > this.selectRowDisplay) {
            this.totalDisplayCount = res.companyAddInfoTypesList.length;
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
    this.companyAddInfoTypes.rowStart = page.rowStart;
    this.companyAddInfoTypes.rowEnd = page.rowEnd;
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
    this.loadCompanyAddInfoTypes();
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
        page.rowEnd = this.companyAddInfoTypes.rowEnd;
        this.showingPages[1] = page;
      }
    }

    if (+this.activePage + 1 <= pagenumber) {
      this.showingPages[2] = this.pages[+this.activePage + 1];
    }
  }

  updateSort(orderBy: string) {
    if (this.companyAddInfoTypes.orderBy === orderBy) {
      if (this.companyAddInfoTypes.orderByDirection === 'ASC') {
        this.companyAddInfoTypes.orderByDirection = 'DESC';
      } else {
        this.companyAddInfoTypes.orderByDirection = 'ASC';
      }
    } else {
      this.companyAddInfoTypes.orderByDirection = 'ASC';
    }

    this.companyAddInfoTypes.orderBy = orderBy;
    this.orderIndicator = `${this.companyAddInfoTypes.orderBy}_${this.companyAddInfoTypes.orderByDirection}`;
    this.loadCompanyAddInfoTypes();
  }

  searchBar() {
    this.companyAddInfoTypes.rowStart = 1;
    this.companyAddInfoTypes.rowEnd = this.selectRowDisplay;
    this.loadCompanyAddInfoTypes();
  }

  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  popClick(event, id: number, name: string) {
    if (this.sidebarCollapsed) {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    } else {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    }

    this.focusCompanyAddInfoTypeId = id;
    this.focusCompanyAddInfoTypeName = name;

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

  editCompanyAddInfoTypes($event) {
    this.themeService.toggleContextMenu(false);
    /*this.contextMenu = false;*/
    this.openModal.nativeElement.click();
    console.log('open modal');
  }

  updateCompanyAddInfoType() {
    let errors = 0;

    if (this.focusCompanyAddInfoTypeName === '' || this.focusCompanyAddInfoTypeName === undefined) {
      errors++;
    }
    const requestModel: UpdateCompanyAddInfoTypeRequest = {
      userID: 3,
      addressTypeID: this.focusCompanyAddInfoTypeId,
      name: this.focusCompanyAddInfoTypeName,
      isDeleted: 0
    };
    if (errors === 0) {

      this.companyAddInfoTypeService.update(requestModel).then(
        (res: UpdateCompanyAddInfoTypesResponse) => {
          this.closeModal.nativeElement.click();

          this.companyAddInfoTypes.rowStart = 1;
          this.companyAddInfoTypes.rowEnd = this.selectRowDisplay;
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);

          this.loadCompanyAddInfoTypes();
        },
        (msg) => {
          this.notify.errorsmsg('Failure', msg.message);
        }
      );
    } else {
      this.notify.toastrwarning('Warning', 'Please enter all fields when updating a help glossary item.');
    }
  }


  // /* Add Handlers from context menu */

  addCompanyAddInfoTypesModal() {
    this.newCompanyAddInfoTypeName = '';
    this.addModalOpen.nativeElement.click();
  }

  addCompanyAddInfoType($event) {
     const requestModel = {
       userID: this.currentUser.userID,
       name: this.newCompanyAddInfoTypeName
     };

     this.companyAddInfoTypeService.add(requestModel).then(
       (res: AddCompanyAddInfoTypesResponse) => {
         console.log(res);
         if (res.outcome.outcome === 'SUCCESS') {
           this.newCompanyAddInfoTypeName = '';
           this.addModalClose.nativeElement.click();
           this.loadCompanyAddInfoTypes();
         } else {
           alert('Error Adding');
         }
       },
       (msg) => {
         alert('Error');
      }
    );
  }
}
