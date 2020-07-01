import {Component, OnInit, ViewChild} from '@angular/core';
import {CompanyService, SelectedBOM} from '../../../../services/Company.Service';
import {UserService} from '../../../../services/User.Service';
import {ThemeService} from '../../../../services/Theme.Service';
import {MenuService} from '../../../../services/Menu.Service';
import {Router} from '@angular/router';
import {HelpSnackbar} from '../../../../services/HelpSnackbar.service';
import {DocumentService} from '../../../../services/Document.Service';
import {Subject} from 'rxjs';
import {Order, SelectedRecord, TableHeader, TableHeading} from '../../../../models/Table';
import {BOMLine} from '../../../../models/HttpResponses/BOMsLinesResponse';
import {takeUntil} from 'rxjs/operators';
import {ItemError} from '../../../../models/HttpResponses/ItemsListResponse';
import {User} from '../../../../models/HttpResponses/User';
import {NotificationComponent} from '../../../../components/notification/notification.component';
import {ApiService} from '../../../../services/api.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-view-company-boms-lines-error-list',
  templateUrl: './view-company-boms-lines-error-list.component.html',
  styleUrls: ['./view-company-boms-lines-error-list.component.scss']
})
export class ViewCompanyBomsLinesErrorListComponent implements OnInit {

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private themeService: ThemeService,
    private IMenuService: MenuService,
    private router: Router,
    // tslint:disable-next-line:no-shadowed-variable
    private ApiService: ApiService,
    private snackbarService: HelpSnackbar,
    private IDocumentService: DocumentService,
  ) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

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
    title: 'BOM Item Errors',
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
      title: 'Spreadsheet Line Number',
      propertyName: 'spreadsheetLineNumber',
      order: {
        enable: true,
        tag: 'spreadsheetLineNumber',
      },
    },
    {
      title: 'Tariff Code',
      propertyName: 'tariffCode',
      order: {
        enable: true,
        tag: 'tariffCode',
      },
    },
    {
      title: 'Usage Type',
      propertyName: 'usageType',
      order: {
        enable: true,
        tag: 'usagType',
      },
    },
    {
      title: 'Item Type',
      propertyName: 'itemType',
      order: {
        enable: true,
        tag: 'itemType',
      },
    },
    {
      title: 'Item Class',
      propertyName: 'itemClass',
      order: {
        enable: true,
        tag: 'itemClass',
      },
    },
  ];
  itemErrors: ItemError[] = [];
  // table vars - every page
  showLoader = true;
  recordsPerPage = 15;
  rowStart: number;
  rowEnd: number;
  rowCount: number;
  orderBy: string;
  orderDirection: string;
  selectedRow = -1;
  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  rowCountPerPage: number;
  filter: string;

  currentUser: User = this.userService.getCurrentUser();
  noData = false;
  showingRecords: number;
  totalShowing: number;

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
    this.loadItemErrors(true);
  }

  loadItemErrors(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model = {
      requestParams: {
        UserID: this.currentUser.userID,
        BomID: this.bomid
      },
      requestProcedure: `BOMItemErrorsList`
    };
    this.ApiService.post(`${environment.ApiEndpoint}/boms/items/errors`, model).then((res: any) => {
        console.log(res);
        this.itemErrors = res.data;
      },
      msg => {
        console.log(msg);
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
    this.loadItemErrors(false); // reload data
  }

  pageChange($event: { rowStart: number; rowEnd: number }) {
    this.rowStart = $event.rowStart;
    this.rowEnd = $event.rowEnd;
    this.loadItemErrors(false); // reload data
  }

  recordsPerPageChange(recordsPerPage: number) {
    this.rowCountPerPage = recordsPerPage;
    this.rowStart = 1;
    this.loadItemErrors(false); // reload data
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadItemErrors(false); // reload data
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
