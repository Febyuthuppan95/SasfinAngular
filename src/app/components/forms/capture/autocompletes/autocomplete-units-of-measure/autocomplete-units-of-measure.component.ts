import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { FormControl } from '@angular/forms';
import { ListUnitsOfMeasure } from 'src/app/models/HttpResponses/ListUnitsOfMeasure';
import { UnitMeasureService } from 'src/app/services/Units.Service';
import { UnitsOfMeasure } from 'src/app/models/HttpResponses/UnitsOfMeasure';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ls-autocomplete-units-of-measure',
  templateUrl: './autocomplete-units-of-measure.component.html',
  styleUrls: ['./autocomplete-units-of-measure.component.scss']
})
export class AutocompleteUnitsOfMeasureComponent implements OnInit {
constructor(private userService: UserService,
            private unitService: UnitMeasureService) { }

  @Input() control: FormControl;
  @Input() appearance = 'fill';

  private currentUser = this.userService.getCurrentUser();
  private listTemp: UnitsOfMeasure[] = [];

  public list: UnitsOfMeasure[] = [];
  public query = new FormControl();

  ngOnInit() {
    if (!this.control) {
      this.control = new FormControl();
    }

    this.load();

    this.query.valueChanges.subscribe((value) => {
      this.list = this.listTemp;

      if (this.query.valid) {
        this.list = this.list.filter(x => this.matchRuleShort(x.name.toUpperCase(), `*${this.query.value.toUpperCase()}*`));
      }
    });
  }

  load() {
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
        }
      });
  }

  matchRuleShort(str, rule) {
    // tslint:disable-next-line: no-shadowed-variable
    const escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
  }

  public displayFn(item: UnitsOfMeasure): string {
    return item ? `${item.name}, ${item.description}` : '';
  }

  ngOnDestroy(): void {}
}
