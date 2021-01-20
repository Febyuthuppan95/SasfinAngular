import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { FormControl, Validators } from '@angular/forms';
import { ListCountriesRequest, CountriesListResponse, CountryItem } from 'src/app/models/HttpRequests/Locations';
import { PlaceService } from 'src/app/services/Place.Service';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ls-autocomplete-coo',
  templateUrl: './autocomplete-coo.component.html',
  styleUrls: ['./autocomplete-coo.component.scss']
})
export class AutocompleteCooComponent implements OnInit, OnDestroy, OnChanges {
  constructor(private userService: UserService,
              private placeService: PlaceService,
              private snackbar: MatSnackBar,
              private snackbarService: HelpSnackbar) { }

  @Input() control: FormControl;
  @Input() status: number;
  @Input() transstatus: number;
  @Input() appearance = 'fill';
  @Input() helpSlug = 'default';

  private currentUser = this.userService.getCurrentUser();
  private listTemp: CountryItem[] = [];
  private isRequired = false;

  public list: CountryItem[] = [];
  public query = new FormControl();
  public valueKeeper = new FormControl();
  public selected = false;

  ngOnInit() {
    if (!this.control) {
      this.control = new FormControl();
    }

    this.isRequired = this.control.validator !== null;

    if (this.control.value !== null) {
      this.selected = true;
    }

    this.load(true);

    this.query.valueChanges.subscribe((value) => {
      this.list = this.listTemp;

      if (value) {
        if (value.countryID) {
          this.control.setValue(value.countryID);
          this.query.setErrors(null);
          this.control.setErrors(null);
          this.selected = true;
        } else {
          this.selected = false;
          const query: string = value;
          if (query && query !== null) {
            this.list = this.list.filter(x => this.matchRuleShort(x.name.toUpperCase(), `*${query.toUpperCase()}*`) ||
            this.matchRuleShort(x.code.toUpperCase(), `*${query.toUpperCase()}*`));
          }

          this.control.reset(null);
          this.query.setErrors({ incorrect: true });
          this.control.setErrors({ incorrect: true });
        }
      } else {
        this.selected = false;
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
    const request: ListCountriesRequest = {
      userID: this.currentUser.userID,
      specificCountryID: -1,
      rowStart: 1,
      rowEnd: 500,
      orderBy: '',
      orderByDirection: '',
      filter: '',
    };
    this.placeService
      .getCountriesCall(request)
      .then((res: CountriesListResponse) => {
        this.list = res.countriesList;
        this.listTemp = res.countriesList;

        if (setDefault) {
          const defaultValue = this.list.find(x => x.countryID === this.control.value);
          this.query.setValue(defaultValue, { emitEvent: false });
        }
      });

    if (this.status === 5 && this.transstatus == 10) {
        this.query.disable();
    }
  }

  async createOption() {
    const data = this.query.value.split(',');

    if (data.length === 2) {
      await this.placeService.addCountry({ userID:  this.currentUser.userID, name: data[1].trim(), code: data[0].trim() }).then(
        async (res: Outcome) => {
          if (res.outcome === 'SUCCESS') {
            await this.load(true);
          }

          this.snackbar.open(res.outcomeMessage, '' , { duration: 3000 });
        }
      );
    } else {
      this.snackbar.open('Required Format: "Code, Country Name"', '' , { duration: 3000 });
    }
  }

  matchRuleShort(str, rule) {
    // tslint:disable-next-line: no-shadowed-variable
    const escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
  }

  public displayFn(item: CountryItem): string {
    return item ? `${item.code}, ${item.name}` : '';
  }

  focusOut(trigger) {
    if ( trigger._previousValue === '') {
      if (this.list.length > 0 && !this.selected && (this.query.value !== null && this.query.value !== '')) {
        this.query.setValue(this.list[0]);
        trigger.closePanel();
      }
    }
  }
  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
  }
  ngOnDestroy(): void {}
}
