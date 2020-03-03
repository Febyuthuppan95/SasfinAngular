import { Currency, CurrencyListResponse } from './../../../../../models/HttpResponses/Currency';
import { CurrenciesService } from './../../../../../services/Currencies.Service';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { Component, OnInit, EventEmitter, Output, OnChanges, Input, AfterViewInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { UnitMeasureService } from 'src/app/services/Units.Service';
import { UserService } from 'src/app/services/user.Service';
import { User } from 'src/app/models/HttpResponses/User';
import { ShortcutInput, KeyboardShortcutsComponent, AllowIn } from 'ng-keyboard-shortcuts';
import { ValidateService } from 'src/app/services/Validation.Service';
import { TariffService } from 'src/app/services/Tariff.service';
import { FormControl } from '@angular/forms';
import { UnitsOfMeasure } from 'src/app/models/HttpResponses/UnitsOfMeasure';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CaptureService } from 'src/app/services/capture.service';
import { CustomWorksheetLineReq } from 'src/app/models/HttpRequests/CustomWorksheetLine';
import { ListCountriesRequest, CountriesListResponse, CountryItem } from 'src/app/models/HttpRequests/Locations';
import { PlaceService } from 'src/app/services/Place.Service';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { ListUnitsOfMeasure } from 'src/app/models/HttpResponses/ListUnitsOfMeasure';
import { CurrenciesListRequest } from 'src/app/models/HttpRequests/CurrenciesList';

@Component({
  selector: 'app-form-custom-worksheet-lines',
  templateUrl: './form-custom-worksheet-lines.component.html',
  styleUrls: ['./form-custom-worksheet-lines.component.scss']
})
export class FormCustomWorksheetLinesComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {


  constructor(private themeService: ThemeService, private unitService: UnitMeasureService, private userService: UserService,
              private validate: ValidateService, private tariffService: TariffService, private captureService: CaptureService,
              private snackbarService: HelpSnackbar, private placeService: PlaceService, private currencyService: CurrenciesService) { }

  currentUser: User;
  currentTheme: string;
  focusLineForm: boolean;
  private unsubscribe$ = new Subject<void>();

  @Input() lineData: CustomWorksheetLineReq;
  @Input() updateLine: CustomWorksheetLineReq;
  @Input() focusSADLine: boolean;
  @Input() showLines: boolean;
  @Output() submitSADLine = new EventEmitter<CustomWorksheetLineReq>();
  @Output() updateSADLine = new EventEmitter<CustomWorksheetLineReq>();

  shortcuts: ShortcutInput[] = [];
  @ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;

  form = {
    coo: '',
    tariffHeading: '',
    custVal: 0,
    hsQuantity: 0,
    foreignInv: 0,
    duty: 0,
    commonFactor: '',
    cooError: null,
    tariffHeadingError: null,
    custValError: null,
    hsQuantityError: null,
    foreignInvError: null,
    dutyError: null,
    commonFactorError: null,
    unitOfMeasureID: -1,
    cooID: -1,
    invoiceNo: null,
    prodCode: null,
    tariffID: -1,
    vat: 0,
    supplyUnit: 0,
    currencyID: -1,
  };

  isUpdate: boolean;

  countriesList: CountryItem[] = [];
  countriesListTemp: {rowNum: number, countryID: number, name: string, code: string}[];
  countryID = -1;
  countryQuery = '';
  currenciesList: Currency[] = [];
  currenciesListTemp: Currency[] = [];
  cooControl = new FormControl();
  unitOfMeasure = new FormControl();
  tariff = new FormControl();
  currency = new FormControl();
  currencyQuery = '';
  tariffs: { amount: number; description: string; duty: number; unit: string; id: number }[];
  tariffsTemp: { amount: number; description: string; duty: number; unit: string; id: number }[];
  tariffQuery = '';

  unitOfMeasureList: UnitsOfMeasure[];
  unitOfMeasureListTemp: UnitsOfMeasure[];
  unitQuery: string;

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(theme => this.currentTheme = theme);

    this.currentUser = this.userService.getCurrentUser();

    this.currency.valueChanges
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((val) => {
      this.form.currencyID = val;
    });

    this.loadCountries();
    this.loadTarrifs();
    this.loadUnits();
    this.loadCurrencies();
  }

  ngAfterViewInit(): void {
    this.shortcuts.push(
        {
          key: 'alt + a',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => {
            if (this.showLines) {
              this.submit();
            }
          }
        },
    );
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    if (this.updateLine !== null && this.updateLine !== undefined) {
      this.isUpdate = true;
      this.form.custVal = this.updateLine.custVal;
      this.form.hsQuantity = this.updateLine.hsQuantity;
      this.form.foreignInv = this.updateLine.foreignInv;
      this.form.duty = this.updateLine.duty;
      this.form.cooError = this.updateLine.cooError;
      this.form.custValError = this.updateLine.custValError;
      this.form.hsQuantityError = this.updateLine.hsQuantityError;
      this.form.foreignInvError = this.updateLine.foreignInvError;
      this.form.dutyError = this.updateLine.dutyError;
      this.form.commonFactor = this.updateLine.commonFactor;
      this.form.commonFactorError = this.updateLine.commonFactorError;
    } else {
      this.isUpdate = false;
      this.form = {
        coo: '',
        tariffHeading: '',
        custVal: 0,
        hsQuantity: 0,
        foreignInv: 0,
        duty: 0,
        commonFactor: '',
        cooError: null,
        tariffHeadingError: null,
        custValError: null,
        hsQuantityError: null,
        foreignInvError: null,
        dutyError: null,
        commonFactorError: null,
        unitOfMeasureID: null,
        cooID: null,
        invoiceNo: null,
        prodCode: null,
        tariffID: null,
        vat: null,
        supplyUnit: null,
        currencyID: null,
      };
    }
  }

  submit() {
    if (this.isUpdate) {
      console.log(this.form);
      const model: CustomWorksheetLineReq = {
        customWorksheetLineID: this.lineData.customWorksheetLineID,
        hsQuantity: this.form.hsQuantity,
        foreignInv: this.form.foreignInv,
        custVal: this.form.custVal,
        duty: this.form.duty,
        commonFactor: this.form.commonFactor,
        unitOfMeasureID: this.form.unitOfMeasureID,
        cooID: this.form.cooID,
        invoiceNo: this.form.invoiceNo,
        prodCode: this.form.prodCode,
        tariffID: this.form.tariffID,
        supplyUnit: this.form.supplyUnit,
        currencyID: this.form.currencyID,
      };

      this.updateSADLine.emit(model);
    } else {
      console.log(this.form);
      const model: CustomWorksheetLineReq = {
        hsQuantity: this.form.hsQuantity,
        foreignInv: this.form.foreignInv,
        custVal: this.form.custVal,
        duty: this.form.duty,
        commonFactor: this.form.commonFactor,
        unitOfMeasureID: this.form.unitOfMeasureID,
        cooID: this.form.cooID,
        invoiceNo: this.form.invoiceNo,
        prodCode: this.form.prodCode,
        tariffID: this.form.tariffID,
        supplyUnit: this.form.supplyUnit,
        currencyID: this.form.currencyID,
      };

      this.submitSADLine.emit(model);
    }
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
        console.log(this.countriesList);
      }
    );
  }


  loadTarrifs() {
    this.tariffService.list().then(
      (res: { tariffList: { amount: number; description: string; duty: number; unit: string; id: number }[],
              outcome: Outcome, rowCount: number }) => {
        this.tariffs = res.tariffList;
        console.log(this.tariffs);
        this.tariffsTemp = res.tariffList;
      },
      (msg) => {
      }
    );
  }

  filterCountries() {
    this.countriesList = this.countriesListTemp;
    this.countriesList = this.countriesList.filter(x => this.matchRuleShort(x.name, `*${this.countryQuery}*`));
  }

  selectedCountry(country: number) {
    this.countryID = country;
    this.form.cooID = this.countryID;
  }
  selectedCurrency(currency: number) {
    this.currency.setValue(currency);
  }

  matchRuleShort(str, rule) {
    const escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
  }
  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
  }

  selectedTariff(tariff: number) {
    console.log(tariff);
    this.form.tariffID = tariff;
  }

  filterTariff() {
    this.tariffs = this.tariffsTemp;
    this.tariffs = this.tariffs.filter(x => this.matchRuleShort(x.description, `*${this.tariffQuery}*`));
  }

  loadUnits(): void {
    // tslint:disable-next-line: max-line-length
    this.unitService.list({ userID: this.currentUser.userID, specificUnitOfMeasureID: -1, rowStart: 1, rowEnd: 1000, filter: '', orderBy: '', orderByDirection: '' }).then(
      (res: ListUnitsOfMeasure) => {
        if (res.outcome.outcome === 'SUCCESS') {
          this.unitOfMeasureList = res.unitOfMeasureList;
          this.unitOfMeasureListTemp = res.unitOfMeasureList;
        }
      },
      (msg) => {

      }
    );
  }
  loadCurrencies() {
    const model: CurrenciesListRequest = {
      userID: this.currentUser.userID,
      specificCurrencyID: -1,
      filter: '',
      orderBy: 'Name',
      orderByDirection: 'ASC',
      rowStart: 1,
      rowEnd: 1000
    };
    this.currencyService.list(model).then(
      (res: CurrencyListResponse) => {
        if (res.outcome.outcome === 'SUCCESS') {
          this.currenciesList = res.currenciesList;
          this.currenciesListTemp = res.currenciesList;
        } else {
          // nothing
        }
      },
      (msg) => {

      }
    );
  }

  filterCurrency() {
    this.currenciesList = this.currenciesListTemp;
    this.currenciesList = this.currenciesList.filter(x => x.code.match(this.currency.value));
  }
  filterUnit() {
    this.unitOfMeasureList = this.unitOfMeasureListTemp;
    this.unitOfMeasureList = this.unitOfMeasureList.filter(x => this.matchRuleShort(x.name, `*${this.unitQuery}*`));
  }

  selectedUnit(unit) {
    this.form.unitOfMeasureID = unit.unitOfMeasureID;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}


