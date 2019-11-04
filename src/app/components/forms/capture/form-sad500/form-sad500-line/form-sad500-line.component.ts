import { Component, OnInit, EventEmitter, Output, OnChanges, Input, AfterViewInit, ViewChild } from '@angular/core';
import { SAD500LineCreateRequest } from 'src/app/models/HttpRequests/SAD500Line';
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

@Component({
  selector: 'app-form-sad500-line',
  templateUrl: './form-sad500-line.component.html',
  styleUrls: ['./form-sad500-line.component.scss']
})
export class FormSAD500LineComponent implements OnInit, OnChanges, AfterViewInit, OnChanges {


  constructor(private themeService: ThemeService, private unitService: UnitMeasureService, private userService: UserService,
              private validate: ValidateService, private tariffService: TariffService) { }

  currentUser: User;

  currentTheme: string;
  unitOfMeasureList: UnitsOfMeasure[];
  unitOfMeasureListTemp: UnitsOfMeasure[];
  focusLineForm: boolean;

  showTariffHint = false;
  showUnitOfMeasureHint = true;
  tariffs: { amount: number; description: string; duty: number; unit: string }[];
  tariffsTemp: { amount: number; description: string; duty: number; unit: string }[];
  myControl = new FormControl();
  unitOfMeasure = new FormControl();

  selectedTariffVal: string;
  selectedUnitVal: string;
  private unsubscribe$ = new Subject<void>();

  @Input() lineData: SAD500Line;
  @Input() updateSAD500Line: SAD500Line;
  @Input() focusSADLine: boolean;
  @Output() submitSADLine = new EventEmitter<SAD500LineCreateRequest>();
  @Output() updateSADLine = new EventEmitter<SAD500Line>();

  shortcuts: ShortcutInput[] = [];
  @ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;

  form = {
    cpc: '',
    tariffID: -1,
    tariff: '',
    customsValue: 0,
    lineNo: '',
    unitOfMeasureID: -1,
    unitOfMeasure: '',
    productCode: '',
    value: '',
    cpcError: null,
    tariffError: null,
    customsValueError: null,
    lineNoError: null,
    unitOfMeasureError: null,
    productCodeError: null,
    valueError: null,
  };

  isUpdate: boolean;

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(theme => this.currentTheme = theme);
    this.currentUser = this.userService.getCurrentUser();

    this.loadUnits();
    this.loadTarrifs();
  }

  ngAfterViewInit(): void {
    this.shortcuts.push(
        {
            key: 'alt + n',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => this.focusLineForm = !this.focusLineForm
        },
    );

    this.keyboard.select('cmd + f').subscribe(e => console.log(e));
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    if (this.updateSAD500Line !== null && this.updateSAD500Line !== undefined) {
      this.isUpdate = true;

      this.form.cpc = this.updateSAD500Line.cpc;
      this.form.customsValue = this.updateSAD500Line.customsValue;
      this.form.lineNo = this.updateSAD500Line.lineNo;
      this.form.productCode = this.updateSAD500Line.productCode;
      this.form.tariff = this.updateSAD500Line.tariff;
      this.form.unitOfMeasure = this.updateSAD500Line.unitOfMeasure;
      this.form.value = this.updateSAD500Line.value;
      this.form.tariffError = this.updateSAD500Line.tariffError;
      this.form.customsValueError = this.updateSAD500Line.customsValueError;
      this.form.cpcError = this.updateSAD500Line.cpcError;
      this.form.valueError = this.updateSAD500Line.valueError;
      this.form.unitOfMeasureError = this.updateSAD500Line.unitOfMeasureError;
      this.form.lineNoError = this.updateSAD500Line.lineNoError;
      this.form.productCodeError = this.updateSAD500Line.productCodeError;

    } else {
      this.isUpdate = false;
      this.form = {
        cpc: '',
        tariffID: -1,
        tariff: '',
        customsValue: 0,
        lineNo: '',
        unitOfMeasureID: -1,
        unitOfMeasure: '',
        productCode: '',
        value: '',
        cpcError: null,
        tariffError: null,
        customsValueError: null,
        lineNoError: null,
        unitOfMeasureError: null,
        productCodeError: null,
        valueError: null,
      };
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
        rowNum: -1,
        sad500LineID: this.updateSAD500Line.sad500LineID,
        sad500ID: -1,
        cpc: this.form.cpc,
        tariffID: 1,
        tariff: this.form.tariff,
        customsValue: this.form.customsValue,
        lineNo: this.form.lineNo,
        unitOfMeasureID: 1,
        unitOfMeasure: this.form.unitOfMeasure,
        productCode: this.form.productCode,
        value: this.form.value,
      });
    } else {
      this.submitSADLine.emit({
        userID: -1,
        sad500ID: -1,
        cpc: this.form.cpc,
        tariffID: 1,
        tariff: this.form.tariff,
        customsValue: this.form.customsValue,
        lineNo: this.form.lineNo,
        unitOfMeasureID: 1,
        unitOfMeasure: this.form.unitOfMeasure,
        productCode: this.form.productCode,
        value: this.form.value,
      });
    }
  }

  loadTarrifs() {
    this.tariffService.list().then(
      (res: { tariffList: { amount: number; description: string; duty: number; unit: string }[], outcome: Outcome, rowCount: number }) => {
        this.tariffs = res.tariffList;
        this.tariffsTemp = res.tariffList;
      },
      (msg) => {
      }
    );
  }

  selectedTariff(description) {
    this.form.tariff = description;
  }

  selectedUnit(name) {
    this.form.unitOfMeasure = name;
  }

  filterTariff() {
    this.tariffs = this.tariffsTemp;
    this.tariffs = this.tariffs.filter(x => this.matchRuleShort(x.description, `*${this.form.tariff}*`));
  }

  filterUnit() {
    this.unitOfMeasureList = this.unitOfMeasureListTemp;
    this.unitOfMeasureList = this.unitOfMeasureList.filter(x => this.matchRuleShort(x.name, `*${this.form.unitOfMeasure}*`));
  }

  matchRuleShort(str, rule) {
    const escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
