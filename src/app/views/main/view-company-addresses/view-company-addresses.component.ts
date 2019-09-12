import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { UpdateCompanyAddress } from 'src/app/models/HttpRequests/UpdateCompanyAddress';
import { AddCompanyAddress } from 'src/app/models/HttpRequests/AddCompanyAddress';
import { Cities } from 'src/app/models/HttpResponses/CitiesResponse ';
import { CitiesResponse } from 'src/app/models/HttpResponses/CitiesResponse ';
import { CitiesService } from 'src/app/services/Cities.Service';
import {FormControl} from '@angular/forms'

@Component({
  selector: 'app-view-company-addresses',
  templateUrl: './view-company-addresses.component.html',
  styleUrls: ['./view-company-addresses.component.scss']
})
export class ViewCompanyAddressesComponent implements OnInit {

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
    this.loadCompanyInfoList();
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
  POBox = '';
  focusAddress1 = '';
  focusAddress2 = '';
  focusPOBox = '';
  focusAddressType = '';
  focusAddresTypeID = 0
  AddressTypesList: any[] = [];
  noData = false;
  showLoader = true;
  displayFilter = false;
  disableInfoSelect = false;
  selectedInfoIndex: number;

  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  sidebarCollapsed = true;
  selectedRow = -1;

  companyName: string;
  companyID: number;

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];

  ngOnInit() {
    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });

    const temp = {
      TypeID: 1,
      TypeName: "Office Building"
    };
    this.AddressTypesList.push(temp); 

    // this.activatedRoute.paramMap
    // .subscribe(params => {
    //   this.companyID = +params.get('id');
    //   this.companyName = params.get('name');
    // });


    this.companyService.observeCompany().subscribe((obj: SelectedCompany) => {
      this.companyID = obj.companyID;
      this.companyName = obj.companyName;
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

  CitysearchBar() {
    this.rowStart = 1;
    this.loadCitiesList();
  }

  loadCompanyInfoList() {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;

    const model = {
      filter: this.filter,
      userID: this.currentUser.userID,
      specificCompanyID: -1,
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
            'Server Error',
            'Something went wrong while trying to access the server.'
          );
          console.log(JSON.stringify(msg));
        }
      );
  }

  loadCitiesList() {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;

    const model = {
      filter: this.CitySearch,
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
          if (res.rowCount === 0) {
            this.noData = true;
            this.showLoader = false;
          } else {
            this.noData = false;     
            this.Citiesset = res;      
            this.CitiesList = res.citiesLists;
            //this.rowCount = res.rowCount;
            this.showLoader = false;
            //this.showingRecords = res.citiesLists.length;
            //this.totalShowing = +this.rowStart + +this.dataset.addresses.length - 1;
           
          }
          console.log( this.CitiesList);
        },
        msg => {
          this.showLoader = false;
          this.notify.errorsmsg(
            'Server Error',
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

  popClick(event, id, name, address1, address2, poBox, addressType, addressTypeID) {
    if (this.sidebarCollapsed) {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    } else {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    }

    this.focusAddressID = id;
    this.focusCompName = name;
    this.focusAddress1 = address1;
    this.focusAddress2 = address2;
    this.focusPOBox = poBox;
    this.focusAddressType = addressType;
    this.focusAddresTypeID = addressTypeID;

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

  Add()
  {
    // this.Info = '';
    // this.Type = 0;
    // this.disableInfoSelect = false;
    // this.selectedInfoIndex = 0;
    this.openaddModal.nativeElement.click();
  }

  addCompanyAddress(type){
    const requestModel: AddCompanyAddress = {
      userID: this.currentUser.userID,
      companyID: this.companyID,
      address1: this.Address1,
      address2: this.Address2,
      POBox: this.POBox
      
    };

    this.companyService.AddAddress(requestModel).then(
      (res: {outcome: Outcome}) => {
          if (res.outcome.outcome !== 'SUCCESS') {
          this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          }
          else
          {
            this.notify.successmsg('SUCCESS','Company info successfully added');
            this.loadCompanyInfoList()
            this.closeaddModal.nativeElement.click();
          }
        },
        msg => {
          this.notify.errorsmsg(
            'Server Error',
            'Something went wrong while trying to access the server.'
          );
          this.closeaddModal.nativeElement.click();
        }
      );
  }

  editCompanyAddress($event)
  {
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    // this.Info = this.focusDescription;
    // this.Type =  this.focusCompTypeID;
    this.openeditModal.nativeElement.click();

  }

  UpdateCAddress(){
    const requestModel: UpdateCompanyAddress = {
      userID: this.currentUser.userID,
      specificCompanyAddressID: this.focusAddressID,
      address1: this.Address1,
      address2: this.Address2,
      POBox: this.POBox
      
        
    };



    this.companyService.UpdateAddress(requestModel).then(
      (res: {outcome: Outcome}) => {
          if (res.outcome.outcome !== 'SUCCESS') {
            this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          }
          else
          {
            this.notify.successmsg('SUCCESS','Company info successfully Updated');          
            this.closeeditModal.nativeElement.click();    
            this.loadCompanyInfoList()
          }                         
        },
        msg => {
          this.notify.errorsmsg(
            'Server Error',
            'Something went wrong while trying to access the server.'
          );              
        }
      );
  } 

  onChange(id: number) {
    
  }

}
