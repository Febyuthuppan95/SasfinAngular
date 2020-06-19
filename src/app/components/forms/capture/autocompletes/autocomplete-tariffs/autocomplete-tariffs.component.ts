import { Component, OnInit, OnDestroy, Input } from '@angular/core';
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
export class AutocompleteTariffsComponent implements OnInit, OnDestroy {
  constructor(private userService: UserService,
              private tariffService: TariffService) { }

  @Input() control: FormControl;
  @Input() appearance = 'fill';

  private currentUser = this.userService.getCurrentUser();

  public list: any [] = [];
  public query = new FormControl();

  ngOnInit() {
    if (!this.control) {
      this.control = new FormControl();
    }

    this.load();

    this.query.valueChanges.subscribe((value) => {
      this.load();
    });
  }

  load() {
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
      });
  }

  public displayFn(item: any): string {
    return item ? `${item.name}` : '';
  }

  ngOnDestroy(): void {}

}
