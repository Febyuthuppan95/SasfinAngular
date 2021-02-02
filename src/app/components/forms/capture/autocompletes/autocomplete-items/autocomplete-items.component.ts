import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateItemsComponent } from './dialog-create-items/dialog-create-items.component';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ls-autocomplete-items',
  templateUrl: './autocomplete-items.component.html',
  styleUrls: ['./autocomplete-items.component.scss']
})
export class AutocompleteItemsComponent implements OnInit, OnDestroy, OnChanges {
  constructor(private userService: UserService,
              private apiService: ApiService,
              private dialog: MatDialog,
              private snackbarService: HelpSnackbar) { }

  @Input() control: FormControl;
  @Input() status: number;
  @Input() transstatus: number;
  @Input() companyID: number;
  @Input() appearance = 'fill';
  @Input() label = 'Items';
  @Input() helpSlug = 'default';

  private currentUser = this.userService.getCurrentUser();
  private listTemp: any[] = [];
  private isRequired = false;

  public list: any[] = [];
  public query = new FormControl(null);
  public valueKeeper = new FormControl();
  public selected = false;

  safe = true;

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

    if (this.control.value !== null) {
      this.selected = true;
    }

    this.load(true, this.query.value === null ? '' : this.query.value);

    this.query.valueChanges.subscribe((value) => {
      this.list = this.listTemp;

      if (value) {
        if (value.ItemID) {
          this.control.setValue(value.ItemID);
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
        this.control.setValue(null);
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
      this.load(true, this.query.value === null ? '' : this.query.value);
    }
  }

  async load(setDefault?: boolean, filter?: string) {
    this.safe = false;
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        filter,
      },
      requestProcedure: 'ItemsList'
    };

    await this.apiService.post(`${environment.ApiEndpoint}/capture/read/list`, model).then(
      (res: any) => {
        this.list = res.data;
        this.listTemp = res.data;

        if (setDefault) {
          const defaultValue = this.list.find(x => x.ItemID === this.control.value);
          this.query.setValue(defaultValue, { emitEvent: false });
        }

        this.safe = true;
      }, (msg) => {
        this.safe = true;
      });

    if (this.status === 5 && this.transstatus == 10) {
        this.query.disable();
      }
  }

  async createItem() {
    this.dialog.open(DialogCreateItemsComponent, {
      width: '512px'
    }).afterClosed().subscribe(async (id) => {
      // console.log(id);

      if (id) {
        this.control.setValue(id);
        await this.load(true);
        this.selected = true;
      }
    });
  }

  public displayFn(item: any): string {
    return item ? `${item.Tariff !== '' && item.Tariff !== null ? item.Tariff + ', ' : ''}${item.Name}, ${item.Description}` : '';
  }

  focusOut(trigger) {
    if (this.safe) {
      if (this.list.length > 0 && !this.selected && (this.query.value !== null && this.query.value !== '')) {
        this.query.setValue(this.list[0]);

        trigger.closePanel();
      }

      if (this.list.length === 0) {
        this.createItem();
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
