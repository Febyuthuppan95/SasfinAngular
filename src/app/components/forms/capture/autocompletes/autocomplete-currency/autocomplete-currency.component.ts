import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { FormControl } from '@angular/forms';
import { ListCurrencies } from 'src/app/models/HttpResponses/ListCurrencies';
import { CurrenciesService } from 'src/app/services/Currencies.Service';
import { Currency } from 'src/app/models/HttpResponses/Currency';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ls-autocomplete-currency',
  templateUrl: './autocomplete-currency.component.html',
  styleUrls: ['./autocomplete-currency.component.scss']
})
export class AutocompleteCurrencyComponent implements OnInit, OnDestroy {
  constructor(private userService: UserService,
              private currencyService: CurrenciesService) { }

  @Input() control: FormControl;
  @Input() appearance = 'fill';

  private currentUser = this.userService.getCurrentUser();
  private listTemp: Currency[] = [];

  public list: Currency[] = [];
  public query = new FormControl();
  public valueKeeper = new FormControl();

  ngOnInit() {
    if (!this.control) {
      this.control = new FormControl();
    }

    this.control.valueChanges.subscribe((val) => {
      if (val === null) {
        this.query.reset(null);
        this.load(true);
      } else {
        this.load(true);
      }
    });

    this.load(true);

    this.query.valueChanges.subscribe((value) => {
      this.list = this.listTemp;
      const query: string = value;

      if (query && query !== null) {
        this.list = this.list.filter(x => this.matchRuleShort(x.name.toUpperCase(), `*${this.query.value.toUpperCase()}*`));
      }
    });
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
    return item ? `${item.name}` : '';
  }

  ngOnDestroy(): void {}
}
