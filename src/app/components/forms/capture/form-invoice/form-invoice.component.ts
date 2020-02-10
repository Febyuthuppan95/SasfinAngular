import { FormControl } from '@angular/forms';
import { Outcome } from './../../../../models/HttpResponses/DoctypeResponse';
import { HelpSnackbar } from './../../../../services/HelpSnackbar.service';
import { SnackbarModel } from './../../../../models/StateModels/SnackbarModel';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Router } from '@angular/router';
import { CaptureService } from 'src/app/services/capture.service';
import { MatDialog, MatTooltip, MatSnackBar } from '@angular/material';
import { EventService } from 'src/app/services/event.service';
import { ShortcutInput, KeyboardShortcutsComponent, AllowIn } from 'ng-keyboard-shortcuts';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Subject } from 'rxjs';
import { SAD500LineCreateRequest } from 'src/app/models/HttpRequests/SAD500Line';
import { takeUntil } from 'rxjs/operators';
import { InvoiceGetResponse, InvoiceLinesResponse, InvoiceLine } from 'src/app/models/HttpResponses/Invoices';
import { CurrenciesService } from 'src/app/services/Currencies.Service';
import { Currency } from 'src/app/models/HttpResponses/Currency';
import { ListCurrencies } from 'src/app/models/HttpResponses/ListCurrencies';
import { CompaniesListResponse, Company } from 'src/app/models/HttpResponses/CompaniesListResponse';
import { CompanyService } from 'src/app/services/Company.Service';
import { SubmitDialogComponent } from 'src/app/layouts/capture-layout/submit-dialog/submit-dialog.component';

@Component({
  selector: 'app-form-invoice',
  templateUrl: './form-invoice.component.html',
  styleUrls: ['./form-invoice.component.scss']
})
export class FormInvoiceComponent implements OnInit, AfterViewInit, OnDestroy {

constructor(private themeService: ThemeService, private userService: UserService, private transactionService: TransactionService,
            private router: Router, private captureService: CaptureService, private dialog: MatDialog,
            private eventService: EventService, private currencyService: CurrenciesService, private companyService: CompanyService,
            private snackbar: MatSnackBar, private snackbarService: HelpSnackbar) { }

shortcuts: ShortcutInput[] = [];

@ViewChild(NotificationComponent, { static: true })
private notify: NotificationComponent;

@ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;

@ViewChild('invoiceLinesTooltip', {static : false})
invoiceLinesTooltip: MatTooltip;

@ViewChild('invoiceTooltip', {static : false})
invoiceTooltip: MatTooltip;

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
currenciesTemp: Currency[] = [];
sad500LineQueue: InvoiceLine[] = [];
sad500CreatedLines: InvoiceLine[] = [];
lineState: string;
lineErrors: InvoiceLine[] = [];
toggleLines = false;
transactionID: number;
currencyQuery = '';
toCompanyQuery = '';
fromCompanyQuery = '';
toCompanyList: Company[] = [];
toCompanyListTemp: Company[] = [];
fromCompanyList: Company[] = [];
fromCompanyListTemp: Company[] = [];
incoTermsList: IncoTerm[] = [];
incoTermsListTemp: { rowNum: number, incoTermTypeID: number, name: string, description: string}[];
incoTypeID = -1;
incoTypeQuery = '';
myControl = new FormControl();

// Todo add guid for invoice items

form = {
  fromCompany: {
    value: '',
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
    value: '',
    error: null,
  },
  invoiceNo: {
    value: null,
    error: null,
  },
  invoiceDate: {
    value: null,
    error: null
  },
  currencyID: {
    value: null,
    error: undefined,
  },
  incoType: {
    value: null,
    error: undefined
  },
  coo: {
    value: null,
    error: null
  }
};

dialogOpen = false;
lineQueue: InvoiceLine[] = [];
lineIndex = 0;
loader = false;

  ngOnInit() {
    this.loadCurrency();
    this.loadCompanies();

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
    this.loadIncoTypes();
  }
  loadIncoTypes() {
    // Load
    const model = {
      userID: this.currentUser.userID
    };
    this.captureService.incoTermTypeList(model).then(
      (res: IncoTermTypesReponse) => {
        if (res.termTypes.length > 0) {
          this.incoTermsList = res.termTypes;
        }
      },
      (msg) => {
        // Snackbar
      }
    );
  }
  filterIncoType() {
    this.incoTermsList = this.incoTermsListTemp;
    this.incoTermsList = this.incoTermsList.filter(x => this.matchRuleShort(x.name, `*${this.incoTypeQuery}*`));
  }
  selectedIncoType(id: number) {
    this.incoTypeID = id;
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
            {
              if (!this.dialogOpen) {
                this.dialogOpen = true;
                this.dialog.open(SubmitDialogComponent).afterClosed().subscribe((status: boolean) => {
                  this.dialogOpen = false;
                  if (status) {
                    this.saveLines();
                  }
                });
              }
            }
          }        
        },
        {
          key: 'alt + l',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => {
            this.toggleLines = !this.toggleLines;

            if (this.toggleLines) {
              this.invoiceTooltip.hide();
              this.invoiceLinesTooltip.show();
              setTimeout(() => { this.invoiceLinesTooltip.hide(); } , 1000);
            } else {
              this.invoiceLinesTooltip.hide();
              this.invoiceTooltip.show();
              setTimeout(() => { this.invoiceTooltip.hide(); } , 1000);
            }
          }
        },
    );
  }

  submit() {
          const requestModel = {
            userID: this.currentUser.userID,
            invoiceID: this.attachmentID,
            fromCompanyID: -1,
            fromCompany: this.form.fromCompany.value,
            toCompanyID: -1,
            toCompany: '',
            invoiceNo: this.form.invoiceNo.value,
            currencyID: -1,
            isDeleted: 0,
            attachmentStatusID: 3,
          };

          if (this.form.fromCompanyID.value === null) {
            const fromCompany = this.fromCompanyList.find(x => x.name === this.fromCompanyQuery);
            if (fromCompany !== undefined) {
              this.form.fromCompanyID.value = fromCompany.companyID;
            }
          }

          if (this.form.toCompanyID.value === null) {
            const toCompany = this.toCompanyList.find(x => x.name === this.toCompanyQuery);
            if (toCompany !== undefined) {
              this.form.toCompanyID.value = toCompany.companyID;
            }
          }

          this.captureService.invoiceUpdate(requestModel).then(
            (res: Outcome) => {
              if (res.outcome === 'SUCCESS') {
                this.notify.successmsg(res.outcome, res.outcomeMessage);

                this.companyService.setCapture({ capturestate: true });
                this.router.navigateByUrl('transaction/capturerlanding');
              } else {
                this.notify.errorsmsg(res.outcome, res.outcomeMessage);
              }
            },
            (msg) => {
              console.log(msg);
              this.notify.errorsmsg('Failure', 'Cannot reach server');
            }
          );
  }

  updateLine(obj: InvoiceLine) {
    if (obj.isPersist) {
      this.lineState = 'Saving';
      const requestModel = {
        userID: this.currentUser.userID,
        invoiceLineID: obj.invoiceLineID,
        prodCode: obj.prodCode,
        quantity: obj.quantity,
        itemValue: obj. itemValue,
        isDeleted: 0,
        unitPrice: obj.unitPrice,
        totalLineValue: obj.totalLineValue,
        unitOfMeasure: obj.unitOfMeasure,
        unitOfMeasureID: obj.unitOfMeasureID
      };

      this.captureService.invoiceLineUpdate(requestModel).then(
        (res: Outcome) => {
          console.log(res);
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
    } else {
      this.lineQueue.push(obj);
      this.lineQueue = this.lineQueue.filter(x => x !== obj);
    }
  }

  loadCurrency(): void {
    this.currencyService.list({userID: this.currentUser.userID, specificCurrencyID: -1, filter: '', rowStart: 1, rowEnd: 1000}).then(
      (res: ListCurrencies) => {
        this.currencies = res.currenciesList;
        this.currenciesTemp = this.currencies;
      },
      (msg) => {
        console.log(msg);
      }
    );
  }

  loadCapture() {
    this.captureService.invoiceList({
      invoiceID: this.attachmentID,
      userID: this.currentUser.userID,
      rowStart: 1,
      rowEnd: 15,
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

  // addToQueue(obj: InvoiceLine) {
  //   this.lineState = 'Saving new line';

  //   obj.userID = 3;
  //   obj.invoiceID = this.attachmentID;

  //   this.captureService.invoiceLineAdd(obj).then(
  //     (res: { outcome: string; outcomeMessage: string; createdID: number }) => {
  //       if (res.outcome === 'SUCCESS') {
  //         this.loadLines();
  //         this.lineState = 'Saved successfully';
  //         this.focusLineForm = !this.focusLineForm;
  //         this.focusLineData = null;
  //         this.lines = -1;

  //         setTimeout(() => this.lineState = '', 3000);
  //       } else {
  //         this.lineState = 'Failed to save';
  //         setTimeout(() => this.lineState = '', 3000);
  //       }

  //     },
  //     (msg) => {
  //       this.lineState = 'Failed to save';
  //       setTimeout(() => this.lineState = '', 3000);
  //     }
  //   );
  // }

  addToQueue(obj: InvoiceLine) {
    obj.userID = this.currentUser.userID;
    obj.invoiceID = this.attachmentID;
    obj.isPersist = false;

    this.lineQueue.push(obj);
    this.sad500CreatedLines.push(obj);
    // this.lineState = 'Line added to queue';
    this.focusLineForm = !this.focusLineForm;
    this.focusLineData = null;
    this.lines = -1;
    // setTimeout(() => this.lineState = '', 3000);
    this.snackbar.open(`Line #${this.lineQueue.length} added to queue`, '', {
      duration: 3000,
      panelClass: ['capture-snackbar'],
      horizontalPosition: 'center',
    });
  }

  saveLines() {
          if (this.lineIndex < this.lineQueue.length) {
            const currentLine = this.lineQueue[this.lineIndex];

            const requestObject = {
              userID: this.currentUser.userID,
              invoiceID: this.attachmentID,
              prodCode: currentLine.prodCode,
              quantity: currentLine.quantity,
              itemValue: currentLine.itemValue,
              unitPrice: currentLine.unitPrice,
              totalLineValue: currentLine.totalLineValue,
              unitOfMeasure: currentLine.unitOfMeasure,
              unitOfMeasureID: currentLine.unitOfMeasureID
            };

            this.captureService.invoiceLineAdd(requestObject).then(
              (res: { outcome: string; outcomeMessage: string; createdID: number }) => {
                if (res.outcome === 'SUCCESS') {
                    this.nextLineAsync();
                } else {
                  console.log('Line not saved');
                }
              },
              (msg) => {
                console.log('Client Error');
              }
            );
          } else {
            this.submit();
          }
  }

  nextLineAsync() {
    this.lineIndex++;

    if (this.lineIndex < this.lineQueue.length) {
      this.saveLines();
    } else {
      this.loader = false;
      this.submit();
    }
  }

  loadCompanies() {
    this.companyService.list({
      userID: this.currentUser.userID,
      specificCompanyID: -1,
      filter: '',
      rowEnd: 1000,
      rowStart: 1,
      orderBy: '',
      orderByDirection: '',
    }).then(
      (res: CompaniesListResponse) => {
        this.toCompanyList = res.companies;
        this.fromCompanyList = res.companies;
        this.toCompanyListTemp = res.companies;
        this.fromCompanyListTemp = res.companies;
      },
      (msg) => {
        console.log(msg);
      }
    );
  }

  filterCurrency() {
    this.currencies = this.currenciesTemp;
    this.currencies = this.currencies.filter(x => this.matchRuleShort(x.name, `*${this.currencyQuery}*`));
  }

  filterFromCompany() {
    this.fromCompanyList = this.fromCompanyListTemp;
    this.fromCompanyList = this.fromCompanyList.filter(x => this.matchRuleShort(x.name, `*${this.form.fromCompany.value}*`));
  }

  selectedCurrency(currencyID: number) {
    this.form.currencyID.value = currencyID;
  }

  selectedFromCompany(fromCompanyID: Company) {
    this.form.fromCompanyID.value = fromCompanyID.companyID;
  }

  matchRuleShort(str, rule) {
    // tslint:disable-next-line: no-shadowed-variable
    const escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    const regexTest =  new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$', 'i');
    return  regexTest.test(str);
    // return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
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
  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

export class IncoTermTypesReponse {
  outcome: Outcome;
  termTypes: IncoTerm[];

}
export class IncoTerm {
  rowNum: number;
  incoTermTypeID: number;
  name: string;
  description: string;
}

