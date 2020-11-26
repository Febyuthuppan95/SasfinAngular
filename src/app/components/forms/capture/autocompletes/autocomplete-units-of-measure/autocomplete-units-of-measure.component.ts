import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { FormControl, Validators } from '@angular/forms';
import { ListUnitsOfMeasure } from 'src/app/models/HttpResponses/ListUnitsOfMeasure';
import { UnitMeasureService } from 'src/app/services/Units.Service';
import { UnitsOfMeasure } from 'src/app/models/HttpResponses/UnitsOfMeasure';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ls-autocomplete-units-of-measure',
  templateUrl: './autocomplete-units-of-measure.component.html',
  styleUrls: ['./autocomplete-units-of-measure.component.scss']
})
export class AutocompleteUnitsOfMeasureComponent implements OnInit, OnChanges {
constructor(private userService: UserService,
            private unitService: UnitMeasureService,
            private snackbarService: HelpSnackbar) { }

  @Input() control: FormControl;
  @Input() status: number;
  @Input() appearance = 'fill';
  @Input() helpSlug = 'default';

  private currentUser = this.userService.getCurrentUser();
  private listTemp: UnitsOfMeasure[] = [];
  private isRequired = false;

  public list: UnitsOfMeasure[] = [];
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
        if (value.unitOfMeasureID) {
          this.control.setValue(value.unitOfMeasureID);
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
  }

  ngOnChanges() {
    // console.log(this.control.value);

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
    this.unitService
    .list({
      userID: this.currentUser.userID,
      specificUnitOfMeasureID: -1,
      rowStart: 1,
      rowEnd: 1000,
      filter: '',
      orderBy: '',
      orderByDirection: '',
    })
    .then(
      (res: ListUnitsOfMeasure) => {
        if (res.outcome.outcome === 'SUCCESS') {
          this.list = res.unitOfMeasureList;
          this.listTemp = res.unitOfMeasureList;

          if (setDefault) {
            const defaultValue = this.list.find(x => x.unitOfMeasureID === this.control.value);
            this.query.setValue(defaultValue, { emitEvent: false });
          }
        }
      });

    if (this.status === 10) {
        this.query.disable();
    }
  }

  matchRuleShort(str, rule) {
    // tslint:disable-next-line: no-shadowed-variable
    const escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
  }

  public displayFn(item: UnitsOfMeasure): string {
    return item ? `${item.name}, ${item.description}` : '';
  }

  focusOut(trigger) {
    if (this.list.length > 0 && !this.selected && (this.query.value !== null && this.query.value !== '')) {
      this.query.setValue(this.list[0]);

      trigger.closePanel();
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
