import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { CaptureService } from 'src/app/services/capture.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ls-autocomplete-edi-statuses',
  templateUrl: './autocomplete-edi-statuses.component.html',
  styleUrls: ['./autocomplete-edi-statuses.component.scss']
})
export class AutocompleteEdiStatusesComponent implements OnInit, OnChanges {

constructor(private userService: UserService,
            private captureService: CaptureService) { }

  @Input() control: FormControl;
  @Input() appearance = 'fill';

  private currentUser = this.userService.getCurrentUser();
  private listTemp: any[] = [];
  private isRequired = false;

  public list: any[] = [];
  public query = new FormControl();
  public valueKeeper = new FormControl();

  ngOnInit() {
    if (!this.control) {
      this.control = new FormControl();
    }

    this.isRequired = this.control.validator !== null;

    this.load(true);

    this.query.valueChanges.subscribe((value) => {
      console.log(value);
      this.list = this.listTemp;
  
      if (value) {
        if (value.EDIStatusID) {
          this.control.setValue(value.EDIStatusID);
          this.query.setErrors(null);
        } else {
          const query: string = value;
          if (query && query !== null) {
            this.list = this.list.filter(x => this.matchRuleShort(x.Name.toUpperCase(), `*${query.toUpperCase()}*`));
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

    this.captureService.ediStatusList({ pageIndex: 0, pageSize: 100 }).then(
      // tslint:disable-next-line: max-line-length
      (res: any) => {
        // console.log(res);
        this.list = res.data;
        this.listTemp = res.data;

        if (setDefault) {
          const defaultValue = this.list.find(x => x.EDIStatusID === this.control.value);
          this.query.setValue(defaultValue, { emitEvent: false });
        }
      });
  }

  matchRuleShort(str, rule) {
    // tslint:disable-next-line: no-shadowed-variable
    const escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
  }

  public displayFn(item: any): string {
    return item ? `${item.Name}` : '';
  }

  ngOnDestroy(): void {}
}
