import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { CompanyService } from 'src/app/services/Company.Service';
import { User } from 'src/app/models/HttpResponses/User';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Transaction } from 'src/app/models/HttpResponses/TransactionListResponse';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Pagination } from 'src/app/models/Pagination';
import { TableHeading } from 'src/app/models/Table';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';
import { OverlayContainer, CdkOverlayOrigin } from '@angular/cdk/overlay';


@Component({
  selector: 'app-view-transaction-checking',
  templateUrl: './view-transaction-checking.component.html',
  styleUrls: ['./view-transaction-checking.component.scss']
})
export class ViewTransactionCheckingComponent implements OnInit {



  currentUser: User;
  currentTheme: string;
  observedTransaction: Transaction;
  loading: boolean;
  childrenLoaded: boolean;
  isOpen = false;
  // Data Events
 rowStart = 1;
 rowEnd = 15;
 filter = '';
 orderBy = '';
 disabled = false;
 orderByDirection = '';
  displayFilter = '';
 pages: Pagination[];
  showingPages: Pagination[];
  rowCount: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;


  orderDirection: string;

  totalShowing: number;
  orderIndicator = 'Name_ASC';
  rowCountPerPage: number;
  showingRecords: number;
  activePage: number;


  // Panel Numbers
  step: number;

  // Data Lists
  customWorksheetID: number;
  CaptureJoins: CaptureJoin[] = [];
  CustomWorksheetLines: CustomWorksheetLine[];
  AvailableInvoiceLines: InvoiceLine[] = [];
  AvailableSAD500Lines: SAD500Line[] = [];
  AvailableLines: any[] = [];
  AssignedLines: any[] = [];

  /**Data Table Config
   */
  invoiceHeadings: TableHeading[] = [
    {
      title: '',
      propertyName: 'rowNum',
      order: {
        enable: false,
      },
      position: 0
    },
    {
      title: 'IDfirst',
      propertyName: 'invoiceLineID',
      order: {
        enable: true,
        tag: 'invoiceLineID'
      },
      position: 1
    },
    {
      title: 'IDsecond',
      propertyName: 'itemID',
      order: {
        enable: true,
        tag: 'invoiceLineID'
      },
      position: 2
    },
    {
      title: 'Invoice No',
      propertyName: 'invoiceNo',
      order: {
        enable: true,
        tag: 'invoiceNo'
      },
      position: 3
    },
    {
      title: 'Product Code',
      propertyName: 'prodCode',
      order: {
        enable: true,
        tag: 'prodCode'
      },
      position: 4
    },
    {
      title: 'Quantity',
      propertyName: 'quantity',
      order: {
        enable: true,
        tag: 'quantity'
      },
      position: 5
    },
    {
      title: 'Item Value',
      propertyName: 'itemValue',
      order: {
        enable: true,
        tag: 'itemValue'
      },
      position: 6
    },
    {
      title: 'Unit Price',
      propertyName: 'unitPrice',
      order: {
        enable: true,
        tag: 'unitPrice'
      },
      position: 7
    },
    {
      title: 'Total Line Value',
      propertyName: 'totalLineValue',
      order: {
        enable: true,
        tag: 'totalLineValue'
      },
      position: 8
    }
  ];
  sad500Headings: TableHeading[] = [
    {
      title: '',
      propertyName: 'rowNum',
      order: {
        enable: false,
      },
      position: 0
    },
    {
      title: 'IDfirst',
      propertyName: 'sad500LineID',
      order: {
        enable: true,
        tag: 'sad500LineID'
      },
      position: 1
    },
    {
      title: 'IDsecond',
      propertyName: 'lineNo',
      order: {
        enable: true,
        tag: 'lineNo'
      },
      position: 2
    },
    {
      title: 'Tariff',
      propertyName: 'tariff',
      order: {
        enable: true,
        tag: 'tariff'
      },
      position: 3
    },
    {
      title: 'Customs Value',
      propertyName: 'customsValue',
      order: {
        enable: true,
        tag: 'customsValue'
      },
      position: 4
    },
    {
      title: 'Quantity',
      propertyName: 'quantity',
      order: {
        enable: true,
        tag: 'quantity'
      },
      position: 5
    },
    {
      title: 'Supply Unit',
      propertyName: 'supplyUnit',
      order: {
        enable: true,
        tag: 'supplyUnit'
      },
      position: 6
    }
  ];
  AvailableHeadings: TableHeading[] = [];
  AssignedHeadings: TableHeading[] = [];
  AssignedInvoiceLines: InvoiceLine[] = [];
  AssignedSADLines: SAD500Line[] = [];



  // View Children
  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;
  @ViewChild('trigger', {static: false})
  private trigger: ElementRef;
  overlay: CdkOverlayOrigin;
  constructor(
    private userService: UserService,
    private themeService: ThemeService,
    private transactionService: TransactionService,
    private companyService: CompanyService,
    private apiService: ApiService
    ) {
      this.currentUser = this.userService.getCurrentUser();

    }
private unsubscribe = new Subject<void>();
  ngOnInit() {
    this.step = 0;
    // console.log(this.observedTransaction);
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe)).subscribe(res => {
      this.currentTheme = res;
    });
    this.transactionService.observerCurrentAttachment()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe (obj => {
      // console.log(obj);
      if (obj !== null && obj !== undefined) {
        this.observedTransaction = {
          rowNum: 1,
          transactionID: obj.transactionID,
          name: obj.transactionName,
          type: obj.transactionType,
          status: ''
        };
        this.getCaptureList();
      }

    });
  }

  getCaptureList() {
    this.loading = true;

    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        transactionID: this.observedTransaction.transactionID,
        rowStart: this.rowStart,
        rowEnd: this.rowEnd
      },
      requestProcedure: 'CaptureJoinsList'
    };
    this.apiService.post(`${environment.ApiEndpoint}/capture/read/list`, model).then(
      (res: any) => {
        console.log('CaptureJoinsList');
        console.log(res);
        this.CaptureJoins = res.data;
        if (res.rowCount > 0) {
          this.showingRecords = this.CaptureJoins.length;
          this.rowCount = res.rowCount;
          this.customWorksheetID = this.CaptureJoins[0].CustomWorksheetID;
          this.loading = false;

          this.getCustomWorksheetLines();
        } else {

        }
      },
      msg => {
        this.loading = false;
        // this.notify.errorsmsg(
        //   'Server Error',
        //   'Something went wrong while trying to access the server.'
        // );
      }
    );
  }
  getCustomWorksheetLines() {
    this.loading = true;
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        customWorksheetID: this.customWorksheetID,
        filter: this.filter,
        rowStart: this.rowStart,
        rowEnd: this.rowEnd,
        orderBy: this.orderBy,
        orderByDirection: this.orderByDirection
      },
      requestProcedure: 'CustomWorksheetLinesList'
    };
    this.apiService.post(`${environment.ApiEndpoint}/checking/read`, model).then(
      (res: any) => {
        console.log('res.data');
        console.log(res.data);
        this.CustomWorksheetLines = res.data;
        this.loading = false;
      },
      msg => {
        this.loading = false;
      }
    );
  }

  joinLines() {

  }
  // async getAssignedInvoiceLines(custID: number) {
  //   if (custID > 0) {
  //     this.AssignedInvoiceLines = [];
  //     // console.log(custID);
  //     let arr: CaptureJoin[] = [];
  //     arr = this.CaptureJoins.filter(x => x.CustomWorksheetLineID.toLocaleString().localeCompare(custID.toLocaleString()));
  //     if (arr.length > 0 ) {
  //      this.AssignedInvoiceLines = await this.getInvoiceLineInfo(arr);
  //      this.childrenLoaded = true;
  //     }
  //   }
  // }
  // getInvoiceLineInfo(lines: CaptureJoin[]): InvoiceLine[] {
  //     let invoices: InvoiceLine[] = [];

  //     this.loading = true;
  //     lines.forEach(x => {
  //       const model = {
  //         userID: this.currentUser.userID,
  //         invoiceLineID: x.InvoiceLineID,
  //         invoiceID: x.InvoiceID,
  //         transactionID: this.observedTransaction.transactionID,
  //         rowStart: this.rowStart,
  //         rowEnd: this.rowEnd,
  //         orderBy: '',
  //         orderByDirection: ''
  //       };
  //       this.apiService.post(`${environment.ApiEndpoint}/capture/invoice/lines`, model).then(
  //         (res: InvoiceLineRead) => {
  //           this.loading = false;
  //           // console.log(res);
  //           if (res.lines.length > 0) {
  //             invoices.push(res.lines[0]);
  //             // console.log(this.AssignedInvoiceLines);
  //           }
  //         },
  //         msg => {
  //           this.loading = false;
  //         }
  //       );
  //     });
  //     // console.log(invoices);

  //     return invoices;
  // }

  // async getAssignedInvoiceLines(custID: number) {
  //   if (custID > 0) {
  //     this.AssignedInvoiceLines = [];
  //     // console.log(custID);
  //     let arr: CaptureJoin[] = [];
  //     arr = this.CaptureJoins.filter(x => x.CustomWorksheetLineID.toLocaleString().localeCompare(custID.toLocaleString()));
  //     if (arr.length > 0 ) {
  //      this.AssignedInvoiceLines = await this.getInvoiceLineInfo(arr);
  //      this.childrenLoaded = true;
  //     }
  //   }
  // }
  getInvoiceLineInfo(invoiceid: number, invoicelineid: number) {

      this.loading = true;
      const model = {
        userID: this.currentUser.userID,
        invoiceLineID: invoicelineid,
        invoiceID: invoiceid,
        transactionID: this.observedTransaction.transactionID,
        rowStart: this.rowStart,
        rowEnd: this.rowEnd,
        orderBy: '',
        orderByDirection: ''
      };
      this.apiService.post(`${environment.ApiEndpoint}/capture/invoice/lines`, model).then(
        (res: InvoiceLineRead) => {
          this.loading = false;
          console.log(res);
          this.AssignedInvoiceLines = res.lines;
          if (res.lines.length > 0) {

          }
        },
        msg => {
          this.loading = false;
        }
      );

      // console.log(invoices);

  }

  getSADLineInfo(SAD500ID: number, SAD500LineID: number) {
    this.loading = true;
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        SAD500LineID,
        SAD500ID,
        rowStart: this.rowStart,
        rowEnd: this.rowEnd
      },
      requestProcedure: 'SAD500LineList'
    };
    console.log(model);
    this.apiService.post(`${environment.ApiEndpoint}/capture/read/list`, model).then(
      (res: any) => {
        this.AssignedSADLines = res.data;
        console.log('this.AssignedSADLines');
        console.log(this.AssignedSADLines);
        this.loading = false;
      },
      msg => {
        this.loading = false;
      }
    );
  }
  getAvailableInvoicesLines() {
    this.loading = true;
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
          transactionID: this.observedTransaction.transactionID,
          rowStart: this.rowStart,
          rowEnd: this.rowEnd
      },
      requestProcedure: 'TransactionInvoiceLinesList'
    };
    this.apiService.post(`${environment.ApiEndpoint}/capture/read/list`, model).then(
      (res: any) => {
        this.AvailableInvoiceLines = res.data;
        this.loading = false;
      },
      msg => {
        this.loading = false;
      }
    );
  }

  getAvailableSADLines() {
    this.loading = true;
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
          transactionID: this.observedTransaction.transactionID,
          rowStart: this.rowStart,
          rowEnd: this.rowEnd
      },
      requestProcedure: 'TransactionSADLinesList'
    };
    this.apiService.post(`${environment.ApiEndpoint}/capture/read/list`, model).then(
      (res: any) => {
        this.AvailableSAD500Lines = res.data;
        this.loading = false;
      },
      msg => {
        this.loading = false;
      }
    );
  }
  searchBar() {
  }

  // Pagination and Filtering

  updatePagination() {
    if (this.CaptureJoins.length <= this.totalShowing) {
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
  pageChange(page: number) {

  }

  // Expansion Events
  focusWorksheet(capture: any) {
    console.log('capture');
    console.log(capture);
    this.getInvoiceLineInfo(capture.InvoiceID, capture.InvoiceLineID);
    this.getSADLineInfo(capture.SAD500ID, capture.SAD500LineID);
  }

  // Datatable Events
  InvoiceEvent($event) {
    // console.log($event);
    this.trigger.nativeElement.click();
  }
}

export class CaptureJoin {
  RowNum: number;
  CaptureJoinID: number;
  InvoiceLineID: number;
  InvoiceID: number;
  SAD500LineID: number;
  SADID: number;
  CustomWorksheetLineID: number;
  HSQuantity: number;
  InvoiceNo: string;
  CustomWorksheetID: number;
  TransactionID: number;
}

export class InvoiceLine {
  rowNum: number;
  invoiceLineID: number;
  invoiceNo: number;
  prodCode: string;
  quantity: number;
  unitPrices: number;
  itemValue: number;
  totalLineValue: number;
}
export class InvoiceLineRead {
 outcome: Outcome;
 lines: InvoiceLine[];
}
export class SAD500Line {
  rowNum: number;
  sadLineID: number;
  customsValue: number;
  tariffCode: string;
  duty: number;
  lineNo: number;
  quantity: number;
  supplyUnit: number;
}
export class CustomWorksheetLine {
  RowNum: number;
  CustomWorksheetID: number;
  CustomWorksheetLineID: number;
  CaptureJoinID: number;
  HSQuantity: number;
  InvoiceNo: string;
  ForeignInv: number;
  CustVal: number;
  Duty: number;
  SupplyUnit: number;
  ProdCode: string;

  invoiceLines: InvoiceLine[];
  sadLines: SAD500Line[];
}

