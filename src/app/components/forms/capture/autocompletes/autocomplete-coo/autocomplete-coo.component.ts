import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { FormControl } from '@angular/forms';
import { ListCountriesRequest, CountriesListResponse, CountryItem } from 'src/app/models/HttpRequests/Locations';
import { PlaceService } from 'src/app/services/Place.Service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ls-autocomplete-coo',
  templateUrl: './autocomplete-coo.component.html',
  styleUrls: ['./autocomplete-coo.component.scss']
})
export class AutocompleteCooComponent implements OnInit, OnDestroy {
  constructor(private userService: UserService,
              private placeService: PlaceService) { }

  @Input() control: FormControl;
  @Input() appearance = 'fill';

  private currentUser = this.userService.getCurrentUser();
  private listTemp: CountryItem[] = [];

  public list: CountryItem[] = [];
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

      if (this.query.value) {
        this.list = this.list.filter(x => this.matchRuleShort(x.name.toUpperCase(), `*${this.query.value.toUpperCase()}*`));
      }
    });
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
  }

  matchRuleShort(str, rule) {
    // tslint:disable-next-line: no-shadowed-variable
    const escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
  }

  public displayFn(item: CountryItem): string {
    return item ? `${item.name}` : '';
  }

  ngOnDestroy(): void {}
}