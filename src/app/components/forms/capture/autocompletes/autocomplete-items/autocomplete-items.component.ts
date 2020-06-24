import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { FormControl } from '@angular/forms';
import { ListReadResponse } from '../../form-invoice/form-invoice-lines/form-invoice-lines.component';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ls-autocomplete-items',
  templateUrl: './autocomplete-items.component.html',
  styleUrls: ['./autocomplete-items.component.scss']
})
export class AutocompleteItemsComponent implements OnInit, OnDestroy {
  constructor(private userService: UserService,
              private apiService: ApiService) { }

  @Input() control: FormControl;
  @Input() companyID: number;
  @Input() appearance = 'fill';

  private currentUser = this.userService.getCurrentUser();
  private listTemp: any[] = [];

  public list: any[] = [];
  public query = new FormControl();
  public valueKeeper = new FormControl();

  ngOnInit() {
    if (!this.control) {
      this.control = new FormControl();
    }

    this.control.valueChanges.subscribe((val) => {
      if (val === null) {
        this.query.reset(null);
        this.load(true, '');
      } else {
        this.load(true, '');
      }
    });

    this.load(true, '');

    this.query.valueChanges.subscribe((value) => {
      this.list = this.listTemp;

      if (this.query.value) {
        this.load(false, value);
      }
    });
  }

  load(setDefault?: boolean, filter?: string) {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        companyID: this.companyID,
        filter,
      },
      requestProcedure: 'ItemGroupsList'
    };

    this.apiService.post(`${environment.ApiEndpoint}/capture/read/list`, model).then(
      (res: ListReadResponse) => {
        this.list = res.data;
        this.listTemp = res.data;

        if (setDefault) {
          const defaultValue = this.list.find(x => x.ItemID === this.control.value);
          this.query.setValue(defaultValue, { emitEvent: false });
        }
      });
  }

  public displayFn(item: any): string {
    return item ? `${item.Item}` : '';
  }

  ngOnDestroy(): void {}
}
