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
import {Items} from '../../../../models/HttpResponses/ItemsListResponse';
import {environment} from '../../../../../environments/environment';
import {User} from '../../../../models/HttpResponses/User';
import {NotificationComponent} from '../../../../components/notification/notification.component';
import {ApiService} from '../../../../services/api.service';

@Component({
  selector: 'app-view-company-boms-itemgroups-list',
  templateUrl: './view-company-boms-itemgroups-list.component.html',
  styleUrls: ['./view-company-boms-itemgroups-list.component.scss']
})
export class ViewCompanyBomsItemgroupsListComponent implements OnInit {

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
    title: 'BOM Items',
    addButton: {
      enable: true,
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
      title: 'Type',
      propertyName: 'Type',
      order: {
        enable: true,
        tag: 'Type',
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
  itemGroups: Items[] = [];
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

    this.loadItemGroups(true);
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

  loadItemGroups(displayGrowl: boolean) {
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
        this.itemGroups = res.data;
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
    this.loadItemGroups(false); // reload data
  }

  pageChange($event: { rowStart: number; rowEnd: number }) {
    this.rowStart = $event.rowStart;
    this.rowEnd = $event.rowEnd;
    this.loadItemGroups(false); // reload data
  }

  recordsPerPageChange(recordsPerPage: number) {
    this.rowCountPerPage = recordsPerPage;
    this.rowStart = 1;
    this.loadItemGroups(false); // reload data
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadItemGroups(false); // reload data
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
