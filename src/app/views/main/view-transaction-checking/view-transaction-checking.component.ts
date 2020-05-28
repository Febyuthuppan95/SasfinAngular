import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ListReadResponse } from 'src/app/components/forms/capture/form-invoice/form-invoice-lines/form-invoice-lines.component';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Page } from 'ngx-pagination/dist/pagination-controls.directive';
import { PageEvent } from '@angular/material';

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
  /**Data Events */
 rowStart =1;
 rowEnd = 15;
 filter = '';
 orderBy = '';
 orderByDirection = '';


  
  /**Data Lists */
  customWorksheetID: number;
  CaptureJoins: CaptureJoin[] = [];
  CustomWorksheetLines: CustomWorksheetLine[];
  AvailableInvoiceLines: InvoiceLine[] = [];
  AvailableSAD500Lines: SAD500Line[] = [];



  /**View Children */
  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

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
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe)).subscribe(res => {
      this.currentTheme = res;
    });
    this.transactionService.observerCurrentAttachment()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe (obj => {
      this.observedTransaction.transactionID = obj.transactionID,
      this.observedTransaction.name = obj.transactionName;
    });

    this.getCaptureList();

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
      (res: ListReadResponse) => {
        if (res.rowCount > 0) {
          // Populate Key List List
          this.CaptureJoins = res.data;
          // Track the current Custom Worksheet
          this.customWorksheetID = this.CaptureJoins[0].customWorksheetID;
          // Get
          this.getCustomWorksheetLines();
        } else {

        }
        this.notify.successmsg(
          res.outcome.outcome,
          res.outcome.outcomeMessage
        );
        this.loading = false;
      },
      msg => {
        this.loading = false;
        this.notify.errorsmsg(
          'Server Error',
          'Something went wrong while trying to access the server.'
        );
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
        rowEnd: this.rowEnd
      },
      requestProcedure: 'CustomWorksheetLinesList'
    };
    this.apiService.post(`${environment.ApiEndpoint}/capture/read/list`, model).then(
      (res: ListReadResponse) => {
        console.log(res.data);
        this.CustomWorksheetLines = res.data;
        this.loading = false;
      },
      msg => {

      }
    );
  }

  getAssignedInvoiceLines() {
    this.loading = true;
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        invoiceLineID: ,
        rowStart: this.rowStart,
        rowEnd: this.rowEnd
      },
      requestProcedure: 'InvoiceLinesList'
    };
    this.apiService.post(`${environment.ApiEndpoint}/capture/read/list`, model).then(
      (res:ListReadResponse) => {
        this.AvailableInvoiceLines = res.data;
        this.loading = false;
      },
      msg => {

      }
    );
  }
  getAssignedSADLines() {
    this.loading = true;
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        sadLineID: ,
        rowStart: this.rowStart,
        rowEnd: this.rowEnd
      },
      requestProcedure: 'InvoiceLinesList'
    };
    this.apiService.post(`${environment.ApiEndpoint}/capture/read/list`, model).then(
      (res:ListReadResponse) => {
        this.AvailableInvoiceLines = res.data;
        this.loading = false;
      },
      msg => {

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
      (res:ListReadResponse) => {
        this.AvailableInvoiceLines = res.data;
        this.loading = false;
      },
      msg => {

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
      (res:ListReadResponse) => {
        this.AvailableSAD500Lines = res.data;
        this.loading = false;
      },
      msg => {

      }
    );
  }

}

export class CaptureJoin {
  rowNum: number;
  captureJoinID: number;
  invoiceLineID: number;
  sad500LineID: number;
  customWorksheetLineID: number;
  customWorksheetID: number;
  transactionID: number;
}

export class InvoiceLine {
  rowNum: number;
  invoiceLineID: number;
  invoiceNo: number;
  name: string;
  quantity: number;
  unitPrices: number;
  itemValue: number;
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
  rowNum: number;
  customWorksheetID: number;
  customWorksheetLineID: number;
  captureJoinID: number;
  hsQuantity: number;
  foreignInv: number;
  custVal: number;
  duty: number;
  supplyUnit: number;
  prodCode: string;

  invoiceLines: InvoiceLine[];
  sadLines: SAD500Line[];
}

