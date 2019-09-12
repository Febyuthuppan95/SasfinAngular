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
import { AddressTypesService } from 'src/app/services/AddressTypes.Service';
import { AddressTypesListRequest } from 'src/app/models/HttpRequests/AddressTypesList';
import { ListAddressTypes } from 'src/app/models/HttpResponses/ListAddressTypes';
import { UpdateAddressTypeRequest } from 'src/app/models/HttpRequests/UpdateAddressTypes';
import { UpdateAddressTypesResponse } from 'src/app/models/HttpResponses/UpdateAddressTypesResponse';
import { AddressType } from 'src/app/models/HttpResponses/AddressType';
import { AddAddressTypesRequest } from 'src/app/models/HttpRequests/AddAddressTypesRequest';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { UserService } from 'src/app/services/user.Service';

@Component({
  selector: 'app-view-address-types-list',
  templateUrl: './view-address-types-list.component.html',
  styleUrls: ['./view-address-types-list.component.scss']
})
export class ViewAddressTypesListComponent implements OnInit {

  constructor(private themeService: ThemeService, private addressTypeService: AddressTypesService, private userService: UserService) {}

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  currentTheme = 'light';

  addressTypes: AddressTypesListRequest = {
    userID: 3,
    specificAddressTypeID: -1,
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
  dataset: AddressType[];

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

  focusAddressTypeId: number;
  focusAddressTypeName: string;

  newAddressTypeName: string;

  ngOnInit() {
    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.selectRowDisplay = 15;

    this.loadAddressTypes();

    this.activePage = +1;
    this.prevPageState = true;
    this.nextPageState = false;
    this.prevPage = +this.activePage - 1;
    this.nextPage = +this.activePage + 1;
  }

  loadAddressTypes() {
    this.addressTypeService.list(this.addressTypes).then(
      (res: ListAddressTypes) => {
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
          this.dataset = res.addressTypesList;
          this.rowCount = res.rowCount;

          if (res.rowCount > this.selectRowDisplay) {
            this.totalDisplayCount = res.addressTypesList.length;
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
    this.addressTypes.rowStart = page.rowStart;
    this.addressTypes.rowEnd = page.rowEnd;
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
    this.loadAddressTypes();
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
        page.rowEnd = this.addressTypes.rowEnd;
        this.showingPages[1] = page;
      }
    }

    if (+this.activePage + 1 <= pagenumber) {
      this.showingPages[2] = this.pages[+this.activePage + 1];
    }
  }

  updateSort(orderBy: string) {
    if (this.addressTypes.orderBy === orderBy) {
      if (this.addressTypes.orderByDirection === 'ASC') {
        this.addressTypes.orderByDirection = 'DESC';
      } else {
        this.addressTypes.orderByDirection = 'ASC';
      }
    } else {
      this.addressTypes.orderByDirection = 'ASC';
    }

    this.addressTypes.orderBy = orderBy;
    this.orderIndicator = `${this.addressTypes.orderBy}_${this.addressTypes.orderByDirection}`;
    this.loadAddressTypes();
  }

  searchBar() {
    this.addressTypes.rowStart = 1;
    this.addressTypes.rowEnd = this.selectRowDisplay;
    this.loadAddressTypes();
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

    this.focusAddressTypeId = id;
    this.focusAddressTypeName = name;

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

  editAddressTypes($event) {
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.openModal.nativeElement.click();
    console.log('open modal');
  }

  updateAddressType() {
    let errors = 0;

    if (this.focusAddressTypeName === '' || this.focusAddressTypeName === undefined) {
      errors++;
    }


    if (errors === 0) {
      const requestModel: UpdateAddressTypeRequest = {
        userID: 3,
        addressTypeID: this.focusAddressTypeId,
        name: this.focusAddressTypeName,
        isDeleted: 0,
      };

      this.addressTypeService.update(requestModel).then(
        (res: UpdateAddressTypesResponse) => {
          this.closeModal.nativeElement.click();

          this.addressTypes.rowStart = 1;
          this.addressTypes.rowEnd = this.selectRowDisplay;
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);

          this.loadAddressTypes();
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

  addAddressTypesModal($event) {
    this.addModalOpen.nativeElement.click();
    this.newAddressTypeName = '';
  }

  addAddressType() {
     const requestModel = {
       userID: this.currentUser.userID,
       name: this.newAddressTypeName
     };

     this.addressTypeService.add(requestModel).then(
       (res: Outcome) => {
         if (res.outcome === 'SUCCESS') {
           this.newAddressTypeName = '';
           this.addModalClose.nativeElement.click();
           this.loadAddressTypes();
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





  // addAddressType($event) {
  //   let errors = 0;

  //   // if (this.focusAddressTypeId !== null  && this.focusAddressTypeId !== undefined) {
  //   //   errors++;
  //   // }
  //   if (this.focusAddressTypeName === null || this.focusAddressTypeName === undefined) {
  //     errors++;
  //   }


  //   if (errors === 0) {
  //       const requestModel: AddAddressTypesRequest = {
  //         userID: 4,
  //         name: this.focusAddressTypeName
  //       };

  //       this.addressTypeService.add(requestModel).then(
  //         (res: UpdateAddressTypesResponse) => {
  //           this.closeModal.nativeElement.click();
  //           this.addressTypes.rowStart = 1;
  //           this.addressTypes.rowEnd = this.selectRowDisplay;
  //           this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);

  //           this.loadAddressTypes();
  //         },
  //         (msg) => {
  //           this.notify.errorsmsg('Failure', msg.message);
  //         }
  //       );
  //     } else {
  //       this.notify.toastrwarning('Warning', 'Please enter all fields when adding a help glossary item.');
  //     }
  //   }




