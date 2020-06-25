import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { CaptureService } from 'src/app/services/capture.service';
import { FormControl } from '@angular/forms';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ls-autocomplete-edi-statuses',
  templateUrl: './autocomplete-edi-statuses.component.html',
  styleUrls: ['./autocomplete-edi-statuses.component.scss']
})
export class AutocompleteEdiStatusesComponent implements OnInit {

constructor(private userService: UserService,
            private captureService: CaptureService) { }

  @Input() control: FormControl;
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
        this.load(true);
      } else {
        this.load(true);
      }
    });

    this.load(true);

    this.query.valueChanges.subscribe((value) => {
      this.list = this.listTemp;
      const query: string = value;

      if (query && query !== null) {
        this.list = this.list.filter(x => this.matchRuleShort(x.name.toUpperCase(), `*${query.toUpperCase()}*`));
      }
    });
  }

  load(setDefault?: boolean) {

    this.captureService.ediStatusList({ pageIndex: 0, pageSize: 100 }).then(
      // tslint:disable-next-line: max-line-length
      (res: any) => {
        console.log(res);
        this.list = res.data;
        this.listTemp = res.data;

        if (setDefault) {
          const defaultValue = this.list.find(x => x.EDIStatusID === this.control.value);
          this.query.setValue(defaultValue, { emitEvent: false });
        }
      });
  }

  matchRuleShort(str, rule) {
    // tslint:disable-next-line: no-shadowed-variable
    const escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
  }

  public displayFn(item: any): string {
    return item ? `${item.Name}` : '';
  }

  ngOnDestroy(): void {}
}
