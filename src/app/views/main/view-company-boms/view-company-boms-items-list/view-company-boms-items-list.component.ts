import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
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
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';

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

  @ViewChild('openAddModal', {static: true})
  openAddModal: ElementRef;

  @ViewChild('closeAddModal', {static: true})
  closeAddModal: ElementRef;

  @ViewChild('itemFile', { static: false })
  bomFile: ElementRef;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  private unsubscribe$ = new Subject<void>();
  bomid = -1;
  bomstatus = '';
  currentTheme: string;

  ItemFile: File;
  filePreview: any;
  companyID: any;
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
    {
      title: 'Item Class',
      propertyName: 'ItemClass',
      order: {
        enable: true,
        tag: 'ItemClass',
      },
    },
    // {
    //   title: 'Qualify 521',
    //   propertyName: 'Qualify521',
    //   order: {
    //     enable: true,
    //     tag: 'Qualify521',
    //   },
    // },
    // {
    //   title: 'Qualify 536',
    //   propertyName: 'Qualify536',
    //   order: {
    //     enable: true,
    //     tag: 'Qualify536',
    //   },
    // },
    // {
    //   title: 'Qualify PI',
    //   propertyName: 'QualifyPI',
    //   order: {
    //     enable: true,
    //     tag: 'QualifyPI',
    //   },
    // },
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
  rowCountPerPage: number = 15;
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

    this.loadItems(true);
  }

  loadItems(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;

    console.log(this.rowStart);
    console.log(this.rowEnd);
    this.showLoader = true;
    const model = {
      requestParams: {
        UserID: this.currentUser.userID,
        bomId: this.bomid,
        ItemID: -1,
        rowStart: this.rowStart,
        rowEnd: this.rowEnd
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
    console.log('recordsPerPageChange');
    this.rowCountPerPage = recordsPerPage;
    this.rowStart = 1;
    this.loadItems(false); // reload data
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadItems(false); // reload data
  }

  add() {
    this.openAddModal.nativeElement.click();
  }

  onFileChange(files: FileList) {
    this.ItemFile = files.item(0);
    this.filePreview = this.ItemFile.name;
  }

  saveItemUpload() {
    // Save
    console.log('save');
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        BOMID: this.bomid,
        companyID: this.companyID
      },
      requestProcedure: `BOMItemAdd`
    };
    console.log(this.ItemFile, model, 'boms/items/upload');

    this.IDocumentService.upload(this.ItemFile, model, 'boms/items/upload').then(
      (res: Outcome) => {
        console.log('BOMUploadRes');
        console.log(res);
        if (res.outcome === 'SUCCESS') {
          this.notify.successmsg(
            res.outcome,
            res.outcomeMessage);
          this.closeAddModal.nativeElement.click();
          this.loadItems(true);
        } else {
          this.notify.errorsmsg(
            res.outcome,
            res.outcomeMessage
          );
        }
      },
      (msg) => {
        // nothing yet
        console.log('Error: ' + msg);
        this.showLoader = false;
        this.notify.errorsmsg(
          'Server Error',
          'Something went wrong while trying to access the server.'
        );
      }
    );
  }
  loadCompanyItemsList(arg0: boolean) {
    throw new Error("Method not implemented.");
  }

}
