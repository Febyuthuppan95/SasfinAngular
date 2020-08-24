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
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { CustomWorksheetLine } from 'src/app/models/HttpResponses/CustomWorksheetLine';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-form-custom-worksheet-lines',
    templateUrl: './form-custom-worksheet-lines.component.html',
    styleUrls: ['./form-custom-worksheet-lines.component.scss']
})
export class FormCustomWorksheetLinesComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    disabledcommonFactor: boolean;
  commonFactorOReason: string;
  disabledcustVal: boolean;
  custValOReason: string;
  disabledhsQuantity: boolean;
  hsQuantityOReason: string;
  disabledforeignInv: boolean;
  foreignInvOReason: string;
  disabledduty: boolean;
  dutyOReason: string;
    constructor(private themeService: ThemeService, private unitService: UnitMeasureService, private userService: UserService,
                private validate: ValidateService, private tariffService: TariffService, private captureService: CaptureService,
                private snackbarService: HelpSnackbar, private snackbar: MatSnackBar,  private placeService: PlaceService,
                private currencyService: CurrenciesService) { }

    currentUser: User;
    currentTheme: string;
    focusLineForm: boolean;
    private unsubscribe$ = new Subject<void>();

    LinesForm = new FormGroup({
      control1: new FormControl(null, [Validators.required]),
      control1a: new FormControl(null),
      control2: new FormControl(null, [Validators.required]),
      control2a: new FormControl(null),
      control3: new FormControl(null, [Validators.nullValidator]),
      control3a: new FormControl(null),
      control4: new FormControl(null, [Validators.required]),
      control4a: new FormControl(null),
      control5: new FormControl(null, [Validators.required]),
      control5a: new FormControl(null),
      control6: new FormControl(null, [Validators.nullValidator]),
      control7: new FormControl(null, [Validators.nullValidator]),
      control8: new FormControl(null, [Validators.required]),
      control9: new FormControl(null, [Validators.nullValidator]),
      control10: new FormControl(null, [Validators.nullValidator]),
      control11: new FormControl(null, [Validators.nullValidator]),
      control12: new FormControl(null, [Validators.nullValidator]),
    });

    @Input() lineData: CustomWorksheetLine;
    @Input() updateLine: CustomWorksheetLine;
    @Input() focusSADLine: boolean;
    @Input() showLines: boolean;
    @Output() submitSADLine = new EventEmitter<CustomWorksheetLine>();
    @Output() updateCWSLine = new EventEmitter<CustomWorksheetLine>();
    @Output() linesValid = new EventEmitter<boolean>();

    shortcuts: ShortcutInput[] = [];
    @ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;

    form = {
        coo: {
            value: null,
            error: null,
            OBit: null,
            OUserID: null,
            ODate: null,
            OReason: null,
        },
        tariffHeading: {
            value: null,
            error: null,
            OBit: null,
            OUserID: null,
            ODate: null,
            OReason: null,
        },
        custVal: {
            value: null,
            error: null,
            OBit: null,
            OUserID: null,
            ODate: null,
            OReason: null,
        },
        hsQuantity: {
            value: null,
            error: null,
            OBit: null,
            OUserID: null,
            ODate: null,
            OReason: null,
        },
        foreignInv: {
            value: null,
            error: null,
            OBit: null,
            OUserID: null,
            ODate: null,
            OReason: null,
        },
        duty: {
            value: null,
            error: null,
            OBit: null,
            OUserID: null,
            ODate: null,
            OReason: null,
        },
        commonFactor: {
            value: null,
            error: null,
            OBit: null,
            OUserID: null,
            ODate: null,
            OReason: null,
        },
        unitOfMeasureID: {
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
        },
        invoiceNo: {
            value: null,
            error: null,
            OBit: null,
            OUserID: null,
            ODate: null,
            OReason: null,
        },
        prodCode: {
            value: null,
            error: null,
            OBit: null,
            OUserID: null,
            ODate: null,
            OReason: null,
        },
        tariffID: {
            value: null,
            error: null,
            OBit: null,
            OUserID: null,
            ODate: null,
            OReason: null,
        },
        vat: {
            value: null,
            error: null,
            OBit: null,
            OUserID: null,
            ODate: null,
            OReason: null,
        },
        supplyUnit: {
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
    };

    isUpdate: boolean;

    countriesList: CountryItem[] = [];
    countriesListTemp: { rowNum: number, countryID: number, name: string, code: string }[];
    countryID = -1;
    countryQuery = '';
    currenciesList: Currency[] = [];
    currenciesListTemp: Currency[] = [];
    cooControl = new FormControl();
    unitOfMeasure = new FormControl();
    tariff = new FormControl();
    currency = new FormControl();
    // tslint:disable-next-line: no-inferrable-types
    currencyQuery: string = '';
    // tslint:disable-next-line: max-line-length
    tariffs: {id: number, itemNumber: string; heading: string; tariffCode: number; subHeading: string; checkDigit: string; name: string; duty: string; hsUnit: string; }[];
    // tslint:disable-next-line: max-line-length
    tariffsTemp: {id: number, itemNumber: string; heading: string; tariffCode: number; subHeading: string; checkDigit: string; name: string; duty: string; hsUnit: string; }[];
    tariffQuery = '';

    unitOfMeasureList: UnitsOfMeasure[];
    unitOfMeasureListTemp: UnitsOfMeasure[];
    unitQuery: string;

    ngOnInit() {
        this.themeService.observeTheme()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(theme => this.currentTheme = theme);

        this.currentUser = this.userService.getCurrentUser();

        // this.currency.valueChanges
        // .pipe(takeUntil(this.unsubscribe$))
        // .subscribe((val) => {
        //   this.form.currencyID = val;
        // });

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
        // console.log(this.updateLine);
        // console.log(this.lineData);
    }

    ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
        // console.log(this.updateLine);
        this.clearQueries();
        if (this.updateLine !== null && this.updateLine !== undefined) {
            this.isUpdate = true;
            this.form.custVal.value = this.updateLine.custVal;
            this.form.hsQuantity.value = this.updateLine.hsQuantity;
            this.form.foreignInv.value = this.updateLine.foreignInv;
            this.form.duty.value = this.updateLine.duty;
            this.form.commonFactor.value = this.updateLine.commonFactor;
            this.form.supplyUnit.value = this.updateLine.supplyUnit;
            this.form.unitOfMeasureID.value = this.updateLine.unitOfMeasureID;
            this.form.currencyID.value = this.updateLine.currencyID;
            this.form.tariffID.value = this.updateLine.tariffID;
            this.form.invoiceNo.value = this.updateLine.invoiceNo;
            this.form.prodCode.value = this.updateLine.prodCode;
            this.form.cooID.value = this.updateLine.cooID;

            this.form.cooID.OBit = this.updateLine.cooOBit;
            this.form.cooID.OUserID = this.updateLine.cooOUserID;
            this.form.cooID.ODate = this.updateLine.cooODate;
            this.form.cooID.OReason = this.updateLine.cooOReason;

            this.form.tariffHeading.OBit = this.updateLine.tariffHeadingOBit;
            this.form.tariffHeading.OUserID = this.updateLine.tariffHeadingOUserID;
            this.form.tariffHeading.ODate = this.updateLine.tariffHeadingODate;
            this.form.tariffHeading.OReason = this.updateLine.tariffHeadingOReason;

            this.form.hsQuantity.OBit = this.updateLine.hsQuantityOBit;
            this.form.hsQuantity.OUserID = this.updateLine.hsQuantityOUserID;
            this.form.hsQuantity.ODate = this.updateLine.hsQuantityODate;
            this.form.hsQuantity.OReason = this.updateLine.hsQuantityOReason;

            this.form.foreignInv.OBit = this.updateLine.foreignInvOBit;
            this.form.foreignInv.OUserID = this.updateLine.foreignInvOUserID;
            this.form.foreignInv.ODate = this.updateLine.foreignInvODate;
            this.form.foreignInv.OReason = this.updateLine.foreignInvOReason;

            this.form.custVal.OBit = this.updateLine.custValOBit;
            this.form.custVal.OUserID = this.updateLine.custValOUserID;
            this.form.custVal.ODate = this.updateLine.custValODate;
            this.form.custVal.OReason = this.updateLine.custValOReason;

            this.form.duty.OBit = this.updateLine.dutyOBit;
            this.form.duty.OUserID = this.updateLine.dutyOUserID;
            this.form.duty.ODate = this.updateLine.dutyODate;
            this.form.duty.OReason = this.updateLine.dutyOReason;

            this.form.commonFactor.OBit = this.updateLine.commonFactorOBit;
            this.form.commonFactor.OUserID = this.updateLine.commonFactorOUserID;
            this.form.commonFactor.ODate = this.updateLine.commonFactorODate;
            this.form.commonFactor.OReason = this.updateLine.commonFactorOReason;

            this.form.invoiceNo.OBit = this.updateLine.invoiceNoOBit;
            this.form.invoiceNo.OUserID = this.updateLine.invoiceNoOUserID;
            this.form.invoiceNo.ODate = this.updateLine.invooiceNoODate;
            this.form.invoiceNo.OReason = this.updateLine.invoiceNoOReason;

            this.form.prodCode.OBit = this.updateLine.prodCodeOBit;
            this.form.prodCode.OUserID = this.updateLine.prodCodeOUserID;
            this.form.prodCode.ODate = this.updateLine.prodCodeODate;
            this.form.prodCode.OReason = this.updateLine.prodCodeOReason;

            this.form.vat.OBit = this.updateLine.vatOBit;
            this.form.vat.OUserID = this.updateLine.vatOUserID;
            this.form.vat.ODate = this.updateLine.vatODate;
            this.form.vat.OReason = this.updateLine.vatOReason;

            this.form.supplyUnit.OBit = this.updateLine.supplyUnitOBit;
            this.form.supplyUnit.OUserID = this.updateLine.supplyUnitOUserID;
            this.form.supplyUnit.ODate = this.updateLine.supplyUnitODate;
            this.form.supplyUnit.OReason = this.updateLine.supplyUnitOReason;

            if (this.updateLine.errors !== undefined && this.updateLine.errors.attachmentErrors.length > 0) {
                this.updateLine.errors.attachmentErrors.forEach(error => {
                    if (error.fieldName === 'Country Of Orgin') {
                        this.form.cooID.error = error.errorDescription;
                    } else if (error.fieldName === 'Tariff') {
                        this.form.tariffHeading.error = error.errorDescription;
                    } else if (error.fieldName === 'Quantity') {
                        this.form.hsQuantity.error = error.errorDescription;
                    } else if (error.fieldName === 'Foreign Inv') {
                        this.form.foreignInv.error = error.errorDescription;
                    } else if (error.fieldName === 'Customs Value') {
                        this.form.custVal.error = error.errorDescription;
                    } else if (error.fieldName === 'Duty') {
                        this.form.duty.error = error.errorDescription;
                    } else if (error.fieldName === 'Common Factor') {
                        this.form.commonFactor.error = error.errorDescription;
                    } else if (error.fieldName === 'InvoiceNo') {
                        this.form.invoiceNo.error = error.errorDescription;
                    } else if (error.fieldName === 'Product Code') {
                        this.form.prodCode.error = error.errorDescription;
                    } else if (error.fieldName === 'VAT') {
                        this.form.vat.error = error.errorDescription;
                    } else if (error.fieldName === 'Supply Unit') {
                        this.form.supplyUnit.error = error.errorDescription;
                    }
                });
            }
            if (this.form.cooID.value !== null || this.form.cooID.value !== 0) {
              this.initfilterCountries();
            }

            if (this.form.currencyID.value !== null || this.form.currencyID.value !== 0) {
              this.initfilterCurrency();
            }

            if (this.form.unitOfMeasureID.value !== null || this.form.unitOfMeasureID.value !== 0) {
              this.initfilterUnit();
            }

            if (this.form.tariffID.value !== null || this.form.tariffID.value !== 0) {
              this.initfilterTariffs();
            }

            this.linesValid.emit(true);

        } else {
            this.isUpdate = false;
            this.form = {
                coo: {
                    value: null,
                    error: null,
                    OBit: null,
                    OUserID: null,
                    ODate: null,
                    OReason: null,
                },
                tariffHeading: {
                    value: null,
                    error: null,
                    OBit: null,
                    OUserID: null,
                    ODate: null,
                    OReason: null,
                },
                custVal: {
                    value: null,
                    error: null,
                    OBit: null,
                    OUserID: null,
                    ODate: null,
                    OReason: null,
                },
                hsQuantity: {
                    value: null,
                    error: null,
                    OBit: null,
                    OUserID: null,
                    ODate: null,
                    OReason: null,
                },
                foreignInv: {
                    value: null,
                    error: null,
                    OBit: null,
                    OUserID: null,
                    ODate: null,
                    OReason: null,
                },
                duty: {
                    value: null,
                    error: null,
                    OBit: null,
                    OUserID: null,
                    ODate: null,
                    OReason: null,
                },
                commonFactor: {
                    value: null,
                    error: null,
                    OBit: null,
                    OUserID: null,
                    ODate: null,
                    OReason: null,
                },
                unitOfMeasureID: {
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
                },
                invoiceNo: {
                    value: null,
                    error: null,
                    OBit: null,
                    OUserID: null,
                    ODate: null,
                    OReason: null,
                },
                prodCode: {
                    value: null,
                    error: null,
                    OBit: null,
                    OUserID: null,
                    ODate: null,
                    OReason: null,
                },
                tariffID: {
                    value: null,
                    error: null,
                    OBit: null,
                    OUserID: null,
                    ODate: null,
                    OReason: null,
                },
                vat: {
                    value: null,
                    error: null,
                    OBit: null,
                    OUserID: null,
                    ODate: null,
                    OReason: null,
                },
                supplyUnit: {
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
            };
        }
    }
    clearQueries() {
        this.countryQuery = '';
        this.tariffQuery = '';
        this.unitQuery = '';
        this.currencyQuery = '';
      }
    submit() {
      // console.log('logvalid');
      // console.log(this.LinesForm);
      if (this.LinesForm.valid) {
        const model: CustomWorksheetLine = {
            userID: this.currentUser.userID,
            customWorksheetLineID: this.isUpdate ? this.updateLine.customWorksheetLineID : -1,
            customWorksheetID: -1,
            hsQuantity: this.form.hsQuantity.value,
            foreignInv: this.form.foreignInv.value,
            custVal: this.form.custVal.value,
            duty: this.form.duty.value,
            commonFactor: this.form.commonFactor.value,
            unitOfMeasureID: this.form.unitOfMeasureID.value,
            cooID: this.form.cooID.value,
            invoiceNo: this.form.invoiceNo.value,
            prodCode: this.form.prodCode.value,
            tariffID: this.form.tariffID.value,
            supplyUnit: this.form.supplyUnit.value,
            currencyID: this.form.currencyID.value,
            isDeleted: 0,

            cooOBit: this.form.cooID.OBit,
            cooOUserID: this.form.cooID.OUserID,
            cooODate: this.form.cooID.ODate,
            cooOReason: this.form.cooID.OReason,

            tariffHeadingOBit: this.form.tariffHeading.OBit,
            tariffHeadingOUserID: this.form.tariffHeading.OUserID,
            tariffHeadingODate: this.form.tariffHeading.ODate,
            tariffHeadingOReason: this.form.tariffHeading.OReason,

            hsQuantityOBit: this.form.hsQuantity.OBit,
            hsQuantityOUserID: this.form.hsQuantity.OUserID,
            hsQuantityODate: this.form.hsQuantity.ODate,
            hsQuantityOReason: this.form.hsQuantity.OReason,

            foreignInvOBit: this.form.foreignInv.OBit,
            foreignInvOUserID: this.form.foreignInv.OUserID,
            foreignInvODate: this.form.foreignInv.ODate,
            foreignInvOReason: this.form.foreignInv.OReason,

            custValOBit: this.form.custVal.OBit,
            custValOUserID: this.form.custVal.OUserID,
            custValODate: this.form.custVal.ODate,
            custValOReason: this.form.custVal.OReason,

            dutyOBit: this.form.duty.OBit,
            dutyOUserID: this.form.duty.OUserID,
            dutyODate: this.form.duty.ODate,
            dutyOReason: this.form.duty.OReason,

            commonFactorOBit: this.form.commonFactor.OBit,
            commonFactorOUserID: this.form.commonFactor.OUserID,
            commonFactorODate: this.form.commonFactor.ODate,
            commonFactorOReason: this.form.commonFactor.OReason,

            invoiceNoOBit: this.form.invoiceNo.OBit,
            invoiceNoOUserID: this.form.invoiceNo.OUserID,
            invooiceNoODate: this.form.invoiceNo.ODate,
            invoiceNoOReason: this.form.invoiceNo.OReason,

            prodCodeOBit: this.form.prodCode.OBit,
            prodCodeOUserID: this.form.prodCode.OUserID,
            prodCodeODate: this.form.prodCode.ODate,
            prodCodeOReason: this.form.prodCode.OReason,

            vatOBit: this.form.vat.OBit,
            vatOUserID: this.form.vat.OUserID,
            vatODate: this.form.vat.ODate,
            vatOReason: this.form.vat.OReason,

            supplyUnitOBit: this.form.supplyUnit.OBit,
            supplyUnitOUserID: this.form.supplyUnit.OUserID,
            supplyUnitODate: this.form.supplyUnit.ODate,
            supplyUnitOReason: this.form.supplyUnit.OReason,
        };

        // const valid: { errors: object[], count: number } = this.validate.model(model);
        // console.log(valid);
        // if (valid.count > 0) {
        if ( this.isUpdate) {
          this.updateCWSLine.emit(model);
        } else {
          // console.log('model');
          // console.log(model);
          this.submitSADLine.emit(model);
        }
      } else {
         this.snackbar.open(`Please fill in the all lines data`, '', {
        duration: 3000,
        panelClass: ['capture-snackbar-error'],
        horizontalPosition: 'center',
       });
      }

      this.linesValid.emit(this.LinesForm.valid);
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
                // console.log( 'countriesList');
                // console.log( res.countriesList);
                this.countriesListTemp = res.countriesList;

                const currentCountry = this.countriesList.find(x => x.countryID === this.form.cooID.value);
                this.countryQuery = currentCountry ? currentCountry.code : null;
            }
        );
    }

    loadTarrifs(query?: string) {
      // tslint:disable-next-line: max-line-length
      this.tariffService.list({ userID: this.currentUser.userID, specificTariffID: -1, filter: query, orderBy: '', orderByDirection: '', rowStart: 1, rowEnd: 100 }).then(
        // tslint:disable-next-line: max-line-length
        (res: { tariffList: {id: number, itemNumber: string; heading: string; tariffCode: number; subHeading: string; checkDigit: string; name: string; duty: string; hsUnit: string; }[], outcome: Outcome, rowCount: number }) => {
          this.tariffs = res.tariffList;
          this.tariffsTemp = res.tariffList;
        },
        (msg) => {
          console.log(JSON.stringify(msg));
        }
      );
    }


    filterCountries() {
        this.countriesList = this.countriesListTemp;
        // tslint:disable-next-line: max-line-length
        this.countriesList = this.countriesList.filter(x => this.matchRuleShort(x.code, `*${this.countryQuery !== null ? this.countryQuery.toUpperCase() : ''}*`));
    }

    initfilterCountries() {
      this.countriesList = this.countriesListTemp;
      this.countriesList = this.countriesList.filter(x => x.countryID === this.form.cooID.value);
      this.countryQuery = this.countriesList[0].code;
  }

    selectedCountry(country: number) {
        this.countryID = country;
        this.form.cooID.value = this.countryID;
    }
    selectedCurrency(currency: number) {
        this.form.currencyID.value = currency;
        // console.log(this.form.currencyID);
        // this.currency.setValue(currency);
    }

    matchRuleShort(str, rule) {
        // tslint:disable-next-line: no-shadowed-variable
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
        this.form.tariffID.value = tariff;
    }

    filterTariff() {
        // this.tariffs = this.tariffsTemp;
        // // tslint:disable-next-line: max-line-length
        // tslint:disable-next-line: max-line-length
        // this.tariffs = this.tariffs.filter(x => this.matchRuleShort(x.name.toUpperCase(), `*${this.tariffQuery !== null ? this.tariffQuery.toUpperCase() : ''}*`));
        this.loadTarrifs(this.tariffQuery);
    }

    loadUnits(): void {
        // tslint:disable-next-line: max-line-length
        this.unitService.list({ userID: this.currentUser.userID, specificUnitOfMeasureID: -1, rowStart: 1, rowEnd: 1000, filter: '', orderBy: '', orderByDirection: '' }).then(
            (res: ListUnitsOfMeasure) => {
                if (res.outcome.outcome === 'SUCCESS') {
                    this.unitOfMeasureList = res.unitOfMeasureList;
                    this.unitOfMeasureListTemp = res.unitOfMeasureList;
                    // tslint:disable-next-line: max-line-length
                    this.unitQuery = this.isUpdate ? this.unitOfMeasureList.find(x => x.unitOfMeasureID === this.form.unitOfMeasureID.value).name : '';
                    // console.log(this.unitQuery);
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
                    const currentCurrency = this.currenciesList.find(x => x.currencyID === this.form.currencyID.value);
                    this.currencyQuery = currentCurrency ? currentCurrency.code : null;
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
        // tslint:disable-next-line: max-line-length
        this.currenciesList = this.currenciesList.filter(x => this.matchRuleShort(x.code, `*${this.currencyQuery !== null ? this.currencyQuery.toUpperCase() : ''}*`));
    }

    initfilterCurrency() {
      this.currenciesList = this.currenciesListTemp;
      // console.log(this.currenciesList);
      // console.log(this.form.currencyID.value);
      this.currenciesList = this.currenciesList.filter(x => x.currencyID === this.form.currencyID.value.toString());
      // console.log(this.currenciesList);
      this.currencyQuery = this.currenciesList[0].code;
    }

    filterUnit() {
        this.unitOfMeasureList = this.unitOfMeasureListTemp;
        // tslint:disable-next-line: max-line-length
        this.unitOfMeasureList = this.unitOfMeasureList.filter(x => this.matchRuleShort(x.name, `*${this.unitQuery !== null ? this.unitQuery.toUpperCase() : ''}*`));
    }

    initfilterUnit() {
      this.unitOfMeasureList = this.unitOfMeasureListTemp;
      this.unitOfMeasureList = this.unitOfMeasureList.filter(x => x.unitOfMeasureID === this.form.unitOfMeasureID.value);
      this.unitQuery = this.unitOfMeasureList[0].name;
    }

    initfilterTariffs() {
      this.tariffs = this.tariffsTemp;
      this.tariffs = this.tariffs.filter(x => x.id === this.form.tariffID.value);
      this.tariffQuery = this.tariffs[0].name;
    }

    selectedUnit(id: number) {
        this.form.unitOfMeasureID.value = id;
    }

    OverridecommonFactorClick() {
      this.form.commonFactor.OUserID = this.currentUser.userID;
      this.form.commonFactor.OBit = true;
      this.form.commonFactor.ODate = new Date();
      this.disabledcommonFactor = false;
      this.commonFactorOReason = '';
    }

    OverridecommonFactorExcept() {
      // this.form.importersCode.OReason = reason;
      this.disabledcommonFactor = true;
    }

    UndoOverridecommonFactor() {
      this.form.commonFactor.OUserID = null;
      this.form.commonFactor.OBit = null;
      this.form.commonFactor.ODate = null;
      this.form.commonFactor.OReason = null;
      this.commonFactorOReason = '';
      this.disabledcommonFactor = false;
    }

    OverridecustValClick() {
      this.form.custVal .OUserID = this.currentUser.userID;
      this.form.custVal.OBit = true;
      this.form.custVal .ODate = new Date();
      this.disabledcustVal = false;
      this.custValOReason = '';
    }

    OverridecustValExcept() {
      // this.form.LRN .OReason = reason;
      this.disabledcustVal  = true;
      // console.log(this.form.custVal);
    }

    UndoOverridecustVal() {
      this.form.custVal.OUserID = null;
      this.form.custVal.OBit = null;
      this.form.custVal.ODate = null;
      this.form.custVal.OReason = null;
      this.custValOReason = '';
      this.disabledcustVal = false;
    }

    OverridehsQuantityClick() {
      this.form.hsQuantity.OUserID = this.currentUser.userID;
      this.form.hsQuantity.OBit = true;
      this.form.hsQuantity.ODate = new Date();
      this.disabledhsQuantity = false;
      this.hsQuantityOReason = '';
    }

    OverridehsQuantityExcept() {
      this.disabledhsQuantity  = true;
      // console.log(this.form.hsQuantity);
    }

    UndoOverridehsQuantity() {
      this.form.hsQuantity.OUserID = null;
      this.form.hsQuantity.OBit = null;
      this.form.hsQuantity.ODate = null;
      this.form.hsQuantity.OReason = null;
      this. hsQuantityOReason = '';
      this.disabledhsQuantity = false;
    }

    OverrideforeignInvClick() {
      this.form.foreignInv.OUserID = this.currentUser.userID;
      this.form.foreignInv.OBit = true;
      this.form.foreignInv.ODate = new Date();
      this.disabledforeignInv = false;
      this.foreignInvOReason = '';
    }

    OverrideforeignInvExcept() {
      // this.form.LRN .OReason = reason;
      this.disabledforeignInv  = true;
      // console.log(this.form.foreignInv);
    }

    UndoOverrideforeignInv() {
      this.form.foreignInv.OUserID = null;
      this.form.foreignInv.OBit = null;
      this.form.foreignInv.ODate = null;
      this.form.foreignInv.OReason = null;
      this. foreignInvOReason = '';
      this.disabledforeignInv = false;
    }

    OverridedutyClick() {
      this.form.duty.OUserID = this.currentUser.userID;
      this.form.duty.OBit = true;
      this.form.duty.ODate = new Date();
      this.disabledduty = false;
      this.dutyOReason = '';
    }

    OverridedutyExcept() {
      // this.form.LRN .OReason = reason;
      this.disabledduty  = true;
      // console.log(this.form.duty);
    }

    UndoOverrideduty() {
      this.form.duty.OUserID = null;
      this.form.duty.OBit = null;
      this.form.duty.ODate = null;
      this.form.duty.OReason = null;
      this. dutyOReason = '';
      this.disabledduty = false;
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}

