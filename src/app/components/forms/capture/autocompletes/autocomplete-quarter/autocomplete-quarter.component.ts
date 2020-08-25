import { Component, OnInit, OnDestroy, OnChanges, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ListReadResponse } from '../../form-invoice/form-invoice-lines/form-invoice-lines.component';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ls-autocomplete-quarter',
  templateUrl: './autocomplete-quarter.component.html',
  styleUrls: ['./autocomplete-quarter.component.scss']
})
export class AutocompleteQuarterComponent implements OnInit, OnDestroy, OnChanges {
  constructor(private userService: UserService,
              private apiService: ApiService,
              private dialog: MatDialog,
              private snackbarService: HelpSnackbar) { }

  @Input() control: FormControl;
  @Input() appearance = 'fill';
  @Input() helpSlug = 'default';

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

    this.load(true, '');

    this.query.valueChanges.subscribe((value) => {
      this.list = this.listTemp;

      if (value) {
        if (value.QuarterID) {
          this.control.setValue(value.QuarterID);
          this.query.setErrors(null);
          this.control.setErrors(null);
          this.selected = true;
        } else {
          this.selected = false;
          const query: string = value;
          if (query && query !== null) {
            this.load(false, value);
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

  async load(setDefault?: boolean, filter?: string) {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        filter,
      },
      requestProcedure: 'QuartersList'
    };

    await this.apiService.post(`${environment.ApiEndpoint}/capture/read/list`, model).then(
      (res: ListReadResponse) => {
        this.list = res.data;
        this.listTemp = res.data;

        // console.log(res);

        if (setDefault) {
          const defaultValue = this.list.find(x => x.QuarterID === this.control.value);
          this.query.setValue(defaultValue, { emitEvent: false });
        }
      });
  }

  async createItem() {}

  public displayFn(item: any): string {
    return item ? `${item.StartDay} ${item.StartMonth} - ${item.EndDay} ${item.EndMonth}` : '';
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
