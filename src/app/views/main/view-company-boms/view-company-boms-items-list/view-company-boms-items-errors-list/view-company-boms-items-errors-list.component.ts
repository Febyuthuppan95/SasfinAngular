import { Component, OnInit, ViewChild } from '@angular/core';
import {CompanyService, SelectedBOM} from '../../../../../services/Company.Service';
import {UserService} from '../../../../../services/User.Service';
import {ThemeService} from '../../../../../services/Theme.Service';
import {MenuService} from '../../../../../services/Menu.Service';
import {Router} from '@angular/router';
import {HelpSnackbar} from '../../../../../services/HelpSnackbar.service';
import {DocumentService} from '../../../../../services/Document.Service';
import {Subject} from 'rxjs';
import {Order, SelectedRecord, TableHeader, TableHeading} from '../../../../../models/Table';
import {BOMLine} from '../../../../../models/HttpResponses/BOMsLinesResponse';
import {takeUntil} from 'rxjs/operators';
import { User } from 'src/app/models/HttpResponses/User';
import {ApiService} from '../../../../../services/api.Service';
import {environment} from '../../../../../../environments/environment';
import { NotificationComponent } from 'src/app/components/notification/notification.component';



@Component({
  selector: 'app-view-company-boms-items-errors-list',
  templateUrl: './view-company-boms-items-errors-list.component.html',
  styleUrls: ['./view-company-boms-items-errors-list.component.scss']
})
export class ViewCompanyBomsItemsErrorsListComponent implements OnInit {
  items: any;

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private themeService: ThemeService,
    private IMenuService: MenuService,
    private router: Router,
    private snackbarService: HelpSnackbar,
    private IDocumentService: DocumentService,
    private ApiService: ApiService,
  ) { }

  private unsubscribe$ = new Subject<void>();
  bomid = -1;
  bomstatus = '';
  currentTheme: string;

  // Item: {
  //   itemID: number;
  //   item: string;
  //   description: string;
  //   tariff: number;
  //   type: string;
  //   mIDP: string;
  //   pI: string;
  //   vulnerable: string;
  // };
  tableHeader: TableHeader = {
    title: 'BOM Items Errors',
    addButton: {
      enable: false,
    },
    backButton: {
      enable: true,
    },
    filters: {
      search: true,
      selectRowCount: true,
    },
  };
  tableHeadings: TableHeading[] = [
    {
      title: '',
      propertyName: 'RowNum',
      order: {
        enable: false,
      },
    },
    {
      title: 'Excel Line Number',
      propertyName: 'RowNumber',
      order: {
        enable: true,
        tag: 'RowNumber',
      },
    },
    {
      title: 'Tariff Code',
      propertyName: 'TariffCode',
      order: {
        enable: true,
        tag: 'TariffCode',
      },
    },
    {
      title: 'Item Class',
      propertyName: 'ItemClass',
      order: {
        enable: true,
        tag: 'ItemClass',
      },
    },
    {
      title: 'Item Type',
      propertyName: 'ItemType',
      order: {
        enable: true,
        tag: 'ItemType',
      },
    },
    {
      title: 'Usage Type',
      propertyName: 'UsageType',
      order: {
        enable: true,
        tag: 'UsageType',
      },
    },
  ];

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  BOMLines: BOMLine[] = [];
  currentUser: User = this.userService.getCurrentUser();
  // table vars - every page
  showLoader = true;
  recordsPerPage = 15;
  rowStart: number = 1;
  rowEnd: number = 15;
  orderBy: string = '';
  orderByDirection: '';
  rowCount: number;
  orderDirection: string;
  selectedRow = -1;
  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  rowCountPerPage: number = 15;
  filter: string;

  ngOnInit() {
    this.themeService
      .observeTheme()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((theme) => {
        this.currentTheme = theme;
      });

    this.companyService
      .observeBOM()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((obj: SelectedBOM) => {
        if (obj !== undefined) {
          this.bomid = obj.bomid;
          this.bomstatus = obj.status;
        }
    });

    this.loadItemerrors(true);
  }

  loadItemerrors(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model = {
      requestParams: {
        UserID: this.currentUser.userID,
        bomId: this.bomid,
        rowStart: this.rowStart,
        rowEnd: this.rowEnd,
      },
      requestProcedure: `BOMItemErrorsList`
    };

    this.ApiService.post(`${environment.ApiEndpoint}/boms/errors`, model).then((res: any) => {

      this.items = res.data;

      if (res.rowCount === 0) {
        this.showLoader = false;
      } else {
        this.rowCount = res.rowCount;
        this.showLoader = false;
      }
    },
      msg => {
      this.notify.errorsmsg(
        'Server Error',
        'Something went wrong while trying to access the server.'
      );
      });
    this.showLoader = false;
  }


  // table methods
  back() {
    this.router.navigate(['companies', 'boms']);
  }

  selectedRecord(obj: SelectedRecord) {
    this.selectedRow = obj.index;
    this.popClick(obj.event, obj.record);
  }

  popClick(event, obj) {
    // this.Item = obj;
    // this.contextMenuX = event.clientX + 3;
    // this.contextMenuY = event.clientY + 5;
    // this.themeService.toggleContextMenu(!this.contextMenu);
    // this.contextMenu = true;
  }

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadItemerrors(true);
  }

  pageChange($event: { rowStart: number; rowEnd: number }) {
    this.rowStart = $event.rowStart;
    this.rowEnd = $event.rowEnd;
    this.loadItemerrors(true);
  }

  recordsPerPageChange(recordsPerPage: number) {
    this.rowCountPerPage = recordsPerPage;
    this.rowStart = 1;
    this.loadItemerrors(true);
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadItemerrors(true);
  }

  add() {
    // Render modal
    // this.filePreview = null;
    // console.log(this.bomFile);
    // this.bomFile.nativeElement.value = '';
    // this.BomFile = null;
    // this.openAddModal.nativeElement.click();
  }

}
