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

@Component({
  selector: 'app-form-invoice-lines',
  templateUrl: './form-invoice-lines.component.html',
  styleUrls: ['./form-invoice-lines.component.scss']
})
export class FormInvoiceLinesComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {


    constructor(
      private themeService: ThemeService,
      private userService: UserService,
      private captureService: CaptureService) { }

    currentUser: User;
    currentTheme: string;
    focusLineForm: boolean;
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
      } else {
        this.isUpdate = false;

        this.form = {
          prodCode: '',
          prodCodeError: null,
          quantity: 0.0,
          quantityError: null,
          itemValue: 0.0,
          itemValueError: null,
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
        };

        this.updateLine.emit(request);
      } else {

        const request: InvoiceLine = {
          prodCode: this.form.prodCode,
          quantity: this.form.quantity,
          itemValue: this.form.itemValue,
        };
        this.submitLine.emit(request);
      }
    }

    ngOnDestroy(): void {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
}
