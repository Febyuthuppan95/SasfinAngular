import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { FormControl, Validators } from '@angular/forms';
import { CaptureService } from 'src/app/services/capture.service';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ls-autocomplete-inco',
  templateUrl: './autocomplete-inco.component.html',
  styleUrls: ['./autocomplete-inco.component.scss']
})
export class AutocompleteIncoComponent implements OnInit, OnDestroy, OnChanges {
  constructor(private userService: UserService,
              private captureService: CaptureService,
              private snackbarService: HelpSnackbar) { }

  @Input() control: FormControl;
  @Input() status: number;
  @Input() transstatus: number;
  @Input() appearance = 'fill';
  @Input() helpSlug = 'default';
  @Input() previousINCO = '';

  private currentUser = this.userService.getCurrentUser();
  private listTemp: any[] = [];
  private isRequired = false;

  public list: any[] = [];
  public query = new FormControl();
  public valueKeeper = new FormControl();
  public selected = false;

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

    this.query.updateValueAndValidity();

    if (this.control.value !== null) {
      this.selected = true;
    }

    this.load(true);

    this.query.valueChanges.subscribe((value) => {
      this.list = this.listTemp;

      if (value) {
        if (value.incoTermTypeID) {
          this.control.setValue(value.incoTermTypeID);
          this.query.setErrors(null);
          if (this.previousINCO != '') {
            console.log(this.control)
            if (this.control.hasError('noMatch')) {
              this.query.setErrors({noMatch: true});
            }
            else {
              this.query.setErrors(null);
            }
            console.log(this.query);
          } else {
            this.control.setErrors(null);
          }
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

    const model = {
      userID: this.currentUser.userID
    };
    this.captureService.incoTermTypeList(model).then(
      (res: any) => {
        if (res.termTypes.length > 0) {
          this.list = res.termTypes;
          this.listTemp = res.termTypes;

          if (setDefault) {
            const defaultValue = this.list.find(x => x.incoTermTypeID === this.control.value);
            this.query.setValue(defaultValue, { emitEvent: false });
          }
        }
      });

    if (this.status === 5 && this.transstatus == 10) {
        this.query.disable();
      }
  }

  matchRuleShort(str, rule) {
    // tslint:disable-next-line: no-shadowed-variable
    const escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
  }

  public displayFn(item: any): string {
    return item ? `${item.name}` : '';
  }

  focusOut(trigger) {
    if (this.list.length > 0 && !this.selected && (this.query.value !== null && this.query.value !== '' && this.query.value !== undefined)) {
      this.query.setValue(this.list[0]);
    }
  }
  clear(){
    this.query.setValue(null, {emitEvent: false});
    if (!this.isRequired){
      this.query.setErrors(null);
      this.control.setErrors(null);
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
