import {Component, OnInit, ViewChild} from '@angular/core';
import {CompanyService, SelectedBOM} from '../../../../services/Company.Service';
import {UserService} from '../../../../services/User.Service';
import {ThemeService} from '../../../../services/Theme.Service';
import {MenuService} from '../../../../services/Menu.Service';
import {Router} from '@angular/router';
import {HelpSnackbar} from '../../../../services/HelpSnackbar.service';
import {DocumentService} from '../../../../services/Document.Service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {BOMLine} from '../../../../models/HttpResponses/BOMsLinesResponse';
import {Order, SelectedRecord, TableHeader, TableHeading} from '../../../../models/Table';
import {GetItemList} from '../../../../models/HttpRequests/GetItemList';
import {Items, ItemsListResponse} from '../../../../models/HttpResponses/ItemsListResponse';
import {User} from '../../../../models/HttpResponses/User';
import {NotificationComponent} from '../../../../components/notification/notification.component';
import {ApiService} from '../../../../services/api.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-view-company-boms-items-list',
  templateUrl: './view-company-boms-items-list.component.html',
  styleUrls: ['./view-company-boms-items-list.component.scss']
})
export class ViewCompanyBomsItemsListComponent implements OnInit {

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private themeService: ThemeService,
    private IMenuService: MenuService,
    private router: Router,
    private snackbarService: HelpSnackbar,
    private IDocumentService: DocumentService,
    // tslint:disable-next-line:no-shadowed-variable
    private ApiService: ApiService,
  ) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  private unsubscribe$ = new Subject<void>();
  bomid = -1;
  bomstatus = '';
  currentTheme: string;

  // Item: {
  //   itemID: number,
  //   item: string,
  //   description: string,
  //   tariffID: number,
  //   tariff: string,
  //   typeID: number,
  //   type: string,
  //   vulnerable: string,
  // };
  tableHeader: TableHeader = {
    title: 'BOM Items',
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
      title: 'Item',
      propertyName: 'Item',
      order: {
        enable: true,
        tag: 'Item',
      },
    },
    {
      title: 'Description',
      propertyName: 'Description',
      order: {
        enable: true,
        tag: 'Description',
      },
    },
    {
      title: 'Tariff',
      propertyName: 'Tariff',
      order: {
        enable: true,
        tag: 'Tariff',
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
      title: 'Vulnerable',
      propertyName: 'Vulnerable',
      order: {
        enable: true,
        tag: 'Vulnerable',
      },
    },
  ];
  items: Items[] = [];
  // table vars - every page
  showLoader = true;
  recordsPerPage = 15;
  rowStart: number = 1;
  rowEnd: number = 15;
  orderBy: string = '';
  orderByDirection: '';
  dataset: null;
  rowCount: number;
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

    this.loadItems(true);

    // this.companyService
    //   .observeBOM()
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((obj: SelectedBOM) => {
    //     if (obj !== undefined) {
    //       this.bomid = obj.bomid;
    //       this.bomstatus = obj.status;
    //     }
    //   });
  }

  loadItems(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model = {
      requestParams: {
        UserID: this.currentUser.userID,
        ItemID: -1
      },
      requestProcedure: `CompanyItemsList`
    };
    this.ApiService.post(`${environment.ApiEndpoint}/boms/items`, model).then((res: any) => {
      console.log(res);
      this.items = res.data;
      this.rowCount = res.rowCount;
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
    this.loadItems(false); // reload data
  }

  pageChange($event: { rowStart: number; rowEnd: number }) {
    this.rowStart = $event.rowStart;
    this.rowEnd = $event.rowEnd;
    this.loadItems(false); // reload data
  }

  recordsPerPageChange(recordsPerPage: number) {
    this.rowCountPerPage = recordsPerPage;
    this.rowStart = 1;
    this.loadItems(false); // reload data
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadItems(false); // reload data
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
