import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { Router } from '@angular/router';
import { TableHeading, TableConfig, TableHeader } from 'src/app/models/Table';
import { User } from 'src/app/models/HttpResponses/User';
import { environment } from 'src/environments/environment';
import { Pagination } from 'src/app/models/Pagination';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';
import { Subject } from 'rxjs';
import { CompanySupplierContextMenuComponent } from 'src/app/components/menus/company-supplier-context-menu/company-supplier-context-menu.component';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { takeUntil } from 'rxjs/operators';
import { PaginationChange } from 'src/app/components/pagination/pagination.component';

@Component({
  selector: 'app-view-company-supplier-list',
  templateUrl: './view-company-supplier-list.component.html',
  styleUrls: ['./view-company-supplier-list.component.scss']
})
export class ViewCompanySupplierListComponent implements OnInit {

  constructor(private companyService: CompanyService,
    private userService: UserService,
    private themeService: ThemeService,
    public router: Router) { }

    defaultProfile =
    `${environment.ApiProfileImages}/default.jpg`;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  rowStart: number;
  rowEnd: number;
  filter: string;
  orderBy: string;
  orderDirection: string;

  dataList: CompanySupplier[];
  pages: Pagination[];
  showingPages: Pagination[];
  dataset: CompanySupplierList;
  rowCount: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;

  totalShowing: number;
  orderIndicator = 'Name_ASC';
  rowCountPerPage: number;
  showingRecords = 15;
  activePage: number;

  noData = false;
  showLoader = true;
  displayFilter = false;

  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  sidebarCollapsed = true;

  selectedRow = -1;
  companyID: number;
  companyName: string;
  focusSupplierID: number;
  focusSupplierName: string;


  Supplier: CompanySupplier = {
    RowNum: -1,
    SupplierID: -1,
    SupplierName: ''
  };

  tableHeader: TableHeader = {
    title: 'Company OEMs',
    addButton: {
     enable: true,
    },
    backButton: {
      enable: true
    },
    filters: {
      search: true,
      selectRowCount: true,
    }
  };
  tableConfig: TableConfig = {
    header:  {
      title: 'Company Suppliers',
      addButton: {
      enable: true,
      },
      backButton: {
        enable: true
      },
      filters: {
        search: true,
        selectRowCount: true,
      }
    },
    headings: [
      {
        title: '#',
        propertyName: 'RowNum',
        order: {
          enable: false,
        }
      },
      {
        title: 'OEM Name',
        propertyName: 'OEMName',
        order: {
          enable: true,
        },
      },
      {
        title: 'Reference Number',
        propertyName: 'OEMRefNum',
        order: {
          enable: true,
        },
      }
    ],
    rowStart: 1,
    rowEnd: 15,
    recordsPerPage: 15,
    orderBy: '',
    orderByDirection: '',
    dataset: null
  };
  tableHeadings: TableHeading[] = [
    {
      title: '#',
      propertyName: 'RowNum',
      order: {
        enable: false,
      }
    },
    {
      title: 'OEM Name',
      propertyName: 'OEMName',
      order: {
        enable: true,
      },
    },
    {
      title: 'Reference Number',
      propertyName: 'OEMRefNum',
      order: {
        enable: true,
      },
    }
  ];

  private unsubscribe$ = new Subject<void>();
  @ViewChild(CompanySupplierContextMenuComponent, {static: true } )
  private contextmenu: CompanySupplierContextMenuComponent;

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

  ngOnInit() {
this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.companyService.observeCompany()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((obj: SelectedCompany) => {
      if (obj !== null || obj !== undefined) {
        this.companyID = obj.companyID;
        this.companyName = obj.companyName;
      }
    });
    // this.loadCompanyOEMs();
    const obj: PaginationChange = {
      rowStart: 1,
      rowEnd: 15
    };


  }

  loadQuarters() {
    
  }
  EditCompanySupplier(flag: boolean) {

  }
  AddCompanySupplier() {
    
  }

}
export class CompanySupplier {
  RowNum: number;
  SupplierID: number;
  SupplierName: string;
}
export class CompanySupplierList {
  rowCount: number;
  data?: CompanySupplier[];
  outcome: Outcome;
}