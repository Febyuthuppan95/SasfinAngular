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

@Component({
  selector: 'app-form-custom-worksheet-lines',
  templateUrl: './form-custom-worksheet-lines.component.html',
  styleUrls: ['./form-custom-worksheet-lines.component.scss']
})
export class FormCustomWorksheetLinesComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {


  constructor(private themeService: ThemeService, private unitService: UnitMeasureService, private userService: UserService,
              private validate: ValidateService, private tariffService: TariffService, private captureService: CaptureService) { }

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
    commonFactorError: null
  };

  isUpdate: boolean;

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(theme => this.currentTheme = theme);

    this.currentUser = this.userService.getCurrentUser();
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
    if (this.updateLine !== null && this.updateLine !== undefined) {
      this.isUpdate = true;
      this.form.coo = this.updateLine.coo;
      this.form.tariffHeading = this.updateLine.tariffHeading;
      this.form.custVal = this.updateLine.custVal;
      this.form.hsQuantity = this.updateLine.hsQuantity;
      this.form.foreignInv = this.updateLine.foreignInv;
      this.form.duty = this.updateLine.duty;
      this.form.cooError = this.updateLine.cooError;
      this.form.tariffHeadingError = this.updateLine.tariffHeadingError;
      this.form.custValError = this.updateLine.custValError;
      this.form.hsQuantityError = this.updateLine.hsQuantityError;
      this.form.foreignInvError = this.updateLine.foreignInvError;
      this.form.dutyError = this.updateLine.dutyError;
    } else {
      this.isUpdate = false;
      this.dutiesToBeSaved = [];
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
        commonFactorError: null
      };
    }
  }

  submit() {
    if (this.isUpdate) {
      const model: CustomWorksheetLineReq = {
        customWorksheetLineID: this.lineData.customWorksheetLineID,
        coo: this.form.coo,
        tariffHeading: this.form.tariffHeading,
        hsQuantity: this.form.hsQuantity,
        foreignInv: this.form.foreignInv,
        custVal: this.form.custVal,
        duty: this.form.duty,
        commonFactor: this.form.commonFactor
      };

      this.updateSADLine.emit(model);
    } else {
      const model: CustomWorksheetLineReq = {
        coo: this.form.coo,
        tariffHeading: this.form.tariffHeading,
        hsQuantity: this.form.hsQuantity,
        foreignInv: this.form.foreignInv,
        custVal: this.form.custVal,
        duty: this.form.duty,
        commonFactor: this.form.commonFactor
      };

      this.submitSADLine.emit(model);
    }
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
