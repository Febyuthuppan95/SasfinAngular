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

@Component({
  selector: 'app-form-sad500-line',
  templateUrl: './form-sad500-line.component.html',
  styleUrls: ['./form-sad500-line.component.scss']
})
export class FormSAD500LineComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {


  constructor(private themeService: ThemeService, private unitService: UnitMeasureService, private userService: UserService,
              private validate: ValidateService, private tariffService: TariffService, private captureService: CaptureService,
              private snackbarService: HelpSnackbar) { }

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

  @Input() lineData: SAD500Line;
  @Input() updateSAD500Line: SAD500Line;
  @Input() focusSADLine: boolean;
  @Input() showLines: boolean;
  @Output() submitSADLine = new EventEmitter<SAD500LineCreateRequest>();
  @Output() updateSADLine = new EventEmitter<SAD500Line>();

  shortcuts: ShortcutInput[] = [];
  @ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;

  form = {
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
    this.loadDuties();

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
    if (this.updateSAD500Line !== null && this.updateSAD500Line !== undefined) {
      this.isUpdate = true;

      this.form.customsValue = this.updateSAD500Line.customsValue;
      this.form.lineNo = this.updateSAD500Line.lineNo;
      this.form.productCode = this.updateSAD500Line.productCode;
      this.form.tariff = this.updateSAD500Line.tariff;
      this.form.unitOfMeasure = this.updateSAD500Line.unitOfMeasure;
      this.form.value = this.updateSAD500Line.value;
      this.form.tariffError = this.updateSAD500Line.tariffError;
      this.form.customsValueError = this.updateSAD500Line.customsValueError;
      this.form.valueError = this.updateSAD500Line.valueError;
      this.form.unitOfMeasureError = this.updateSAD500Line.unitOfMeasureError;
      this.form.lineNoError = this.updateSAD500Line.lineNoError;
      this.form.productCodeError = this.updateSAD500Line.productCodeError;

      this.loadDuties();
    } else {
      this.isUpdate = false;
      this.dutiesToBeSaved = [];
      this.form = {
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
        rowNum: -1,
        sad500LineID: this.updateSAD500Line.sad500LineID,
        sad500ID: -1,
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
        tariffID: 1,
        tariff: this.form.tariff,
        customsValue: this.form.customsValue,
        lineNo: this.form.lineNo,
        unitOfMeasureID: 1,
        unitOfMeasure: this.form.unitOfMeasure,
        productCode: this.form.productCode,
        value: this.form.value,
        duties: this.dutiesToBeSaved
      });

      this.dutiesToBeSaved = [];
      this.loadDuties();
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

  assignDuty(duty: Duty) {
    this.dutyList.duties = this.dutyList.duties.filter(x => x.dutyTaxTypeID !== duty.dutyTaxTypeID);
    if (this.isUpdate) {
      this.assignedDuties.push(duty);

      this.captureService.sad500LineDutyAdd({
        userID: 3,
        dutyID: duty.dutyTaxTypeID,
        sad500LineID: this.updateSAD500Line.sad500LineID
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
    const escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
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
          console.log(res);

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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
