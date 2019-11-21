import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Router } from '@angular/router';
import { CaptureService } from 'src/app/services/capture.service';
import { MatDialog } from '@angular/material';
import { EventService } from 'src/app/services/event.service';
import { ShortcutInput, KeyboardShortcutsComponent, AllowIn } from 'ng-keyboard-shortcuts';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { SAD500Line, SPSAD500LineList } from 'src/app/models/HttpResponses/SAD500Line';
import { Subject } from 'rxjs';
import { SAD500LineCreateRequest, SAD500LineUpdateModel } from 'src/app/models/HttpRequests/SAD500Line';
import { takeUntil } from 'rxjs/operators';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { InvoiceGetResponse, InvoiceLinesResponse, InvoiceLine } from 'src/app/models/HttpResponses/Invoices';
import { CurrenciesService } from 'src/app/services/Currencies.Service';
import { Currency } from 'src/app/models/HttpResponses/Currency';
import { ListCurrencies } from 'src/app/models/HttpResponses/ListCurrencies';

@Component({
  selector: 'app-form-invoice',
  templateUrl: './form-invoice.component.html',
  styleUrls: ['./form-invoice.component.scss']
})
export class FormInvoiceComponent implements OnInit, AfterViewInit, OnDestroy {

constructor(private themeService: ThemeService, private userService: UserService, private transactionService: TransactionService,
            private router: Router, private captureService: CaptureService, private dialog: MatDialog,
            private eventService: EventService, private currencyService: CurrenciesService) { }

shortcuts: ShortcutInput[] = [];

@ViewChild(NotificationComponent, { static: true })
private notify: NotificationComponent;

@ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;

currentUser = this.userService.getCurrentUser();
attachmentID: number;
linePreview = -1;
lines = -1;
focusMainForm: boolean;
focusLineForm: boolean;
focusLineData: InvoiceLine = null;
private unsubscribe$ = new Subject<void>();

currentTheme: string;
currencies: Currency[] = [];

sad500LineQueue: InvoiceLine[] = [];
sad500CreatedLines: InvoiceLine[] = [];
lineState: string;
lineErrors: InvoiceLine[] = [];
toggleLines = false;
transactionID: number;

form = {
  fromCompany: {
    value: null,
    error: null,
  },
  fromCompanyID: {
    value: null,
    error: null,
  },
  toCompanyID: {
    value: null,
    error: null,
  },
  toCompany: {
    value: null,
    error: null,
  },
  invoiceNo: {
    value: null,
    error: null,
  },
  currencyID: {
    value: null,
    error: null,
  },
};

  ngOnInit() {
    this.loadCurrency();
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(value => this.currentTheme = value);

    this.eventService.observeCaptureEvent()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(() => this.submit());

    this.transactionService.observerCurrentAttachment()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((curr: { transactionID: number, attachmentID: number }) => {
      if (curr !== null || curr !== undefined) {
        this.attachmentID = curr.attachmentID;
        this.transactionID = curr.transactionID;
        this.loadCapture();
        this.loadLines();
      }
    });
  }

  ngAfterViewInit(): void {
    this.shortcuts.push(
        {
            key: 'alt + .',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => this.nextLine()
        },
        {
          key: 'alt + ,',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => this.prevLine()
        },
        {
          key: 'alt + /',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => this.focusLineForm = !this.focusLineForm
        },
        {
          key: 'alt + m',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => {
            this.focusMainForm = !this.focusMainForm;
            this.focusLineData = null;
            this.lines = -1;
          }
        },
        {
          key: 'alt + n',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => {
            this.focusLineForm = !this.focusLineForm;
            this.focusLineData = null;
            this.lines = -1;
          }
        },
        {
          key: 'alt + s',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => {
            if (!this.toggleLines) {
              this.submit();
            }
          }
        },
        {
          key: 'alt + l',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => this.toggleLines = !this.toggleLines
        },
    );
  }

  submit() {
    const requestModel = {
      userID: this.currentUser.userID,
      invoiceID: this.attachmentID,
      fromCompanyID: this.form.fromCompanyID.value,
      fromCompany: this.form.fromCompany.value,
      toCompanyID: this.form.toCompanyID.value,
      toCompany: this.form.toCompany.value,
      invoiceNo: this.form.invoiceNo.value,
      currencyID: this.form.currencyID.value,
      isDeleted: 0,
      attachmentStatusID: 2,
    };

    this.captureService.invoiceUpdate(requestModel).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.notify.successmsg(res.outcome, res.outcomeMessage);
          this.router.navigate(['transaction', 'attachments']);
        } else {
          this.notify.errorsmsg(res.outcome, res.outcomeMessage);
        }
      },
      (msg) => {
        this.notify.errorsmsg('Failure', 'Cannot reach server');
      }
    );
  }

  updateLine(obj: InvoiceLine) {
    this.lineState = 'Saving';
    const requestModel = {
      userID: this.currentUser.userID,
      invoiceLineID: this.attachmentID,
      prodCode: obj.prodCode,
      quantity: obj.quantity,
      itemValue: obj. itemValue,
      isDeleted: 0,
    };

    this.captureService.invoiceLineUpdate(requestModel).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.loadLines();
          this.lineState = 'Updated successfully';
          this.lines = -1;
          this.focusLineData = null;
          setTimeout(() => this.lineState = '', 3000);
        }
      },
      (msg) => {
        this.notify.errorsmsg('Failure', 'Cannot reach server');
        this.lineState = 'Update failed';
        setTimeout(() => this.lineState = '', 3000);
      }
    );
  }

  loadCurrency(): void {
    this.currencyService.list({userID: this.currentUser.userID, specificCurrencyID: -1, filter: '', rowStart: 1, rowEnd: 1000}).then(
      (res: ListCurrencies) =>{
        this.currencies = res.currenciesList;
        console.log(this.currencies);
      },
      (msg) => {
        console.log(msg);
      }
    );
  }

  loadCapture() {
    this.captureService.invoiceList({
      invoiceID: this.attachmentID,
      userID: 3,
      rowStart: 1,
      rowEnd: 10,
      filter: '',
      orderBy: '',
      orderByDirection: '',
      transactionID: this.transactionID
    }).then(
      (res: InvoiceGetResponse) => {
        console.log(res);
        if (res.invoices !== undefined) {
          this.form.fromCompany.value = res.invoices[0].fromCompany;
          this.form.fromCompany.error = res.invoices[0].fromCompanyError;
          this.form.toCompany.value = res.invoices[0].toCompany;
          this.form.toCompany.error = res.invoices[0].toCompanyError;
          this.form.invoiceNo.value = res.invoices[0].invoiceNo;
          this.form.invoiceNo.error = res.invoices[0].invoiceNoError;
          this.form.currencyID.value = res.invoices[0].currencyID;
          this.form.currencyID.error = res.invoices[0].currencyError;
        }
      },
      (msg) => {
      }
    );
  }

  loadLines() {
    this.captureService.invoiceLineList({
      userID: this.currentUser.userID,
      invoiceID: this.attachmentID,
      invoiceLineID: -1,
      filter: '',
      orderBy: '',
      orderByDirection: '',
      rowStart: 1,
      rowEnd: 1000,
    }).then(
      (res: InvoiceLinesResponse) => {
        this.sad500CreatedLines = res.lines;
        if (this.lines > -1) {
          this.focusLineData = this.sad500CreatedLines[this.lines];
        }

        this.lineErrors = res.lines.filter(x =>
          x.quantityError !== null
          || x.prodCodeError !== null
          || x.itemValueError !== null);
      },
      (msg) => {
      }
    );
  }

  addToQueue(obj: InvoiceLine) {
    this.lineState = 'Saving new line';

    obj.userID = 3;
    obj.invoiceID = this.attachmentID;

    this.captureService.invoiceLineAdd(obj).then(
      (res: { outcome: string; outcomeMessage: string; createdID: number }) => {
        if (res.outcome === 'SUCCESS') {
          this.loadLines();
          this.lineState = 'Saved successfully';
          this.focusLineForm = !this.focusLineForm;
          this.focusLineData = null;
          this.lines = -1;

          setTimeout(() => this.lineState = '', 3000);
        } else {
          this.lineState = 'Failed to save';
          setTimeout(() => this.lineState = '', 3000);
        }

      },
      (msg) => {
        this.lineState = 'Failed to save';
        setTimeout(() => this.lineState = '', 3000);
      }
    );
  }

  revisitSAD500Line(item: SAD500LineCreateRequest, i?: number) {
    this.lines = i;
  }

  prevLine() {
    if (this.lines >= 1) {
      this.lines--;
      this.focusLineData = this.sad500CreatedLines[this.lines];
    }
  }

  nextLine() {
    if (this.lines < this.sad500CreatedLines.length - 1) {
      this.lines++;
      this.focusLineData = this.sad500CreatedLines[this.lines];
    }

    if (this.lines === -1) {
      this.lines++;
      this.focusLineData = this.sad500CreatedLines[this.lines];
    }
  }

  specificLine(index: number) {
    this.focusLineData = this.sad500CreatedLines[index];
  }

  newLine() {
    this.focusLineForm = !this.focusLineForm;
    this.focusLineData = null;
    this.lines = -1;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
