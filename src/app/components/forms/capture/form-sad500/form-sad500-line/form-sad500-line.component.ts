import { Location } from '@angular/common';
import { ListCountriesResponse } from './../../../../../models/HttpResponses/ListCountriesResponse';
import { ListCountriesRequest, CountriesListResponse, CountryItem } from './../../../../../models/HttpRequests/Locations';
import { PlaceService } from './../../../../../services/Place.Service';
import { DutyAssignDialogComponent } from './duty-assign-dialog/duty-assign-dialog.component';
import { Component, OnInit, EventEmitter, Output, OnChanges, Input, AfterViewInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { SAD500LineCreateRequest, DutyListResponse, Duty } from 'src/app/models/HttpRequests/SAD500Line';
import { ThemeService } from 'src/app/services/theme.Service';
import { UnitMeasureService } from 'src/app/services/Units.Service';
import { UserService } from 'src/app/services/user.Service';
import { User } from 'src/app/models/HttpResponses/User';
import { ListUnitsOfMeasure } from 'src/app/models/HttpResponses/ListUnitsOfMeasure';
import { SAD500Line } from 'src/app/models/HttpResponses/SAD500Line';
import { ShortcutInput, KeyboardShortcutsComponent, AllowIn } from 'ng-keyboard-shortcuts';
import { ValidateService } from 'src/app/services/Validation.Service';
import { TariffService } from 'src/app/services/Tariff.service';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { FormControl } from '@angular/forms';
import { UnitsOfMeasure } from 'src/app/models/HttpResponses/UnitsOfMeasure';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CaptureService } from 'src/app/services/capture.service';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { MatDialog } from '@angular/material';
import { NotificationComponent } from 'src/app/components/notification/notification.component';

@Component({
  selector: 'app-form-sad500-line',
  templateUrl: './form-sad500-line.component.html',
  styleUrls: ['./form-sad500-line.component.scss']
})
export class FormSAD500LineComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  disabledlineNo: boolean;
  lineNoOReason: string;
  disabledsupplyUnit: boolean;
  supplyUnitOReason: string;
  disabledcustomsValue: boolean;
  customsValueOReason: string;
  disabledquantity: boolean;
  quantityOReason: string;


  constructor(private themeService: ThemeService, private unitService: UnitMeasureService, private userService: UserService,
              private validate: ValidateService, private tariffService: TariffService, private captureService: CaptureService,
              private snackbarService: HelpSnackbar, private dialog: MatDialog, private placeService: PlaceService) { }

  currentUser: User;

  currentTheme: string;
  unitOfMeasureList: UnitsOfMeasure[];
  unitOfMeasureListTemp: UnitsOfMeasure[];
  focusLineForm: boolean;

  showTariffHint = false;
  showUnitOfMeasureHint = true;
  tariffs: { id: number, amount: number; description: string; duty: number; unit: string }[];
  tariffsTemp: {  id: number, amount: number; description: string; duty: number; unit: string }[];
  myControl = new FormControl();
  unitOfMeasure = new FormControl();
  selectedTariffVal: string;
  selectedUnitVal: string;
  private unsubscribe$ = new Subject<void>();

  countriesList: CountryItem[] = [];
  countriesListTemp: {rowNum: number, countryID: number, name: string, code: string}[];
  countryID = -1;
  countryQuery = '';

  dutyList: DutyListResponse;
  assignedDuties: Duty[] = [];
  dutiesToBeSaved: Duty[] = [];
  dutyListTemp: Duty[] = [];
  assignedDutiesTemp: Duty[] = [];
  dutiesToBeSavedTemp: Duty[] = [];
  dutiesQuery = '';
  dutieAssignedQuery = '';
  focusDutiesQuery = false;
  focusAssignedQuery = false;

  @ViewChild('dutiesAssignedEl', { static: false })
  dutiesAssignedEl: ElementRef;
  private notify: NotificationComponent;
  @Input() lineData: SAD500Line;
  @Input() updateSAD500Line: SAD500Line;
  @Input() focusSADLine: boolean;
  @Input() showLines: boolean;
  @Output() submitSADLine = new EventEmitter<SAD500LineCreateRequest>();
  @Output() updateSADLine = new EventEmitter<SAD500Line>();

  shortcuts: ShortcutInput[] = [];
  @ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;

  form = {
    tariff: {
      value: null,
      error: null,
      OBit: null,
      OUserID: null,
      ODate: null,
      OReason: null,
    },
    customsValue: {
      value: null,
      error: null,
      OBit: null,
      OUserID: null,
      ODate: null,
      OReason: null,
    },
    lineNo: {
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
    quantity: {
      value: null,
      error: null,
      OBit: null,
      OUserID: null,
      ODate: null,
      OReason: null,
    },
    previousDeclaration: {
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
    cooID: {
      value: null,
      error: null,
      OBit: null,
      OUserID: null,
      ODate: null,
      OReason: null,
    }
  };
  isUpdate: boolean;

  unitOfMeasureQuery = '';
  tarrifQuery = '';

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(theme => this.currentTheme = theme);

    this.currentUser = this.userService.getCurrentUser();

    this.loadUnits();
    this.loadTarrifs();
    this.loadDuties();
    this.loadCountries();
  }

  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
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
        {
          key: 'alt + k',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => this.focusDutiesQuery = !this.focusDutiesQuery
        },
    );
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    console.log('aaa');
    if (this.updateSAD500Line !== null && this.updateSAD500Line !== undefined) {
      console.log('bbb');
      this.isUpdate = true;

      this.form.customsValue.error = this.updateSAD500Line.customsValue;
      this.form.lineNo.value = this.updateSAD500Line.lineNo;
      this.form.tariff.value = this.updateSAD500Line.tariffID;
      this.form.unitOfMeasure.value = this.updateSAD500Line.unitOfMeasureID;
      this.form.tariff.error = this.updateSAD500Line.tariffError;
      this.form.customsValue.error = this.updateSAD500Line.customsValueError ? this.updateSAD500Line.customsValueError : null;
      this.form.unitOfMeasure.error = this.updateSAD500Line.unitOfMeasureError;
      this.form.lineNo.error = this.updateSAD500Line.lineNoError ? this.updateSAD500Line.lineNoError : null;
      this.form.quantity.value = this.updateSAD500Line.quantity;
      this.form.quantity.error = this.updateSAD500Line.quantityError ? this.updateSAD500Line.quantityError : null;
      this.loadDuties();
    } else {
      console.log('ccc');
      this.isUpdate = false;
      this.dutiesToBeSaved = [];
      this.form = {
        tariff: {
          value: null,
          error: null,
          OBit: null,
          OUserID: null,
          ODate: null,
          OReason: null,
        },
        customsValue: {
          value: null,
          error: null,
          OBit: null,
          OUserID: null,
          ODate: null,
          OReason: null,
        },
        lineNo: {
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
        quantity: {
          value: null,
          error: null,
          OBit: null,
          OUserID: null,
          ODate: null,
          OReason: null,
        },
        previousDeclaration: {
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
        cooID: {
          value: null,
          error: null,
          OBit: null,
          OUserID: null,
          ODate: null,
          OReason: null,
        }
      };
      this.updateSAD500Line = null;
      this.loadDuties();
    }

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

  submit() {

      if (this.isUpdate) {
        this.updateSADLine.emit({
          // rowNum: -1,

          userID: this.currentUser.userID,
          sad500LineID: this.updateSAD500Line.sad500LineID,
          sad500ID: -1,
          tariffID: this.form.tariff.value,
          cooID: this.countryID,
          unitOfMeasureID: this.form.unitOfMeasureID.value,
          quantity: this.form.quantity.value,
          customsValue: this.form.customsValue.value,
          lineNo: this.form.lineNo.value,
          previousDeclaration: this.form.previousDeclaration.value,
          supplyUnit: this.form.supplyUnit.value,
          replacedByLineID: -1,
          originalLineID: -1,

          lineNoOBit: this.form.lineNo.OBit,
          lineNoOUserID: this.form.lineNo.OUserID,
          lineNoODate: this.form.lineNo.OUserID,
          lineNoOReason: this.form.lineNo.OUserID,

          customsValueOBit: this.form.customsValue.OBit,
          customsValueOUserID: this.form.customsValue.OUserID,
          customsValueODate: this.form.customsValue.OUserID,
          customsValueOReason: this.form.customsValue.OUserID,

          quantityOBit: this.form.quantity.OBit,
          quantityOUserID: this.form.quantity.OUserID,
          quantityODate: this.form.quantity.OUserID,
          quantityOReason: this.form.quantity.OUserID,

          previousDeclarationOBit: this.form.previousDeclaration.OBit,
          previousDeclarationOUserID: this.form.previousDeclaration.OUserID,
          previousDeclarationODate: this.form.previousDeclaration.OUserID,
          previousDeclarationOReason: this.form.previousDeclaration.OUserID,

          dutyOBit: this.form.duty.OBit,
          dutyOUserID: this.form.duty.OUserID,
          dutyODate: this.form.duty.OUserID,
          dutyOReason: this.form.duty.OUserID,

          vatOBit: this.form.vat.OBit,
          vatOUserID: this.form.vat.OUserID,
          vatODate: this.form.vat.OUserID,
          vatOReason: this.form.vat.OUserID,

          supplyUnitOBit: this.form.supplyUnit.OBit,
          supplyUnitOUserID: this.form.supplyUnit.OUserID,
          supplyUnitODate: this.form.supplyUnit.OUserID,
          supllyUnitOReason: this.form.supplyUnit.OUserID,




        });
      } else {
        const sumbitRequest = {
          userID: this.currentUser.userID,
          // sad500LineID: this.updateSAD500Line ? this.updateSAD500Line.sad500LineID : null,
          sad500ID: -1,
          tariffID: this.form.tariff.value,
          cooID: this.countryID,
          unitOfMeasureID: this.form.unitOfMeasureID.value,
          quantity: this.form.quantity.value,
          customsValue: this.form.customsValue.value,
          lineNo: this.form.lineNo.value,
          previousDeclaration: this.form.previousDeclaration.value,
          supplyUnit: this.form.supplyUnit.value,
          replacedByLineID: -1,
          originalLineID: -1,
          duty: this.form.duty.value,

          lineNoOBit: this.form.lineNo.OBit,
          lineNoOUserID: this.form.lineNo.OUserID,
          lineNoODate: this.form.lineNo.OUserID,
          lineNoOReason: this.form.lineNo.OUserID,

          customsValueOBit: this.form.customsValue.OBit,
          customsValueOUserID: this.form.customsValue.OUserID,
          customsValueODate: this.form.customsValue.OUserID,
          customsValueOReason: this.form.customsValue.OUserID,

          quantityOBit: this.form.quantity.OBit,
          quantityOUserID: this.form.quantity.OUserID,
          quantityODate: this.form.quantity.OUserID,
          quantityOReason: this.form.quantity.OUserID,

          previousDeclarationOBit: this.form.previousDeclaration.OBit,
          previousDeclarationOUserID: this.form.previousDeclaration.OUserID,
          previousDeclarationODate: this.form.previousDeclaration.OUserID,
          previousDeclarationOReason: this.form.previousDeclaration.OUserID,

          dutyOBit: this.form.duty.OBit,
          dutyOUserID: this.form.duty.OUserID,
          dutyODate: this.form.duty.OUserID,
          dutyOReason: this.form.duty.OUserID,

          vatOBit: this.form.vat.OBit,
          vatOUserID: this.form.vat.OUserID,
          vatODate: this.form.vat.OUserID,
          vatOReason: this.form.vat.OUserID,

          supplyUnitOBit: this.form.supplyUnit.OBit,
          supplyUnitOUserID: this.form.supplyUnit.OUserID,
          supplyUnitODate: this.form.supplyUnit.OUserID,
          supllyUnitOReason: this.form.supplyUnit.OUserID,
        };
        console.log('sumbitRequest');
        console.log(sumbitRequest);

        this.submitSADLine.emit(sumbitRequest);

        this.dutiesToBeSaved = [];
        this.loadDuties();
      }

  }

  loadTarrifs() {
    this.tariffService.list().then(
      // tslint:disable-next-line: max-line-length
      (res: { tariffList: {id: number, amount: number; description: string; duty: number; unit: string }[], outcome: Outcome, rowCount: number }) => {
        this.tariffs = res.tariffList;
        this.tariffsTemp = res.tariffList;
      },
      (msg) => {
      }
    );
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
      }
    );
  }
  filterCountries() {
    this.countriesList = this.countriesListTemp;
    this.countriesList = this.countriesList.filter(x => this.matchRuleShort(x.name, `*${this.countryQuery}*`));
  }
  selectedCountry(country: number) {
    this.countryID = country;
  }

  selectedTariff(id: number) {
    this.form.tariff.value = id;
  }

  assignDuty(duty: Duty) {

    this.dutyList.duties = this.dutyList.duties.filter(x => x.dutyTaxTypeID !== duty.dutyTaxTypeID);
    if (this.isUpdate) {
      this.assignedDuties.push(duty);
      this.captureService.sad500LineDutyAdd({
        userID: 3,
        dutyID: duty.dutyTaxTypeID,
        sad500LineID: this.updateSAD500Line.sad500LineID,
        value: duty.duty
      }).then(
        (res: Outcome) => {
          if (res.outcome === 'SUCCESS') {

          } else {
            // Did not assign
            // Revert changes
            this.dutyList.duties.push(duty);
            this.assignedDuties = this.assignedDuties.filter(x => x.dutyTaxTypeID !== duty.dutyTaxTypeID);
          }
        },
        (msg) => {
          // Did not assign
          // Revert changes
          this.dutyList.duties.push(duty);
          this.assignedDuties = this.assignedDuties.filter(x => x.dutyTaxTypeID !== duty.dutyTaxTypeID);
        }
      );
    } else {
      this.dutiesToBeSaved.push(duty);
    }
  }

  revokeDuty(duty: Duty) {
    this.dutyList.duties.push(duty);

    if (this.isUpdate) {
      this.assignedDuties = this.assignedDuties.filter(x => x.dutyTaxTypeID !== duty.dutyTaxTypeID);

      this.captureService.sad500LineDutyRemove({
        userID: 3,
        dutyID: duty.dutyTaxTypeID,
        sad500LineID: this.updateSAD500Line.sad500LineID
      }).then(
        (res: Outcome) => {
          if (res.outcome === 'SUCCESS') {

          } else {
            // Did not assign
            // Revert changes
            this.assignedDuties.push(duty);
            this.dutyList.duties = this.dutyList.duties.filter(x => x.dutyTaxTypeID !== duty.dutyTaxTypeID);
          }
        },
        (msg) => {
          // Did not assign
          // Revert changes
          this.assignedDuties.push(duty);
          this.dutyList.duties = this.dutyList.duties.filter(x => x.dutyTaxTypeID !== duty.dutyTaxTypeID);
        }
      );
    } else {
      this.dutiesToBeSaved = this.dutiesToBeSaved.filter(x => x.dutyTaxTypeID !== duty.dutyTaxTypeID);
    }
  }

  selectedUnit(id: number) {
    this.form.unitOfMeasureID.value = id;
  }

  filterTariff() {
    this.tariffs = this.tariffsTemp;
    this.tariffs = this.tariffs.filter(x => this.matchRuleShort(x.description, `*${this.tarrifQuery}*`));
  }

  filterUnit() {
    this.unitOfMeasureList = this.unitOfMeasureListTemp;
    this.unitOfMeasureList = this.unitOfMeasureList.filter(x => this.matchRuleShort(x.name, `*${this.unitOfMeasureQuery}*`));
  }

  filterDuties() {
    this.dutyList.duties = this.dutyListTemp;
    this.dutyList.duties = this.dutyList.duties.filter(x => this.matchRuleShort(x.name, `*${this.dutiesQuery}*`));
  }

  filterAssignedDuties() {
    this.assignedDuties = this.assignedDutiesTemp;
    this.assignedDuties = this.assignedDuties.filter(x => this.matchRuleShort(x.name, `*${this.dutieAssignedQuery}*`));

    this.dutiesToBeSaved = this.dutyListTemp;
    this.dutiesToBeSaved = this.dutiesToBeSaved.filter(x => this.matchRuleShort(x.name, `*${this.dutieAssignedQuery}*`));
  }

  matchRuleShort(str, rule) {
    // tslint:disable-next-line: no-shadowed-variable
    const escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
  }
  assignDutyDialog(item: Duty) {
    const dutyAssignDialog = this.dialog.open(DutyAssignDialogComponent, {
      data: item
    });
    dutyAssignDialog.afterClosed().subscribe((result: Duty) => {
      if (result !== undefined) {
        item.duty = result.duty;
        this.assignDuty(item);
      }
    });
  }
  loadDuties() {
    this.captureService.dutyList({
      dutyTaxTypeID: -1,
      filter: '',
      rowStart: 1,
      rowEnd: 100,
      orderBy: 'ASC',
      orderDirection: 'Name'
    }).then(
      (res: DutyListResponse) => {
        this.dutyList = res;
        this.dutyListTemp = res.duties;

        if (this.isUpdate) {
          this.loadAssignedDuties();
        }
      },
      (msg) => {}
    );
  }

  loadAssignedDuties() {
    if (this.updateSAD500Line !== null) {
      this.captureService.sad500LineDutyList({
        userID: 3,
        dutyID: -1,
        sad500LineID: this.updateSAD500Line.sad500LineID,
        filter: '',
        rowStart: 1,
        rowEnd: 100,
        orderBy: 'ASC',
        orderDirection: 'Name',
      }).then(
        (res: DutyListResponse) => {

          this.assignedDuties = res.duties;
          this.assignedDutiesTemp = res.duties;
          this.assignedDuties.forEach(item => {
            this.dutyList.duties = this.dutyList.duties.filter(x => x.dutyTaxTypeID !== item.dutyTaxTypeID);
          });
        },
        (msg) => {}
      );
    }
  }

  OverridelineNoClick() {
    this.form.lineNo.OUserID = this.currentUser.userID;
    this.form.lineNo.OBit = true;
    this.form.lineNo.ODate = new Date();
    this.disabledlineNo = false;
    this.lineNoOReason = '';
  }

  OverridelineNoExcept() {
    // this.form.importersCode.OReason = reason;
    this.disabledlineNo = true;
    console.log(this.form.lineNo);
  }

  UndoOverridelineNo() {
    this.form.lineNo.OUserID = null;
    this.form.lineNo.OBit = null;
    this.form.lineNo.ODate = null;
    this.form.lineNo.OReason = null;
    this.lineNoOReason = '';
    this.disabledlineNo = false;
  }

  OverridesupplyUnitClick() {
    this.form.supplyUnit.OUserID = this.currentUser.userID;
    this.form.supplyUnit.OBit = true;
    this.form.supplyUnit.ODate = new Date();
    this.disabledsupplyUnit = false;
    this.supplyUnitOReason = '';
  }

  OverridesupplyUnitExcept() {
    // this.form.importersCode.OReason = reason;
    this.disabledsupplyUnit = true;
    console.log(this.form.supplyUnit);
  }

  UndoOverridesupplyUnit() {
    this.form.supplyUnit.OUserID = null;
    this.form.supplyUnit.OBit = null;
    this.form.supplyUnit.ODate = null;
    this.form.supplyUnit.OReason = null;
    this.supplyUnitOReason = '';
    this.disabledsupplyUnit = false;
  }

  OverridecustomsValueClick() {
    this.form.customsValue.OUserID = this.currentUser.userID;
    this.form.customsValue.OBit = true;
    this.form.customsValue.ODate = new Date();
    this.disabledcustomsValue = false;
    this.customsValueOReason = '';
  }

  OverridecustomsValueExcept() {
    // this.form.importersCode.OReason = reason;
    this.disabledcustomsValue = true;
    console.log(this.form.customsValue);
  }

  UndoOverridecustomsValue() {
    this.form.customsValue.OUserID = null;
    this.form.customsValue.OBit = null;
    this.form.customsValue.ODate = null;
    this.form.customsValue.OReason = null;
    this.customsValueOReason = '';
    this.disabledcustomsValue = false;
  }

  OverridequantityClick() {
    this.form.quantity.OUserID = this.currentUser.userID;
    this.form.quantity.OBit = true;
    this.form.quantity.ODate = new Date();
    this.disabledquantity = false;
    this.quantityOReason = '';
  }

  OverridequantityExcept() {
    // this.form.importersCode.OReason = reason;
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
