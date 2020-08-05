import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { FormControl, Validators } from '@angular/forms';
import { TariffService } from 'src/app/services/Tariff.service';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ls-autocomplete-tariffs',
  templateUrl: './autocomplete-tariffs.component.html',
  styleUrls: ['./autocomplete-tariffs.component.scss']
})
export class AutocompleteTariffsComponent implements OnInit, OnChanges, OnDestroy {
  constructor(private userService: UserService,
              private tariffService: TariffService) { }

  @Input() control: FormControl;
  @Input() appearance = 'fill';

  private currentUser = this.userService.getCurrentUser();
  private isRequired = false;

  public list: any [] = [];
  public query = new FormControl('');

  ngOnInit() {
    if (!this.control) {
      this.control = new FormControl();
    }

    this.isRequired = this.control.validator !== null;

    this.load(true);

    this.query.valueChanges.subscribe((value) => {
      console.log(value);
      if (value) {
        if (value.id) {
          this.control.setValue(value.id);
          this.query.setErrors(null);
          this.control.setErrors(null);
        } else {
          this.load(false);
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

  load(setDefault?: boolean) {
    let filter = '';

    if (this.query.value && this.query.value !== null) {
      filter = this.query.value;
    }

    this.tariffService
    .list({
      userID: this.currentUser.userID,
      specificTariffID: -1,
      filter,
      rowStart: 1,
      rowEnd: 10,
    })
    .then(
      (res: {
        tariffList: {
          id: number;
          itemNumber: string;
          heading: string;
          tariffCode: number;
          subHeading: string;
          checkDigit: string;
          name: string;
          duty: string;
          hsUnit: string;
        }[];
        outcome: Outcome;
        rowCount: number;
      }) => {
        this.list = res.tariffList;
        // console.log(this.list);

        if (setDefault) {
          const defaultValue = this.list.find(x => x.id === this.control.value);
          this.query.setValue(defaultValue, { emitEvent: false });
        }
      });
  }

  public displayFn(item: any): string {
    return item ? `${item.subHeading}.${item.itemNumber}` : '';
  }

  ngOnDestroy(): void {}

}
