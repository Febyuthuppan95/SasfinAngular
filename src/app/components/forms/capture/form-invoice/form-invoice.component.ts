import { PlaceService } from './../../../../services/Place.Service';
import { ListCountriesRequest, CountriesListResponse, CountryItem } from './../../../../models/HttpRequests/Locations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { ItemsListResponse, Items } from 'src/app/models/HttpResponses/ItemsListResponse';

@Component({
  selector: 'app-form-invoice',
  templateUrl: './form-invoice.component.html',
  styleUrls: ['./form-invoice.component.scss']
})
export class FormInvoiceComponent implements OnInit, AfterViewInit, OnDestroy {


constructor(private themeService: ThemeService, private userService: UserService, private transactionService: TransactionService,
            private router: Router, private captureService: CaptureService, private dialog: MatDialog,
            private eventService: EventService, private currencyService: CurrenciesService, private companyService: CompanyService,
            private snackbar: MatSnackBar, private snackbarService: HelpSnackbar,
            private placeService: PlaceService) { }

shortcuts: ShortcutInput[] = [];

@ViewChild(NotificationComponent, { static: true })
private notify: NotificationComponent;

@ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;

@ViewChild('invoiceLinesTooltip', {static : false})
invoiceLinesTooltip: MatTooltip;

@ViewChild('invoiceTooltip', {static : false})
invoiceTooltip: MatTooltip;

InvForm = new FormGroup({
  control1: new FormControl(null, [Validators.required]),
  control1a: new FormControl(null),
  control2: new FormControl(null, [Validators.required]),
  control3: new FormControl(null, [Validators.required]),
  control4: new FormControl(null, [Validators.required]),
  control5: new FormControl(null, [Validators.required]),
  control6: new FormControl(null, [Validators.required])
});


currentUser = this.userService.getCurrentUser();
itemQuery = '';
attachmentID: number;
linePreview = -1;
lines = -1;
focusMainForm: boolean;
focusLineForm: boolean;
focusLineData: InvoiceLine = null;
private unsubscribe$ = new Subject<void>();
disabledinvoiceNo: boolean;
invoiceNoOReason: string;
LinesValid = false;
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
cooControl = new FormControl();
countriesList: CountryItem[] = [];
countriesListTemp: {rowNum: number, countryID: number, name: string, code: string}[];
countryQuery = '';

// Todo add guid for invoice items

form = {
  fromCompany: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  fromCompanyID: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  toCompanyID: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  toCompany: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  invoiceNo: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  invoiceDate: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  currencyID: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  incoType: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  },
  cooID: {
    value: null,
    error: null,
    OBit: null,
    OUserID: null,
    ODate: null,
    OReason: null,
  }
};

dialogOpen = false;
lineQueue: InvoiceLine[] = [];
lineIndex = 0;
loader = false;

  ngOnInit() {
    this.loadCurrency();
    this.loadCompanies();
    this.loadCountries();
    this.loadIncoTypes();

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

  loadIncoTypes() {
    // Load
    const model = {
      userID: this.currentUser.userID
    };
    this.captureService.incoTermTypeList(model).then(
      (res: IncoTermTypesReponse) => {
        this.incoTermsList = res.termTypes;
        this.incoTermsListTemp = this.incoTermsList;



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
    console.log('Isvvalid');
    console.log(this.InvForm.valid && this.LinesValid);
    if (this.InvForm.valid && this.LinesValid) {
          const requestModel = {
            userID: this.currentUser.userID,
            invoiceID: this.attachmentID,
            invoiceNo: this.form.invoiceNo.value,
            companyID: this.form.fromCompanyID.value,
            currencyID: this.form.currencyID.value,
            attachmentStatusID: 3,
            cooID: this.form.cooID.value,
            invoiceDate: this.form.invoiceDate.value,
            incoTermTypeID: this.form.incoType.value,
            isDeleted: 0,

            invoiceNoOBit: this.form.invoiceNo.OBit,
            invoiceNoOUserID: this.form.invoiceNo.OUserID,
            invoiceNoODate: this.form.invoiceNo.ODate,
            invoiceNoOReason: this.form.invoiceNo.OReason,
          };

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
      } else {
        this.snackbar.open(`Please fill in the all header data`, '', {
          duration: 3000,
          panelClass: ['capture-snackbar-error'],
          horizontalPosition: 'center',
        });
      }
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
        // unitOfMeasure: obj.unitOfMeasure,
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

          this.form.invoiceNo.OBit = res.invoices[0].invoiceNoOBit;
          this.form.invoiceNo.OUserID = res.invoices[0].invoiceNoOUserID;
          this.form.invoiceNo.ODate = res.invoices[0].invoiceNoODate;
          this.form.invoiceNo.OReason = res.invoices[0].invoiceNoOReason;

          if (res.attachmentErrors.attachmentErrors.length > 0) {
            res.attachmentErrors.attachmentErrors.forEach(error => {
              if (error.fieldName === 'InvoiceNo') {
                this.form.invoiceNo.error = error.errorDescription;
              }
            });
          }
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
      transactionID: this.transactionID,
      invoiceLineID: -1,
      filter: '',
      orderBy: '',
      orderByDirection: '',
      rowStart: 1,
      rowEnd: 1000,

    }).then(
      (res: InvoiceLinesResponse) => {
        this.sad500CreatedLines = res.lines;

        if (this.sad500CreatedLines.length > 0) {
          this.LinesValid = true;
        }

        if (this.lines > -1) {
          this.focusLineData = this.sad500CreatedLines[this.lines];
        }
      },
      (msg) => {
      }
    );
  }




  addToQueue(obj: InvoiceLine) {
    console.log('obj');
    console.log(obj);
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

    if (this.LinesValid && this.InvForm.valid) {
      if (this.lineIndex < this.lineQueue.length) {
        const currentLine = this.lineQueue[this.lineIndex];

        const requestObject: LineAddModel = {
          userID: this.currentUser.userID,
          invoiceID: this.attachmentID,
          invoiceNo: this. form.invoiceNo.value,
          itemID: currentLine.itemID,
          unitOfMeasureID: currentLine.unitOfMeasureID,
          cooID: currentLine.cooID,
          prodCode: currentLine.prodCode,
          quantity: currentLine.quantity,
          itemValue: currentLine.itemValue,
          unitPrice: currentLine.unitPrice,
          totalLineValue: currentLine.totalLineValue,
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
    } else if (!this.LinesValid && this.InvForm.valid) {
      this.snackbar.open(`Please fill in the all line data`, '', {
        duration: 3000,
        panelClass: ['capture-snackbar-error'],
        horizontalPosition: 'center',
      });
    } else if (!this.LinesValid && !this.InvForm.valid) {
      this.snackbar.open(`Please fill in the all header and line data`, '', {
        duration: 3000,
        panelClass: ['capture-snackbar-error'],
        horizontalPosition: 'center',
      });
    } else if (this.LinesValid && !this.InvForm.valid) {
      this.snackbar.open(`Please fill in the all header data`, '', {
        duration: 3000,
        panelClass: ['capture-snackbar-error'],
        horizontalPosition: 'center',
      });
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
        this.toCompanyListTemp = this.toCompanyList;
        this.fromCompanyListTemp = this.fromCompanyList;
      },
      (msg) => {
        console.log(msg);
      }
    );
  }

  CathLinesValid(linestatus: boolean) {
    this.LinesValid = linestatus;
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

  loadCountries() {
    const request: ListCountriesRequest = {
      userID: this.currentUser.userID,
      specificCountryID: -1,
      rowStart: 1,
      rowEnd: 500,
      orderBy: '',
      orderByDirection: '',
      filter: ''
    };
    this.placeService.getCountriesCall(request).then(
      (res: CountriesListResponse) => {
        this.countriesList = res.countriesList;
        this.countriesListTemp = res.countriesList;
        // this.countryQuery = this.countriesList.find(x => x.countryID === this.form.cooID.value).code;
      }
    );
  }
  selectedCountry(country: number) {
    // this.countryID = country;
    this.form.cooID.value = country;
  }
  filterCountries() {
    this.countriesList = this.countriesListTemp;
    this.countriesList = this.countriesList.filter(x => this.matchRuleShort(x.name, `*${this.countryQuery.toUpperCase()}*`));
  }

  OverrideinvoiceNoClick() {
    this.form.invoiceNo.OUserID = this.currentUser.userID;
    this.form.invoiceNo.OBit = true;
    this.form.invoiceNo.ODate = new Date();
    this.disabledinvoiceNo = false;
    this.invoiceNoOReason = '';
  }

  OverrideinvoiceNoExcept() {
    this.disabledinvoiceNo = true;
    console.log(this.form.invoiceNo);
  }

  UndoOverrideinvoiceNo() {
    this.form.invoiceNo.OUserID = null;
    this.form.invoiceNo.OBit = null;
    this.form.invoiceNo.ODate = null;
    this.form.invoiceNo.OReason = null;
    this.invoiceNoOReason = '';
    this.disabledinvoiceNo = false;
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

export class LineAddModel {
  userID: number;
  invoiceID: number;
  invoiceNo: string;
  itemID?: number;
  unitOfMeasureID: number;
  cooID?: number;
  prodCode: string;
  quantity: number;
  itemValue: number;
  unitPrice: number;
  totalLineValue: number;
}

export class InvoiceUpdateModel {
  userID: number;
  invoiceID: number;
  invoiceNo: string;
  companyID: number;
  currencyID: number;
  attachmentStatusID: number;
  invoiceDate: string;
  cooID: number;
  iNCOTermTypeID: number;
  isDeleted: number;
  invoiceNoOBit: boolean;
  invoiceNoOUserID: number;
  invoiceNoODate: string;
  invoiceNoOReason: string;
}
