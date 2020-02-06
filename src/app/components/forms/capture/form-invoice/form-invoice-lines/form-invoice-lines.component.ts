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
import { FormControl } from '@angular/forms';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-form-invoice-lines',
  templateUrl: './form-invoice-lines.component.html',
  styleUrls: ['./form-invoice-lines.component.scss']
})
export class FormInvoiceLinesComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {


    constructor(
      private themeService: ThemeService,
      private userService: UserService,
      private captureService: CaptureService,
      private unitService: UnitMeasureService,
      private snackbarService: HelpSnackbar) { }

    currentUser: User;
    currentTheme: string;
    focusLineForm: boolean;
    unitOfMeasureList: UnitsOfMeasure[];
    unitOfMeasureListTemp: UnitsOfMeasure[];
    unitOfMeasure = new FormControl();
    private unsubscribe$ = new Subject<void>();

    @Input() lineData: InvoiceLine;
    @Input() updateSAD500Line: InvoiceLine;
    @Input() focusSADLine: boolean;
    @Input() showLines: boolean;
    @Output() submitLine = new EventEmitter<InvoiceLine>();
    @Output() updateLine = new EventEmitter<InvoiceLine>();

    shortcuts: ShortcutInput[] = [];
    @ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;

    form = {
      prodCode: '',
      prodCodeError: '',
      quantity: 0.0,
      quantityError: null,
      itemValue: 0.0,
      itemValueError: null,
      unitPrice: 0.0,
      totalLineValue: 0.0,
      unitOfMeasureID: -1,
      unitOfMeasure: null,
      unitPriceError: null,
      unitOfMeasureError: null,
      totalLineValueError: null,
    };

    isUpdate: boolean;

    ngOnInit() {
      this.themeService.observeTheme()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(theme => this.currentTheme = theme);

      this.currentUser = this.userService.getCurrentUser();
      this.loadUnits();
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
        this.form.quantity = this.updateSAD500Line.quantity;
        this.form.quantityError = this.updateSAD500Line.quantityError;
        this.form.itemValue = this.updateSAD500Line.itemValue;
        this.form.itemValueError = this.updateSAD500Line.itemValueError;
        this.form.prodCode = this.updateSAD500Line.prodCode;
        this.form.prodCodeError = this.updateSAD500Line.prodCodeError;
        this.form.unitPrice = this.updateSAD500Line.unitPrice;
        this.form.totalLineValue = this.updateSAD500Line.totalLineValue;
        this.form.unitOfMeasure = this.updateSAD500Line.unitOfMeasure;
        this.form.unitOfMeasureID = this.updateSAD500Line.unitOfMeasureID;
        this.form.unitPriceError = this.updateSAD500Line.unitPriceError;
        this.form.totalLineValueError = this.updateSAD500Line.totalLineValueError;
      } else {
        this.isUpdate = false;

        this.form = {
          prodCode: '',
          prodCodeError: null,
          quantity: 0.0,
          quantityError: null,
          itemValue: 0.0,
          itemValueError: null,
          unitPrice: 0.0,
          totalLineValue: 0.0,
          unitOfMeasureID: -1,
          unitOfMeasure: null,
          unitPriceError: null,
          unitOfMeasureError: null,
          totalLineValueError: null,
        };
      }

    }

    submit() {
      if (this.isUpdate) {
        const request: InvoiceLine = {
          prodCode: this.form.prodCode,
          invoiceID: this.updateSAD500Line.invoiceID,
          quantity: this.form.quantity,
          itemValue: this.form.itemValue,
          invoiceLineID: this.updateSAD500Line.invoiceLineID,
          unitPrice: this.form.unitPrice,
          totalLineValue: this.form.totalLineValue,
          unitOfMeasure: this.form.unitOfMeasure,
          unitOfMeasureID: this.form.unitOfMeasureID,
          guid: UUID.UUID(),
        };

        this.updateLine.emit(request);
      } else {

        const request: InvoiceLine = {
          prodCode: this.form.prodCode,
          quantity: this.form.quantity,
          itemValue: this.form.itemValue,
          unitPrice: this.form.unitPrice,
          totalLineValue: this.form.totalLineValue,
          unitOfMeasure: this.form.unitOfMeasure,
          unitOfMeasureID: this.form.unitOfMeasureID,
          guid: UUID.UUID(),
        };
        this.submitLine.emit(request);
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

    filterUnit() {
      this.unitOfMeasureList = this.unitOfMeasureListTemp;
      this.unitOfMeasureList = this.unitOfMeasureList.filter(x => this.matchRuleShort(x.name, `*${this.form.unitOfMeasure}*`));
    }

    matchRuleShort(str, rule) {
      const escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
      return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
    }

    selectedUnit(unit) {
      this.form.unitOfMeasure = unit.name;
      this.form.unitOfMeasureID = unit.unitOfMeasureID;
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
