import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextMenuComponent } from 'src/app/components/menus/context-menu/context-menu.component';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/HttpResponses/User';
import { Pagination } from 'src/app/models/Pagination';
import { CompanyAddressResponse, Address } from 'src/app/models/HttpResponses/CompanyAddressResponse';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { Cities } from 'src/app/models/HttpResponses/CitiesResponse ';
import { CitiesResponse } from 'src/app/models/HttpResponses/CitiesResponse ';
import { CitiesService } from 'src/app/services/Cities.Service';
import {FormControl} from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { AddCompanyAddress, UpdateCompanyAddress } from 'src/app/models/HttpRequests/Company';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-company-addresses',
  templateUrl: './view-company-addresses.component.html',
  styleUrls: ['./view-company-addresses.component.scss']
})
export class ViewCompanyAddressesComponent implements OnInit, OnDestroy {

  constructor(
    private companyService: CompanyService,
    private cityService: CitiesService,
    private userService: UserService,
    private themeService: ThemeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
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

  }

  @ViewChild('openeditModal', {static: true})
  openeditModal: ElementRef;

  @ViewChild('closeeditModal', {static: true})
  closeeditModal: ElementRef;

  @ViewChild('openaddModal', {static: true})
  openaddModal: ElementRef;

  @ViewChild('closeaddModal', {static: true})
  closeaddModal: ElementRef;

  @ViewChild(ContextMenuComponent, {static: true } )
  private contextmenu: ContextMenuComponent;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;
  @ViewChild('auto', {static: false})
  private autoComplete: MatAutocomplete;

  private unsubscribe$ = new Subject<void>();

  defaultProfile =
    `${environment.ApiProfileImages}/default.jpg`;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;

  pages: Pagination[];
  showingPages: Pagination[];
  dataset: CompanyAddressResponse;
  Citiesset: CitiesResponse;
  dataList: Address[] = [];
  CitiesList: Cities[] = [];
  autocompleteCities: Cities[] = [];
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
  CitySearch: string;
  totalShowing: number;
  orderIndicator = 'Name_ASC';
  rowCountPerPage: number;
  showingRecords: number;
  activePage: number;

  focusAddressID: number;
  focusCompName: string;
  focusDescription: string;
  Address1 = '';
  Address2 = '';
  Address3 = '';
  POBox = '';
  focusAddress1 = '';
  focusAddress2 = '';
  focusAddress3 = '';
  focusPOBox = '';
  focusAddressType = '';
  focusAddresTypeID = 0;
  focusCityID = 0;
  focusCityName = '';
  cityID = 0;
  AddressTypesList: any[] = [];
  noData = false;
  showLoader = true;
  displayFilter = false;
  disableAddressSelect = false;
  selectedAddressIndex: number;

  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  sidebarCollapsed = true;
  selectedRow = -1;
  Type = 0;

  companyName: string;
  companyID: number;

  myControl = new FormControl();
  typeControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    const temp = {
      TypeID: 1,
      TypeName: 'Office Building'
    };
    this.AddressTypesList.push(temp);

    this.companyService.observeCompany().subscribe((obj: SelectedCompany) => {
      this.companyID = obj.companyID;
      this.companyName = obj.companyName;

      this.loadCompanyInfoList();
      this.loadCitiesList(true);
    });
  }

  backToCompanies() {
    this.router.navigate(['companies']);
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

    this.loadCompanyInfoList();
  }

  searchBar() {
    this.rowStart = 1;
    this.loadCompanyInfoList();
  }

  CityBar() {
    this.rowStart = 1;
    this.loadCitiesList();
  }
  selectedCity(cityid) {
    this.cityID = cityid;
  }

  loadCompanyInfoList() {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;

    const model = {
      filter: this.filter,
      userID: this.currentUser.userID,
      specificCompanyID: this.companyID,
      specificAddressID: -1,
      specificAddressTypeID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };

    this.companyService.address(model).then(
        (res: CompanyAddressResponse) => {
          if (res.rowCount === 0) {
            this.noData = true;
            this.showLoader = false;
          } else {
            this.noData = false;
            this.dataset = res;
            this.dataList = res.addresses;
            this.rowCount = res.rowCount;
            this.showLoader = false;
            this.showingRecords = res.addresses.length;
            this.totalShowing = +this.rowStart + +this.dataset.addresses.length - 1;
            this.paginateData();
          }
        },
        msg => {
          this.showLoader = false;
          this.notify.errorsmsg(
            'Server Error 102',
            'Something went wrong while trying to access the server.'
          );
          console.log(JSON.stringify(msg));
        }
      );
  }

  loadCitiesList(replaceDataset?: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;

    const model = {
      filter: this.CitySearch ? this.CitySearch : '',
      userID: this.currentUser.userID,
      specificCityID: -1,
      specificRegionID: -1,
      specificCountryID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };

    this.cityService.list(model).then(
        (res: CitiesResponse) => {
            this.Citiesset = res;
            this.autocompleteCities = res.citiesLists;

            if (replaceDataset) {
              this.CitiesList = res.citiesLists;
            }

            this.showLoader = false;
        },
        msg => {
          this.showLoader = false;
          this.notify.errorsmsg(
            'Server Error2',
            'Something went wrong while trying to access the server.'
          );
          console.log(JSON.stringify(msg));
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
    this.loadCompanyInfoList();
  }

  updatePagination() {
    if (this.dataset.addresses.length <= this.totalShowing) {
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

  popClick(event, id, address1, address2, address3, poBox, addressType, addressTypeID, cityid, cityname) {
    if (this.sidebarCollapsed) {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    } else {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    }

    this.focusAddressID = id;
    this.focusAddress1 = address1;
    this.focusAddress2 = address2;
    this.focusAddress3 = address3;
    this.focusPOBox = poBox;
    this.focusAddressType = addressType;
    this.focusAddresTypeID = addressTypeID;
    this.focusCityID = cityid;
    this.focusCityName = cityname;

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

  Add() {
    this.Address1 = undefined;
    this.Address2 = undefined;
    this.Address3 = undefined;
    this.POBox = undefined;
    this.cityID = undefined;
    this.myControl.reset();
    this.typeControl.reset(-1);
    this.disableAddressSelect = false;
    this.selectedAddressIndex = 0;
    this.CitySearch = '';
    this.openaddModal.nativeElement.click();
  }

  addCompanyAddress() {
    let errors = 0;

    if (!this.Address1) {
      errors++;
    }

    if (this.Address2 === undefined) {
      errors++;
    }

    if (this.POBox === undefined) {
      errors++;
    }

    if (this.Type === undefined) {
      errors++;
    }

    if (this.cityID === undefined) {
      errors++;
    }

    if (this.CitySearch === '' || this.CitySearch === null || !this.CitySearch) {
      errors++;
    }

    if (errors === 0) {
      const requestModel: AddCompanyAddress = {
        userID: this.currentUser.userID,
        companyID: this.companyID,
        address1: this.Address1,
        address2: this.Address2,
        address3: this.Address3,
        POBox: this.POBox,
        addressTypeID: this.Type,
        cityID: this.cityID,
      };

      this.companyService.AddAddress(requestModel).then(
        (res: {outcome: Outcome}) => {
          if (res.outcome.outcome !== 'SUCCESS') {
          this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          } else {
            this.notify.successmsg('SUCCESS', 'Company address successfully added');
            this.loadCompanyInfoList();
            this.closeaddModal.nativeElement.click();
          }
        },
        msg => {
          this.notify.errorsmsg(
            'Server Error 102',
            'Something went wrong while trying to access the server.'
          );
          this.closeaddModal.nativeElement.click();
        }
      );
    } else {
      this.notify.toastrwarning('Warning', 'Please enter all fields before submitting');
    }
  }

  editCompanyAddress($event) {
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.Type =  this.focusAddresTypeID;
    this.CitySearch = this.focusCityName;
    this.cityID = this.focusCityID;
    this.Address1 = this.focusAddress1;
    this.Address2 = this.focusAddress2;
    this.Address3 = this.focusAddress3;
    this.POBox = this.focusPOBox;
    this.openeditModal.nativeElement.click();
  }

  UpdateCompanyAddress() {
    let errors = 0;

    if (this.CitySearch === '' || this.CitySearch === null || !this.CitySearch) {
      errors++;
    }

    if (errors === 0) {
      const requestModel: UpdateCompanyAddress = {
        userID: this.currentUser.userID,
        spesificAddressID: this.focusAddressID,
        address1: this.Address1,
        address2: this.Address2,
        address3: this.Address3,
        POBox: this.POBox,
        addressTypeID: this.Type,
        cityID: this.cityID,
      };
      this.companyService.UpdateAddress(requestModel).then(
        (res: {outcome: Outcome}) => {
            if (res.outcome.outcome !== 'SUCCESS') {
              this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
            } else {
              this.notify.successmsg('SUCCESS', 'Company address successfully Updated');
              this.closeeditModal.nativeElement.click();
              this.loadCompanyInfoList();
          }
        },
          msg => {
            this.notify.errorsmsg(
            'Server Error 102',
            'Something went wrong while trying to access the server.');
        });
    } else {
      this.notify.toastrwarning('Warning', 'Please enter all fields before submitting');
    }
  }

  onChange(id: number)   {
    this.disableAddressSelect = true;
    this.Type = id;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
