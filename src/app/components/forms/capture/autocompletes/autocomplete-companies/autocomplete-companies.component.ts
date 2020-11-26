import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { FormControl, Validators } from '@angular/forms';
import { CountryItem } from 'src/app/models/HttpRequests/Locations';
import { CompaniesListResponse, Company } from 'src/app/models/HttpResponses/CompaniesListResponse';
import { CompanyService } from 'src/app/services/Company.Service';
import { CompanyList } from 'src/app/models/HttpRequests/Company';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ls-autocomplete-companies',
  templateUrl: './autocomplete-companies.component.html',
  styleUrls: ['./autocomplete-companies.component.scss']
})
export class AutocompleteCompaniesComponent implements OnInit, OnDestroy, OnChanges {
constructor(private userService: UserService,
            private companyService: CompanyService,
            private snackbarService: HelpSnackbar) { }

  @Input() control: FormControl;
  @Input() status: number;
  @Input() transstatus: number;
  @Input() appearance = 'fill';
  @Input() helpSlug = 'default';
  @Input() title = 'Companies';

  private currentUser = this.userService.getCurrentUser();
  private listTemp: Company[] = [];
  private isRequired = false;
  public isDisabled = false;

  public list: Company[] = [];
  public query = new FormControl(null);
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
        console.log(value);
        if (value.companyID) {
          this.control.setValue(value.companyID);
          this.query.setErrors(null);
          this.control.setErrors(null);
          this.selected = true;
        } else {
          this.selected = false;
          const query: string = value;
          if (query && query !== null) {
            this.list = this.list.filter(x => this.matchRuleShort(x.name.toUpperCase(), `*${query.toUpperCase()}*`));
          }

          this.control.reset(null);
          this.query.setErrors({ incorrect: true });
          this.control.setErrors({ incorrect: true });
        }
      } else {
        this.selected = false;
      }
    });

    this.checkStatus();
  }

  ngOnChanges() {
    this.isRequired = this.control.validator !== null;
    this.checkStatus();

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
    const model: CompanyList = {
      userID: this.currentUser.userID,
      specificCompanyID: -1,
      rowStart: 1,
      filter: this.isNull(this.query.value),
      rowEnd: 10000,
      orderBy: '',
      orderByDirection: ''
    };

    this.companyService
      .list(model).then(
        (res: CompaniesListResponse) => {
          this.list = res.companies;
          this.listTemp = res.companies;

          if (setDefault) {
            const defaultValue = this.list.find(x => x.companyID === this.control.value);
            this.query.setValue(defaultValue, { emitEvent: false });
          }

          this.checkStatus();
        }
      );
  }

  checkStatus() {
    if (this.status === 5 && this.transstatus == 10) {
      this.isDisabled = true;
      this.query.disable();
      this.query.updateValueAndValidity();
    }
  }

  matchRuleShort(str, rule) {
    // tslint:disable-next-line: no-shadowed-variable
    const escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
  }

  public displayFn(item: CountryItem): string {
    return item ? `${item.name}` : '';
  }

  focusOut(trigger) {
    setTimeout(() => {
    if (this.list.length > 0 && !this.selected && (this.query.value !== null && this.query.value !== '')) {
      this.query.setValue(this.list[0]);
      trigger.closePanel();
    }
  }, 100);
  }

  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
  }

  isNull(value) {
    return value === null ? '' : value;
  }

  ngOnDestroy(): void {}
}
