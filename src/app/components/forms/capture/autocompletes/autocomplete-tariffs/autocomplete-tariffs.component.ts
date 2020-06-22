import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { FormControl } from '@angular/forms';
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

  public list: any [] = [];
  public query = new FormControl('');

  ngOnInit() {
    if (!this.control) {
      this.control = new FormControl();
    }

    this.control.valueChanges.subscribe((val) => {
      if (val === null) {
        this.query.reset('');
        this.load(true);
      } else {
        this.load(true);
      }
    });

    this.load(true);

    this.query.valueChanges.subscribe((value) => {
      this.load();
    });
  }

  ngOnChanges() {

  }

  load(setDefault?: boolean) {
    this.tariffService
    .list({
      userID: this.currentUser.userID,
      specificTariffID: -1,
      filter: this.query.value,
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

        if (setDefault) {
          const defaultValue = this.list.find(x => x.id === this.control.value);
          this.query.setValue(defaultValue, { emitEvent: false });
        }
      });
  }

  public displayFn(item: any): string {
    return item ? `${item.name}` : '';
  }

  ngOnDestroy(): void {}

}
