import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { ContextMenuComponent } from 'src/app/components/menus/context-menu/context-menu.component';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/HttpResponses/User';
import { Pagination } from 'src/app/models/Pagination';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyInfoResponse, CompanyInfo } from 'src/app/models/HttpResponses/CompanyInfoResponse';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { AddCompanyInfo, UpdateCompanyInfo } from 'src/app/models/HttpRequests/Company';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-company-info',
  templateUrl: './view-company-info.component.html',
  styleUrls: ['./view-company-info.component.scss']
})
export class ViewCompanyInfoComponent implements OnInit, OnDestroy {

  constructor(
    private companyService: CompanyService,
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

  @ViewChild(ContextMenuComponent, {static: true } )
  private contextmenu: ContextMenuComponent;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild('openeditModal', {static: true})
  openeditModal: ElementRef;

  @ViewChild('closeeditModal', {static: true})
  closeeditModal: ElementRef;

  @ViewChild('openaddModal', {static: true})
  openaddModal: ElementRef;

  @ViewChild('closeaddModal', {static: true})
  closeaddModal: ElementRef;

  @ViewChild('myInput', { static: true })
  myInputVariable: ElementRef;

  defaultProfile =
    `${environment.ApiProfileImages}/default.jpg`;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  selectedInfoIndex = 0;
  pages: Pagination[];
  showingPages: Pagination[];
  dataset: CompanyInfoResponse;
  dataList: CompanyInfo[] = [];
  rowCount = 0;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;
  Info = '';
  Type = 0;
  focusCompanyInfoID = 0;
  disableInfoSelect = false;
  focusCompTypeID = 0;

  rowStart = 0;
  rowEnd: number;
  filter: string;
  orderBy: string;
  orderDirection: string;

  totalShowing: number;
  orderIndicator = 'Name_ASC';
  rowCountPerPage: number;
  showingRecords = 0;
  activePage: number;

  focusCompID: number;
  focusCompType: number;
  focusDescription: string;

  noData = false;
  showLoader = true;
  displayFilter = false;

  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  sidebarCollapsed = true;
  selectedRow = -1;

  companyName: string;
  companyID: number;
  TypesList: any[] = [];
  typeControl = new FormControl([Validators.required]);

  private unsubscribe$ = new Subject<void>();


  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });
    const temp = {
      TypeID: 8,
      TypeName: 'Bank Name'
    };
    this.TypesList.push(temp);

    this.companyService.observeCompany()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((obj: SelectedCompany) => {
      this.companyID = obj.companyID;
      this.companyName = obj.companyName;

      this.loadCompanyInfoList();
    });
  }

  loadCompanyInfoTypes() {

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

  loadCompanyInfoList() {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;

    const model = {
      filter: this.filter,
      userID: this.currentUser.userID,
      specificCompanyID: this.companyID,
      specificCompanyAddInfoID: -1,
      specificCompanyAddInfoTypeID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };

    this.companyService
      .info(model)
      .then(
        (res: CompanyInfoResponse) => {

          if (res.rowCount === 0) {
            this.noData = true;
            this.showLoader = false;
          } else {
            this.noData = false;
            this.dataset = res;
            this.dataList = res.companyInfo;
            this.rowCount = res.rowCount;
            this.showLoader = false;
            this.showingRecords = res.companyInfo.length;
            this.totalShowing = +this.rowStart + +this.dataset.companyInfo.length - 1;
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
    if (this.dataset.companyInfo.length <= this.totalShowing) {
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

  popClick(event, id, infoid, type, typeID, description) {
    if (this.sidebarCollapsed) {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    } else {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    }

    this.focusCompID = id;
    this.focusCompanyInfoID = infoid;
    this.focusCompTypeID = typeID;
    this.focusCompType = type;
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

  Add() {
    this.Info = '';
    this.Type = 0;
    this.disableInfoSelect = false;
    this.myInputVariable.nativeElement.value = -1;
    this.selectedInfoIndex = 0;
    this.openaddModal.nativeElement.click();
  }

  addCompanyInfo() {
    if (this.typeControl.valid && this.Info !== '' && this.Info) {
      const requestModel: AddCompanyInfo = {
        userID: this.currentUser.userID,
        companyID: this.companyID,
        companyInfo: this.Info,
        infoType: this.Type
      };

      this.companyService.AddInfo(requestModel).then(
        (res: {outcome: Outcome}) => {
            if (res.outcome.outcome !== 'SUCCESS') {
            this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
            } else {
              this.notify.successmsg('SUCCESS', 'Company info successfully added');
              this.loadCompanyInfoList();
              this.closeaddModal.nativeElement.click();
            }
          },
          (msg) => {
            this.notify.errorsmsg(
              'Server Error',
              'Something went wrong while trying to access the server.'
            );
            this.closeaddModal.nativeElement.click();
          });
    } else {
      this.notify.toastrwarning('Warning', 'All fields are required');
    }
  }

  editCompanyInfo($event) {
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.Info = this.focusDescription;
    this.Type =  this.focusCompTypeID;
    this.openeditModal.nativeElement.click();

  }

  UpdateCompany() {
    if (this.typeControl.valid && this.Info !== '' && this.Info) {
    const requestModel: UpdateCompanyInfo = {
      userID: this.currentUser.userID,
      specificCompanyInfoID: this.focusCompanyInfoID,
      companyInfo: this.Info,
      type: this.Type    };

    this.companyService.UpdateInfo(requestModel).then(
      (res: {outcome: Outcome}) => {
          if (res.outcome.outcome !== 'SUCCESS') {
            this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          } else {
            this.notify.successmsg('SUCCESS', 'Company info successfully Updated');
            this.closeeditModal.nativeElement.click();
            this.loadCompanyInfoList();
        }
      },
        msg => {
          this.notify.errorsmsg(
            'Server Error',
            'Something went wrong while trying to access the server.'
          );
        }
      );
    } else {
      this.notify.toastrwarning('Warning', 'All fields are required');
    }
  }

  onChange(id: number)   {
    this.disableInfoSelect = true;
    this.Type = id;
  }

  viewCaptureInfo($event) {
    this.notify.toastrwarning('Warning', 'Feature is not implemented');
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
