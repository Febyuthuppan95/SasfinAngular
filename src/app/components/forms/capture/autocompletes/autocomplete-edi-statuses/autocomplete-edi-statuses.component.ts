import { Component, OnInit, Input, OnChanges, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { CaptureService } from 'src/app/services/capture.service';
import { FormControl, Validators } from '@angular/forms';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { Subject } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ls-autocomplete-edi-statuses',
  templateUrl: './autocomplete-edi-statuses.component.html',
  styleUrls: ['./autocomplete-edi-statuses.component.scss']
})
export class AutocompleteEdiStatusesComponent implements OnInit, OnChanges {

constructor(private userService: UserService,
            private captureService: CaptureService,
            private snackbarService: HelpSnackbar) { }

  @Input() control: FormControl;
  @Input() status: number;
  @Input() transstatus: number;
  @Input() appearance = 'fill';
  @Input() helpSlug = 'default';

  @Input() hasOverride = false;
  @Input() tagOverride = '';
  @Input() titleOverride = '';
  @Input() reasonOverride = '';
  @Input() errorOverride = '';
  @Output() undoOverride = new Subject<string>();
  @Output() override = new Subject<any>();

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

    if (this.control.value !== null) {
      this.selected = true;
    }

    this.load(true);

    this.query.valueChanges.subscribe((value) => {
      this.list = this.listTemp;

      if (value) {
        if (value.EDIStatusID) {
          this.selected = true;
          this.control.setValue(value.EDIStatusID);
          this.query.setErrors(null);
        } else {
          this.selected = false;
          const query: string = value;
          if (query && query !== null) {
            this.list = this.list.filter(x => this.matchRuleShort(x.Name.toUpperCase(), `*${query.toUpperCase()}*`));
          }

          this.control.reset(null);
          this.query.setErrors({ optionNotSelected: true });
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
    return item ? `${item.Name}` : '';
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
}
