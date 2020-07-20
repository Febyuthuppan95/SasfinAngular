import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { ListReadResponse } from '../../form-invoice/form-invoice-lines/form-invoice-lines.component';
import { FormControl, Validators } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ls-autocomplete-cpc',
  templateUrl: './autocomplete-cpc.component.html',
  styleUrls: ['./autocomplete-cpc.component.scss']
})
export class AutocompleteCPCComponent implements OnInit, OnDestroy, OnChanges {
  constructor(private userService: UserService,
              private apiService: ApiService) { }

  @Input() control: FormControl;
  @Input() appearance = 'fill';

  private currentUser = this.userService.getCurrentUser();
  private cpcListTemp: any [] = [];
  private isRequired = false;

  public cpcList: any [] = [];
  public query = new FormControl();
  public valueKeeper = new FormControl();

  ngOnInit() {
    if (!this.control) {
      this.control = new FormControl();
    }

    this.isRequired = this.control.validator !== null;

    this.loadCPC(true);

    this.query.valueChanges.subscribe((value) => {
      this.cpcList = this.cpcListTemp;

      if (value) {
        if (value.CPCID) {
          this.control.setValue(value.CPCID);
          this.query.setErrors(null);
        } else {
          const query: string = value;
          if (query && query !== null) {
            // console.log(query);
            this.cpcList = this.cpcList.filter(x => this.matchRuleShort(x.CPC.toUpperCase(), `*${query.toUpperCase()}*`));
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
      this.loadCPC(true);
    } else {
      this.loadCPC(true);
    }
  }

  loadCPC(setDefault?: boolean) {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        rowStart: 1,
        rowEnd: 300
      },
      requestProcedure: 'CPCList'
    };
    this.apiService.post(`${environment.ApiEndpoint}/capture/read/list`, model).then(
      (res: ListReadResponse) => {
        if (res.rowCount > 0 )  {
          this.cpcList = res.data;
          this.cpcListTemp = res.data;
          if (setDefault) {
            const defaultValue = this.cpcList.find(x => x.CPCID === this.control.value);
            this.query.setValue(defaultValue, { emitEvent: false });
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
    return item ? `${item.CPC}` : '';
  }

  ngOnDestroy(): void {}
}
