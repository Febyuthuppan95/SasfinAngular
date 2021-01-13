import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {CompanyService, SelectedBOM} from '../../../services/Company.Service';
import {UserService} from '../../../services/User.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import {MenuService} from '../../../services/Menu.Service';
import {Router} from '@angular/router';
import {HelpSnackbar} from '../../../services/HelpSnackbar.service';
import {DocumentService} from '../../../services/Document.Service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {BOMLine} from '../../../models/HttpResponses/BOMsLinesResponse';
import {Order, SelectedRecord, TableHeader, TableHeading} from '../../../models/Table';
import {GetItemList} from '../../../models/HttpRequests/GetItemList';
import {Items, ItemsListResponse} from '../../../models/HttpResponses/ItemsListResponse';
import {User} from '../../../models/HttpResponses/User';
import {NotificationComponent} from '../../../components/notification/notification.component';
import {ApiService} from '../../../services/api.service';
import {environment} from '../../../../environments/environment';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';
import { RateofExchange } from 'src/app/models/HttpResponses/RateofExchangeListResponse';

@Component({
  selector: 'app-exchange-rate-upload',
  templateUrl: './exchange-rate-upload.component.html',
  styleUrls: ['./exchange-rate-upload.component.scss']
})
export class ExchangeRateUploadComponent implements OnInit {

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private themeService: ThemeService,
    private IMenuService: MenuService,
    private router: Router,
    private api: ApiService,
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
  itemFile: ElementRef;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  private unsubscribe$ = new Subject<void>();
  ROEdateID = -1;
  currentTheme: string;
  ROE: any;

  ItemFile: File;
  filePreview: any;
  companyID: any;
  tableHeader: TableHeader = {
    title: 'Exchange Rates',
    addButton: {
      enable: true,
    },
    backButton: {
      enable: false,
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
      title: 'Date',
      propertyName: 'RateOfExchangeInput',
      order: {
        enable: true,
        tag: 'RateOfExchangeInput',
      },
    // },
    // {
    //   title: 'Item Class',
    //   propertyName: 'ItemClass',
    //   order: {
    //     enable: true,
    //     tag: 'ItemClass',
    //   },
     },

  ];
  RateofExchanges: RateofExchange[] = [];
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

    // this.companyService
    //   .observeBOM()
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((obj: SelectedBOM) => {
    //     if (obj !== undefined) {
    //       this.bomid = obj.bomid;
    //       this.bomstatus = obj.status;
    //     }
    // });

    this.loadIROEs(true);
  }

  loadIROEs(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;

    this.showLoader = true;
    const model = {
      requestParams: {
        UserID: this.currentUser.userID,
        rowStart: this.rowStart,
        rowEnd: this.rowEnd
      },
      requestProcedure: `RateOfExchangeDatesList`
    };
    this.ApiService.post(`${environment.ApiEndpoint}/companies/exchangerates`, model).then((res: any) => {
      this.RateofExchanges = res.data;
      this.rowCount = res.rowCount;

      if (res.outcome.outcome == 'SUCCESS') {
        this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
      } else {
        this.notify.toastrwarning(res.outcome.outcome, res.outcome.outcomeMessage);
      }
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

  selectedRecord(obj: SelectedRecord) {
    this.selectedRow = obj.index;
    this.popClick(obj.event, obj.record);
  }

  popClick(event, obj) {
    this.ROE = obj;
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;
    this.themeService.toggleContextMenu(!this.contextMenu);
    this.contextMenu = true;
  }

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadIROEs(false); // reload data
  }

  pageChange($event: { rowStart: number; rowEnd: number }) {
    this.rowStart = $event.rowStart;
    this.rowEnd = $event.rowEnd;
    this.loadIROEs(false); // reload data
  }

  recordsPerPageChange(recordsPerPage: number) {
    this.rowCountPerPage = recordsPerPage;
    this.rowStart = 1;
    this.loadIROEs(false); // reload data
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadIROEs(false); // reload data
  }

  add() {
    this.itemFile.nativeElement.value = '';
    this.ItemFile = null;
    this.filePreview = '';
    this.openAddModal.nativeElement.click();
  }

  onFileChange(files: FileList) {
    this.ItemFile = files.item(0);
    this.filePreview = this.ItemFile.name;
  }

  async RemoveROE(ROEDateID: number) {
    const model = {
      request: {
        userID: this.currentUser.userID,
        RateOfExchangeDateID: ROEDateID,
        IsDeleted: 1
      },
      procedure: 'RateOfExchangeDateUpdate'
    };

    await this.api.post(`${environment.ApiEndpoint}/capture/post`, model).then(
      (res: any) => {

        if (res.outcome.outcome == 'SUCCESS') {
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
        } else {
          this.notify.toastrwarning(res.outcome.outcome, res.outcome.outcomeMessage);
        }

        this.loadIROEs(true);
    });
  }

  saveItemUpload() {
    // Save
    console.log('save');
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
      },
      requestProcedure: `ROEAdd`
    };
    // console.log(this.ItemFile, model);

    this.IDocumentService.upload(this.ItemFile, model, 'companies/exchangerates/upload').then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.notify.successmsg(
            res.outcome,
            res.outcomeMessage);
          this.closeAddModal.nativeElement.click();
          this.loadIROEs(true);
        } else {
          this.notify.errorsmsg(
            res.outcome,
            res.outcomeMessage
          );
        }
      },
      (msg) => {
        // nothing yet
        console.log('Error: ' + JSON.stringify(msg));
        this.showLoader = false;
        this.notify.errorsmsg(
          'Server Error',
          'Something went wrong while trying to access the server.'
        );
      }
    );
  }
  loadCompanyItemsList(arg0: boolean) {
    throw new Error('Method not implemented.');
  }

}
