import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { FormControl } from '@angular/forms';
import { IncoTerm, IncoTermTypesReponse } from '../../form-invoice/form-invoice.component';
import { CaptureService } from 'src/app/services/capture.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ls-autocomplete-inco',
  templateUrl: './autocomplete-inco.component.html',
  styleUrls: ['./autocomplete-inco.component.scss']
})
export class AutocompleteIncoComponent implements OnInit, OnDestroy {
  constructor(private userService: UserService,
              private captureService: CaptureService) { }

  @Input() control: FormControl;
  @Input() appearance = 'fill';

  private currentUser = this.userService.getCurrentUser();
  private listTemp: IncoTerm[] = [];

  public list: IncoTerm[] = [];
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
        this.list = this.list.filter(x => this.matchRuleShort(x.name.toUpperCase(), `*${query.toUpperCase()}*`));
      }
    });
  }

  load(setDefault?: boolean) {

    const model = {
      userID: this.currentUser.userID
    };
    this.captureService.incoTermTypeList(model).then(
      (res: IncoTermTypesReponse) => {
        if (res.termTypes.length > 0) {
          this.list = res.termTypes;
          this.listTemp = res.termTypes;

          if (setDefault) {
            const defaultValue = this.list.find(x => x.incoTermTypeID === this.control.value);
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

  public displayFn(item: IncoTerm): string {
    return item ? `${item.name}` : '';
  }

  ngOnDestroy(): void {}
}
