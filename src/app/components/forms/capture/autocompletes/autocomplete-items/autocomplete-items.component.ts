import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { FormControl, Validators } from '@angular/forms';
import { ListReadResponse } from '../../form-invoice/form-invoice-lines/form-invoice-lines.component';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material';
import { DialogCreateItemsComponent } from './dialog-create-items/dialog-create-items.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ls-autocomplete-items',
  templateUrl: './autocomplete-items.component.html',
  styleUrls: ['./autocomplete-items.component.scss']
})
export class AutocompleteItemsComponent implements OnInit, OnDestroy, OnChanges {
  constructor(private userService: UserService,
              private apiService: ApiService,
              private dialog: MatDialog) { }

  @Input() control: FormControl;
  @Input() companyID: number;
  @Input() appearance = 'fill';
  @Input() label = 'Items';

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

    this.load(true, '');

    this.query.valueChanges.subscribe((value) => {
      this.list = this.listTemp;

      if (value) {
        if (value.ItemID) {
          this.control.setValue(value.ItemID);
          this.query.setErrors(null);
          this.control.setErrors(null);
        } else {
          const query: string = value;
          if (query && query !== null) {
            this.load(false, value);
          }

          this.control.reset(null);
          this.query.setErrors({ incorrect: true });
          this.control.setErrors({ incorrect: true });
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

  async load(setDefault?: boolean, filter?: string) {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        filter,
      },
      requestProcedure: 'ItemsList'
    };

    await this.apiService.post(`${environment.ApiEndpoint}/capture/read/list`, model).then(
      (res: ListReadResponse) => {
        // console.log(res);

        this.list = res.data;
        this.listTemp = res.data;

        if (setDefault) {
          const defaultValue = this.list.find(x => x.ItemID === this.control.value);
          this.query.setValue(defaultValue, { emitEvent: false });
        }
      });
  }

  async createItem() {
    this.dialog.open(DialogCreateItemsComponent, {
      width: '512px'
    }).afterClosed().subscribe(async (id) => {
      // console.log(id);

      if (id) {
        this.control.setValue(id);
        await this.load(true);
      }
    });
  }

  public displayFn(item: any): string {
    return item ? `${item.Tariff !== '' && item.Tariff !== null ? item.Tariff + ', ' : ''}${item.Name}, ${item.Description}` : '';
  }

  focusOut() {
    if (this.list.length > 0) {
      this.query.setValue(this.list[0]);
    }
  }

  ngOnDestroy(): void {}
}
