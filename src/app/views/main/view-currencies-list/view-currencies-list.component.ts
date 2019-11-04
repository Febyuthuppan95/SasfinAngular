import { AddAddressTypesResponse } from './../../../models/HttpResponses/AddAddressTypesResponse';
import { AddressTypesListResponse } from './../../../models/HttpResponses/AddressTypesListResponse';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
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
import { CurrenciesService } from 'src/app/services/Currencies.Service';
import { CurrenciesListRequest } from 'src/app/models/HttpRequests/CurrenciesList';
import { Currency } from 'src/app/models/HttpResponses/Currency';
import { ListCurrencies } from 'src/app/models/HttpResponses/ListCurrencies';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-currencies-list',
  templateUrl: './view-currencies-list.component.html',
  styleUrls: ['./view-currencies-list.component.scss']
})
export class ViewCurrenciesListComponent implements OnInit, OnDestroy {

  constructor(private themeService: ThemeService, private currencyService: CurrenciesService, private userService: UserService) {}

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  currentTheme = 'light';

  currencies: CurrenciesListRequest = {
    userID: 3,
    specificCurrencyID: -1,
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
  dataset: Currency[];

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

  focusCurrencyId: number;
  focusCurrencyCode: string;
  focusCurrencyName: string;
  focusCurrencyFactor: string;

  newCurrencyCode: string;
  newCurrencyName: string;
  newCurrencyFactor: string;

  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.selectRowDisplay = 15;

    this.loadCurrencies();

    this.activePage = +1;
    this.prevPageState = true;
    this.nextPageState = false;
    this.prevPage = +this.activePage - 1;
    this.nextPage = +this.activePage + 1;
  }

  loadCurrencies() {
    this.currencyService.list(this.currencies).then(
      (res: ListCurrencies) => {
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
          this.dataset = res.currenciesList;
          this.rowCount = res.rowCount;

          if (res.rowCount > this.selectRowDisplay) {
            this.totalDisplayCount = res.currenciesList.length;
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
    this.currencies.rowStart = page.rowStart;
    this.currencies.rowEnd = page.rowEnd;
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
    this.loadCurrencies();
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
        page.rowEnd = this.currencies.rowEnd;
        this.showingPages[1] = page;
      }
    }

    if (+this.activePage + 1 <= pagenumber) {
      this.showingPages[2] = this.pages[+this.activePage + 1];
    }
  }

  updateSort(orderBy: string) {
    if (this.currencies.orderBy === orderBy) {
      if (this.currencies.orderByDirection === 'ASC') {
        this.currencies.orderByDirection = 'DESC';
      } else {
        this.currencies.orderByDirection = 'ASC';
      }
    } else {
      this.currencies.orderByDirection = 'ASC';
    }

    this.currencies.orderBy = orderBy;
    this.orderIndicator = `${this.currencies.orderBy}_${this.currencies.orderByDirection}`;
    this.loadCurrencies();
  }

  searchBar() {
    this.currencies.rowStart = 1;
    this.currencies.rowEnd = this.selectRowDisplay;
    this.loadCurrencies();
  }

  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  popClick(event, id: number, code: string, name: string, factor: string) {
    if (this.sidebarCollapsed) {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    } else {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    }

    this.focusCurrencyId = id;
    this.focusCurrencyCode = code;
    this.focusCurrencyName = name;
    this.focusCurrencyFactor = factor;

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

   editCurrenciesList($event) {
     this.themeService.toggleContextMenu(false);
     this.contextMenu = false;
     this.openModal.nativeElement.click();
   }

  // updateAddressType() {
  //   let errors = 0;

  //   if (this.focusAddressTypeName === '' || this.focusAddressTypeName === undefined) {
  //     errors++;
  //   }
  //   const requestModel: UpdateAddressTypeRequest = {
  //     userID: 3,
  //     addressTypeID: this.focusAddressTypeId,
  //     name: this.focusAddressTypeName,
  //     isDeleted: 0
  //   };
  //   if (errors === 0) {

  //     this.addressTypeService.update(requestModel).then(
  //       (res: UpdateAddressTypesResponse) => {
  //         this.closeModal.nativeElement.click();

  //         this.addressTypes.rowStart = 1;
  //         this.addressTypes.rowEnd = this.selectRowDisplay;
  //         this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);

  //         this.loadAddressTypes();
  //       },
  //       (msg) => {
  //         this.notify.errorsmsg('Failure', msg.message);
  //       }
  //     );
  //   } else {
  //     this.notify.toastrwarning('Warning', 'Please enter all fields when updating a help glossary item.');
  //   }
  // }


  // /* Add Handlers from context menu */

  addCurrenciesListModal() {
  //   this.newAddressTypeName = '';
     this.addModalOpen.nativeElement.click();
   }

  // addAddressType($event) {
  //    const requestModel = {
  //      userID: this.currentUser.userID,
  //      name: this.newAddressTypeName
  //    };

  //    this.addressTypeService.add(requestModel).then(
  //      (res: AddAddressTypesResponse) => {
  //        if (res.outcome.outcome === 'SUCCESS') {
  //          this.newAddressTypeName = '';
  //          this.addModalClose.nativeElement.click();
  //          this.loadAddressTypes();
  //        } else {
  //          alert('Error Adding');
  //        }
  //      },
  //      (msg) => {
  //        alert('Error');
  //      }
  //    );
  //   }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
