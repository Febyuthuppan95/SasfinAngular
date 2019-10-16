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
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { Cities } from 'src/app/models/HttpResponses/CitiesResponse ';
import { CitiesResponse } from 'src/app/models/HttpResponses/CitiesResponse ';
import {FormControl} from '@angular/forms';
import { MatAutocomplete } from '@angular/material';
import { CompanyServiceResponse, CompService } from 'src/app/models/HttpResponses/CompanyServiceResponse';
import { AddCompanyService } from 'src/app/models/HttpRequests/AddCompanyService';
import { UpdateCompanyService } from 'src/app/models/HttpRequests/UpdateCompanyService';
import { GetUserList } from 'src/app/models/HttpRequests/Users';
import { UserListResponse } from 'src/app/models/HttpResponses/UserListResponse';
import { UserList } from 'src/app/models/HttpResponses/UserList';
import { ResponsibleCapturer } from 'src/app/models/HttpResponses/ResponsibleCapturer';
import { ResponsibleConsultant } from 'src/app/models/HttpResponses/ResponsibleConsultant';
import { GetServiceLList } from 'src/app/models/HttpRequests/GetServiceLList';
import { ServiceListResponse } from 'src/app/models/HttpResponses/ServiceListResponse';
import { ServicesService } from 'src/app/services/Services.Service';
import { Service } from 'src/app/models/HttpResponses/Service';

@Component({
  selector: 'app-context-company-service-list',
  templateUrl: './context-company-service-list.component.html',
  styleUrls: ['./context-company-service-list.component.scss']
})
export class ContextCompanyServiceListComponent implements OnInit {
  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private ServiceService: ServicesService,
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

  defaultProfile =
    `${environment.ApiProfileImages}/default.jpg`;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;

  pages: Pagination[];
  showingPages: Pagination[];
  dataset: CompanyServiceResponse;
  Citiesset: CitiesResponse;
  dataList: CompService[] = [];
  rowCount: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;
  ServiceName: string;
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
  focusServiceID: number;
  ResConsultant: number;
  ResCapturer: number;
  StartDate: Date;
  EndDate: Date;
  capturerIndex = 0;
  serviceIndex = 0;
  consultantIndex = 0;

  ResConsultants: ResponsibleConsultant[] = [];
  ResCapturers: ResponsibleCapturer[] = [];
  selectedConsultant: number;
  selectedCapturer: number;
  userList: UserList[] = null;
  disableConSelect: boolean;
  disableCapSelect: boolean;
  disableSerSelect: boolean;
  ConID: number;
  CapID: number;
  SerID: number;
  serviceslist: Service[] = [];
  focusService: string;
  focusconsultant: number;
  focuscapturer: number;
  focusstart: Date;
  focusend: Date;
  focuscompserviceID: number;

  noData = false;
  showLoader = true;
  displayFilter = false;

  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  sidebarCollapsed = true;
  selectedRow = -1;
  Type = 0;

  companyName: string;
  companyID: number;

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];

  ngOnInit() {
    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.companyService.observeCompany().subscribe((obj: SelectedCompany) => {
      this.companyID = obj.companyID;
      this.companyName = obj.companyName;
    });

    this.loadCompanyServiceList();

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

    this.loadCompanyServiceList();
  }

  searchBar() {
    this.rowStart = 1;
    this.loadCompanyServiceList();
  }


  loadCompanyServiceList() {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;

    const model = {
      filter: this.filter,
      userID: this.currentUser.userID,
      specificCompanyID: this.companyID,
      specificServiceID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };

    this.companyService.service(model).then(
        (res: CompanyServiceResponse) => {
          if (res.rowCount === 0) {
            this.noData = true;
            this.showLoader = false;
          } else {
            this.noData = false;
            this.dataset = res;
            this.dataList = res.services;
            this.rowCount = res.rowCount;
            this.showLoader = false;
            this.showingRecords = res.services.length;
            this.totalShowing = +this.rowStart + +this.dataset.services.length - 1;
            this.paginateData();
          }

          this.loadUsers();
          this.loadServices(false);

        },
        msg => {
          this.showLoader = false;
          this.notify.errorsmsg(
            'Server Error',
            'Something went wrong while trying to access the server.'
          );
        }
      );
  }

  loadUsers() {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model: GetUserList = {
      filter: this.filter,
      userID: this.currentUser.userID,
      specificUserID: -1,
      rowStart: this.rowStart,
      rowEnd: 10000,
      orderBy: this.orderBy,
      orderDirection: this.orderDirection
    };
    this.userService
      .getUserList(model)
      .then(
        (res: UserListResponse) => {
          if (res.outcome.outcome === 'FAILURE') {
            this.notify.errorsmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage
            );
          }
          if (res.rowCount === 0) {
            this.noData = true;
            this.showLoader = false;
          } else {
            this.noData = false;
            this.rowCount = res.rowCount;
            this.showingRecords = res.userList.length;
            this.userList = res.userList;
            this.showLoader = false;
            this.totalShowing = +this.rowStart + +this.userList.length - 1;
          }
          this.ResConsultants.splice(0, this.ResConsultants.length);
          this.ResCapturers.splice(0, this.ResCapturers.length);

          for (const user of res.userList) {

            const temp: ResponsibleConsultant = {
              id: +user.userId,
              Name: user.firstName
            };

            const temp2: ResponsibleCapturer = {
              id: +user.userId,
              Name: user.firstName
            };

            if (user.designation === 'Consultant') {
              this.ResConsultants.push(temp);
            } else if (user.designation === 'Capturer') {
              this.ResCapturers.push(temp2);
            }
          }
        },
        msg => {
          this.showLoader = false;
          this.notify.errorsmsg(
            'Server Error',
            'Something went wrong while trying to access the server.'
          );
        }
      );
  }

  loadServices(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model: GetServiceLList = {
      filter: this.filter,
      userID: this.currentUser.userID,
      specificServiceID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection

    };
    this.ServiceService
    .getServiceList(model)
    .then(
      (res: ServiceListResponse) => {
        if (res.outcome.outcome === 'FAILURE') {
          this.notify.errorsmsg(
            res.outcome.outcome,
            res.outcome.outcomeMessage
          );
        } else {
          if (displayGrowl) {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage);
          }
        }
        if (res.rowCount === 0) {
          this.noData = true;
          this.showLoader = false;
        } else {
          this.noData = false;
          this.rowCount = res.rowCount;
          this.showingRecords = res.serviceses.length;
          this.serviceslist = res.serviceses;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.serviceslist.length - 1;
        }
      },
      msg => {
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
    this.loadCompanyServiceList();
  }

  updatePagination() {
    if (this.dataset.services.length <= this.totalShowing) {
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

  popClick(event, CSid, id, service, consultant, capturer, start, end) {
    if (this.sidebarCollapsed) {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    } else {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    }

    this.focuscompserviceID = CSid;
    this.focusServiceID = id;
    this.focusService = service;
    this.focusconsultant = consultant;
    this.focuscapturer = capturer;
    this.focusstart = start;
    this.focusend = end;


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
    this.StartDate = null;
    this.EndDate = null;
    this.ConID = -1;
    this.CapID =  -1;
    this.SerID =  -1;
    this.serviceIndex = 0;
    this.capturerIndex = 0;
    this.consultantIndex = 0;

    this.openaddModal.nativeElement.click();
  }

  addCompanyService() {

    const requestModel: AddCompanyService = {
      userID: this.currentUser.userID,
      spesificCompanyID: this.companyID,
      spesificServiceID: this.SerID,
      resConsultantID: this.ConID,
      resCapturerID: this.CapID,
      startDate: this.StartDate,
      endDate: this.EndDate,
    };


    this.companyService.AddService(requestModel).then(
      (res: {outcome: Outcome}) => {
          if (res.outcome.outcome !== 'SUCCESS') {
          this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          } else {
            this.notify.successmsg('SUCCESS', 'Company address successfully added');
            this.loadCompanyServiceList();
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

  editCompanyService($event) {
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.ConID = this.focusconsultant;
    this.CapID = this.focuscapturer;
    this.SerID = this.focusServiceID;
    this.StartDate = this.focusstart;
    this.EndDate = this.focusend;
    this.openeditModal.nativeElement.click();
  }

  UpdateCompanyServices() {
    const requestModel: UpdateCompanyService = {
      userID: this.currentUser.userID,
      spesificCompanyServiceID: this.focuscompserviceID,
      spesificServiceID: this.SerID,
      ResConsultantID: this.ConID,
      ResCapturerID: this.CapID,
      startDate: this.StartDate,
      endDate: this.EndDate,
    };
    this.companyService.UpdateService(requestModel).then(
      (res: {outcome: Outcome}) => {
          if (res.outcome.outcome !== 'SUCCESS') {
            this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          } else {
            this.notify.successmsg('SUCCESS', 'Company service successfully Updated');
            this.closeeditModal.nativeElement.click();
            this.loadCompanyServiceList();
        }
      },
        msg => {
          this.notify.errorsmsg(
          'Server Error', 'Something went wrong while trying to access the server.');
      });
  }

  onConsultantChange(id: number)   {
    this.disableConSelect = true;
    this.ConID = id;
  }

  onCapturerChange(id: number)   {
    this.disableCapSelect = true;
    this.CapID = id;
  }

  onServiceChange(id: number)   {
    this.disableSerSelect = true;
    this.SerID = id;
  }

}

