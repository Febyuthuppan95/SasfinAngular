import { PlaceService } from './../../../../../services/Place.Service';
import { ListCountriesRequest, CountriesListResponse, CountryItem } from './../../../../../models/HttpRequests/Locations';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { Component, OnInit, OnChanges, AfterViewInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { CaptureService } from 'src/app/services/capture.service';
import { User } from 'src/app/models/HttpResponses/User';
import { Subject } from 'rxjs';
import { ShortcutInput, KeyboardShortcutsComponent, AllowIn } from 'ng-keyboard-shortcuts';
import { takeUntil } from 'rxjs/operators';
import { InvoiceLine } from 'src/app/models/HttpResponses/Invoices';
import { Currency } from 'src/app/models/HttpResponses/Currency';
import { CurrenciesService } from 'src/app/services/Currencies.Service';
import { ListCurrencies } from 'src/app/models/HttpResponses/ListCurrencies';
import { UnitsOfMeasure } from 'src/app/models/HttpResponses/UnitsOfMeasure';
import { ListUnitsOfMeasure } from 'src/app/models/HttpResponses/ListUnitsOfMeasure';
import { UnitMeasureService } from 'src/app/services/Units.Service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { MatSnackBar } from '@angular/material';
import { Items, ItemsListResponse } from 'src/app/models/HttpResponses/ItemsListResponse';
import { CompanyService } from 'src/app/services/Company.Service';

@Component({
  selector: 'app-form-invoice-lines',
  templateUrl: './form-invoice-lines.component.html',
  styleUrls: ['./form-invoice-lines.component.scss']
})
export class FormInvoiceLinesComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    disabledinvoiceNo: boolean;
  invoiceNoOReason: string;
  disabledprodCode: boolean;
  prodCodeOReason: string;
  disabledquantity: boolean;
  quantityOReason: string;
  disableditemValue: boolean;
  itemValueOReason: string;
  disabledunitPrice: boolean;
  unitPriceOReason: string;
  totalLineValueOReason: string;
  disabledtotalLineValue: boolean;
  itemQuery = '';


    constructor(
      private themeService: ThemeService,
      private userService: UserService,
      private captureService: CaptureService,
      private unitService: UnitMeasureService,
      private snackbarService: HelpSnackbar,
      private placeService: PlaceService,
      private companyService: CompanyService,
      private snackbar: MatSnackBar) { }

    LinesForm = new FormGroup({
      control1: new FormControl(null, [Validators.required]),
      control1a: new FormControl(null),
      control2: new FormControl(null, [Validators.required]),
      control3: new FormControl(null, [Validators.required]),
      control4: new FormControl(null, [Validators.required]),
      control5: new FormControl(null, [Validators.required]),
      control5a: new FormControl(null),
      control6: new FormControl(null, [Validators.required]),
      control6a: new FormControl(null),
      control7: new FormControl(null, [Validators.required]),
      control7a: new FormControl(null),
      control8: new FormControl(null, [Validators.required]),
      control8a: new FormControl(null),
    });

    currentUser: User;
    currentTheme: string;
    focusLineForm: boolean;
    unitOfMeasureList: UnitsOfMeasure[];
    unitOfMeasureListTemp: UnitsOfMeasure[];
    unitOfMeasure = new FormControl();
    private unsubscribe$ = new Subject<void>();
    unitOfMeasureQuery = '';
    items: Items[] = [];
    itemsTemp: Items[] = [];

    @Input() lineData: InvoiceLine;
    @Input() updateSAD500Line: InvoiceLine;
    @Input() focusSADLine: boolean;
    @Input() showLines: boolean;
    @Output() submitLine = new EventEmitter<InvoiceLine>();
    @Output() updateLine = new EventEmitter<InvoiceLine>();
    @Output() linesValid = new EventEmitter<boolean>();

    shortcuts: ShortcutInput[] = [];
    @ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;

    form = {
      prodCode: {
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
      quantity: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
      },
      itemValue: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
      },
      itemID: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
      },
      unitPrice: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
      },
      totalLineValue: {
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
      unitOfMeasure: {
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
    countriesList: CountryItem[] = [];
    countriesListTemp: {rowNum: number, countryID: number, name: string, code: string}[];
    countryQuery = '';
    isUpdate: boolean;

    ngOnInit() {
      this.themeService.observeTheme()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(theme => this.currentTheme = theme);

      this.currentUser = this.userService.getCurrentUser();
      this.loadUnits();
      this.loadItems();
      this.loadCountries();
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
      if (this.updateSAD500Line !== null && this.updateSAD500Line !== undefined) {
        this.isUpdate = true;
        this.form.quantity.value = this.updateSAD500Line.quantity;
        this.form.itemValue.value = this.updateSAD500Line.itemValue;
        this.form.prodCode.value = this.updateSAD500Line.prodCode;
        this.form.unitPrice.value = this.updateSAD500Line.unitPrice;
        this.form.totalLineValue.value = this.updateSAD500Line.totalLineValue;
        // this.form.unitOfMeasure = this.updateSAD500Line.unitOfMeasure;
        this.form.unitOfMeasureID.value = this.updateSAD500Line.unitOfMeasureID;
      } else {
        this.isUpdate = false;

        this.form = {
          prodCode: {
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
          quantity: {
            value: null,
            error: null,
            OBit: null,
            OUserID: null,
            ODate: null,
            OReason: null,
          },
          itemValue: {
            value: null,
            error: null,
            OBit: null,
            OUserID: null,
            ODate: null,
            OReason: null,
          },
          itemID: {
            value: null,
            error: null,
            OBit: null,
            OUserID: null,
            ODate: null,
            OReason: null,
          },
          unitPrice: {
            value: null,
            error: null,
            OBit: null,
            OUserID: null,
            ODate: null,
            OReason: null,
          },
          totalLineValue: {
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
          unitOfMeasure: {
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
      }

    }

    submit() {
      if (this.LinesForm.valid) {
        if (this.isUpdate) {
          const request: InvoiceLine = {
            prodCode: this.form.prodCode.value,
            invoiceID: this.updateSAD500Line.invoiceID,
            quantity: this.form.quantity.value,
            itemValue: this.form.itemValue.value,
            invoiceLineID: this.updateSAD500Line.invoiceLineID,
            unitPrice: this.form.unitPrice.value,
            totalLineValue: this.form.totalLineValue.value,
            // unitOfMeasure: this.form.unitOfMeasure,
            cooID: this.form.cooID.value,
            unitOfMeasureID: this.form.unitOfMeasureID.value,
            guid: UUID.UUID(),
          };

          this.updateLine.emit(request);
        } else {

          const request: InvoiceLine = {
            invoiceNo: this.form.invoiceNo.value,
            itemID: this.form.itemID.value,
            unitOfMeasureID: this.form.unitOfMeasureID.value,
            cooID: this.form.cooID.value,
            prodCode: this.form.prodCode.value,
            quantity: this.form.quantity.value,
            itemValue: this.form.itemValue.value,
            unitPrice: this.form.unitPrice.value,
            totalLineValue: this.form.totalLineValue.value,
            guid: UUID.UUID(),
          };
          this.submitLine.emit(request);
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

    filterUnit() {
      this.unitOfMeasureList = this.unitOfMeasureListTemp;
      // tslint:disable-next-line: max-line-length
      this.unitOfMeasureList = this.unitOfMeasureList.filter(x => this.matchRuleShort(x.name.toUpperCase(), `*${this.unitOfMeasureQuery.toUpperCase()}*`));
    }

    loadItems() {
      const model = {
        userID: this.currentUser.userID,
        filter: '',
        specificItemID: -1,
        rowStart: 1,
        rowEnd: 100000000,
        orderBy: '',
        orderByDirection: ''
      };
      this.companyService.getItemList(model).then(
        (res: ItemsListResponse) => {
          this.items = res.itemsLists;
          this.itemsTemp = this.items;
          console.log('items');
          console.log(this.items);
        },
        msg => {
          console.log(msg);
        }
      );
    }

    filterItems() {
      this.items = this.itemsTemp;
      this.items = this.items.filter(x => this.matchRuleShort(x.item.toUpperCase(), `*${this.itemQuery.toUpperCase()}*`));
    }
    selectedItem(item: number) {
      this.form.itemID.value = item;
    }

    matchRuleShort(str, rule) {
      // tslint:disable-next-line: no-shadowed-variable
      const escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
      return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
    }

    selectedUnit(unit) {
      this.form.unitOfMeasureID.value = unit;
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
          console.log('countries');
          console.log(res);
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
      // tslint:disable-next-line: max-line-length
      this.countriesList = this.countriesList.filter(x => this.matchRuleShort(x.name.toUpperCase(), `*${this.countryQuery.toUpperCase()}*`));
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

    OverrideprodCodeClick() {
      this.form.prodCode.OUserID = this.currentUser.userID;
      this.form.prodCode.OBit = true;
      this.form.prodCode.ODate = new Date();
      this.disabledprodCode = false;
      this.prodCodeOReason = '';
    }

    OverrideprodCodeExcept() {
      this.disabledprodCode = true;
      console.log(this.form.prodCode);
    }

    UndoOverrideprodCode() {
      this.form.prodCode.OUserID = null;
      this.form.prodCode.OBit = null;
      this.form.prodCode.ODate = null;
      this.form.prodCode.OReason = null;
      this.prodCodeOReason = '';
      this.disabledprodCode = false;
    }

    OverridequantityClick() {
      this.form.quantity.OUserID = this.currentUser.userID;
      this.form.quantity.OBit = true;
      this.form.quantity.ODate = new Date();
      this.disabledquantity = false;
      this.quantityOReason = '';
    }

    OverridequantityExcept() {
      this.disabledquantity = true;
      console.log(this.form.quantity);
    }

    UndoOverridequantity() {
      this.form.quantity.OUserID = null;
      this.form.quantity.OBit = null;
      this.form.quantity.ODate = null;
      this.form.quantity.OReason = null;
      this.quantityOReason = '';
      this.disabledquantity = false;
    }

    OverrideitemValueClick() {
      this.form.itemValue.OUserID = this.currentUser.userID;
      this.form.itemValue.OBit = true;
      this.form.itemValue.ODate = new Date();
      this.disableditemValue = false;
      this.itemValueOReason = '';
    }

    OverrideitemValueExcept() {
      this.disableditemValue = true;
      console.log(this.form.itemValue);
    }

    UndoOverrideitemValue() {
      this.form.itemValue.OUserID = null;
      this.form.itemValue.OBit = null;
      this.form.itemValue.ODate = null;
      this.form.itemValue.OReason = null;
      this.itemValueOReason = '';
      this.disableditemValue = false;
    }

    OverrideunitPriceClick() {
      this.form.unitPrice.OUserID = this.currentUser.userID;
      this.form.unitPrice.OBit = true;
      this.form.unitPrice.ODate = new Date();
      this.disabledunitPrice = false;
      this.unitPriceOReason = '';
    }

    OverrideunitPriceExcept() {
      this.disabledunitPrice = true;
      console.log(this.form.unitPrice);
    }

    UndoOverrideunitPrice() {
      this.form.unitPrice.OUserID = null;
      this.form.unitPrice.OBit = null;
      this.form.unitPrice.ODate = null;
      this.form.unitPrice.OReason = null;
      this.unitPriceOReason = '';
      this.disabledinvoiceNo = false;
    }

    OverridetotalLineValueClick() {
      this.form.totalLineValue.OUserID = this.currentUser.userID;
      this.form.totalLineValue.OBit = true;
      this.form.totalLineValue.ODate = new Date();
      this.disabledtotalLineValue = false;
      this.totalLineValueOReason = '';
    }

    OverridetotalLineValueExcept() {
      this.disabledtotalLineValue = true;
      console.log(this.form.totalLineValue);
    }

    UndoOverridetotalLineValue() {
      this.form.totalLineValue.OUserID = null;
      this.form.totalLineValue.OBit = null;
      this.form.totalLineValue.ODate = null;
      this.form.totalLineValue.OReason = null;
      this.totalLineValueOReason = '';
      this.disabledinvoiceNo = false;
    }

    ngOnDestroy(): void {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
}
