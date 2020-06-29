import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { FormControl, Validators } from '@angular/forms';
import { ListCurrencies } from 'src/app/models/HttpResponses/ListCurrencies';
import { CurrenciesService } from 'src/app/services/Currencies.Service';
import { Currency } from 'src/app/models/HttpResponses/Currency';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ls-autocomplete-currency',
  templateUrl: './autocomplete-currency.component.html',
  styleUrls: ['./autocomplete-currency.component.scss']
})
export class AutocompleteCurrencyComponent implements OnInit, OnDestroy, OnChanges {
  constructor(private userService: UserService,
              private currencyService: CurrenciesService) { }

  @Input() control: FormControl;
  @Input() appearance = 'fill';

  private currentUser = this.userService.getCurrentUser();
  private listTemp: Currency[] = [];
  private isRequired = false;

  public list: Currency[] = [];
  public query = new FormControl();
  public valueKeeper = new FormControl();

  ngOnInit() {
    if (!this.control) {
      this.control = new FormControl();
    }

    this.isRequired = this.control.validator !== null;

    if (this.isRequired) {
      this.query.setValidators([Validators.required]);
    } else {
      this.query.setValidators(null);
    }

    this.load(true);

    this.query.valueChanges.subscribe((value) => {
      this.list = this.listTemp;

      if (value) {
        if (value.code) {
          this.control.setValue(value.currencyID);
          this.query.setErrors(null);
        } else {
          const query: string = value;
          if (query && query !== null) {
            console.log(query);
            this.list = this.list.filter(x => this.matchRuleShort(x.code.toUpperCase(), `*${query.toUpperCase()}*`));
          }

          this.control.reset(null);
          this.query.setErrors({ incorrect: true });
        }
      }
    });
  }

  ngOnChanges() {
    this.isRequired = this.control.validator !== null;

    if (this.isRequired) {
      this.query.setValidators([Validators.required]);
    } else {
      this.query.setValidators(null);
    }

    if (this.control.value === null) {
      this.query.reset(null);
      this.load(true);
    } else {
      this.load(true);
    }
  }

  load(setDefault?: boolean) {
    this.currencyService.list({userID: this.currentUser.userID, specificCurrencyID: -1, filter: '', rowStart: 1, rowEnd: 1000}).then(
      (res: ListCurrencies) => {
        if (res.currenciesList.length > 0) {
          this.list = res.currenciesList;
          this.listTemp = res.currenciesList;

          if (setDefault) {
            const defaultValue = this.listTemp.find(x => x.currencyID == this.control.value);

            if (defaultValue) {
              this.query.setValue(defaultValue, { emitEvent: false });
            }
          }
        }
      });
  }

  matchRuleShort(str, rule) {
    // tslint:disable-next-line: no-shadowed-variable
    const escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
  }

  public displayFn(item: any): string {
    return item ? `${item.code}, ${item.name}` : '';
  }

  ngOnDestroy(): void {}
}
