import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { CompaniesContextMenuComponent } from 'src/app/components/menus/companies-context-menu/companies-context-menu.component';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/HttpResponses/User';
import { Company, CompaniesListResponse } from 'src/app/models/HttpResponses/CompaniesListResponse';
import { Pagination } from 'src/app/models/Pagination';
import { CompanyList } from 'src/app/models/HttpRequests/CompanyList';
import { AddCompany } from 'src/app/models/HttpRequests/AddCompany';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { UpdateCompany } from 'src/app/models/HttpRequests/UpdateCompany';
import { CaptureInfoResponse } from 'src/app/models/HttpResponses/ListCaptureInfo';
import { TransactionService } from 'src/app/services/Transaction.Service';

@Component({
  selector: 'app-view-capture-info',
  templateUrl: './view-capture-info.component.html',
  styleUrls: ['./view-capture-info.component.scss']
})
export class ViewCaptureInfoComponent implements OnInit {

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private themeService: ThemeService,
    private transactionService: TransactionService) {}

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  defaultProfile =
    `${environment.ApiProfileImages}/default.jpg`;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  dataset: CaptureInfoResponse;
  recordsPerPage: number;

  noData = false;
  showLoader = true;
  displayFilter = false;
  orderIndicator: string;

  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  sidebarCollapsed = true;
  selectedRow = -1;

  company: {
    id: number,
    name: string,
  };

  requestModel = {
    userID: this.currentUser.userID,
    companyID: 1,
    doctypeID: -1,
    specificCaptureInfoID: -1,
    filter: '',
    orderBy: 'Info',
    orderByDirection: 'ASC',
    rowStart: 1,
    rowEnd: 15,
  };

  ngOnInit() {
    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.companyService.observeCompany().subscribe((data: SelectedCompany) => {
      this.company = {
        id: data.companyID,
        name: data.companyName
      };

      this.loadDataset();
    });
  }

  searchBar() {
    this.requestModel.rowStart = 1;
    this.loadDataset();
  }

  loadDataset() {
    this.showLoader = true;

    this.transactionService.captureInfo(this.requestModel).then(
      (res: CaptureInfoResponse) => {
        this.showLoader = false;

        if (res.outcome.outcome === 'SUCCESS') {
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          this.dataset = res;
        } else {
          this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
        }
      },
      (msg) => {
        this.showLoader = false;
        this.notify.errorsmsg('Failure', 'Bad request');
        console.log(JSON.stringify(msg));
      }
    );
  }

  updateSort(orderBy: string) {
    if (this.requestModel.orderBy === orderBy) {
      if (this.requestModel.orderByDirection === 'ASC') {
        this.requestModel.orderByDirection = 'DESC';
      } else {
        this.requestModel.orderByDirection = 'ASC';
      }
    } else {
      this.requestModel.orderByDirection = 'ASC';
    }
    this.requestModel.orderBy = orderBy;
    this.orderIndicator = `${this.requestModel.orderBy}_${this.requestModel.orderByDirection}`;
    this.loadDataset();
  }

  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  popClick(event) {
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;
    this.themeService.toggleContextMenu(!this.contextMenu);
    this.contextMenu = true;

    console.log(this.contextMenu);
    console.log(this.contextMenuX);
    console.log(this.contextMenuY);
  }

  setClickedRow(index) {
    this.selectedRow = index;
  }

  pageChange($event: {rowStart: number, rowEnd: number}) {
    this.requestModel.rowStart = $event.rowStart;
    this.requestModel.rowEnd = $event.rowEnd;
    this.loadDataset();
  }
}
