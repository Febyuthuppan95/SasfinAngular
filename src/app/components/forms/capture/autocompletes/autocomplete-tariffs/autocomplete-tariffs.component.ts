import { Component, OnInit, OnDestroy, Input, OnChanges, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { FormControl, Validators } from '@angular/forms';
import { TariffService } from 'src/app/services/Tariff.service';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ls-autocomplete-tariffs',
  templateUrl: './autocomplete-tariffs.component.html',
  styleUrls: ['./autocomplete-tariffs.component.scss']
})
export class AutocompleteTariffsComponent implements OnInit, OnChanges, OnDestroy {
  constructor(private userService: UserService,
              private tariffService: TariffService,
              private snackbarService: HelpSnackbar) { }

  @Input() control: FormControl;
  @Input() status: number;
  @Input() transstatus: number;
  @Input() appearance = 'fill';
  @Input() helpSlug = 'default';
  @Input() tariffHeading = 0;

  private isTariffType;
  private currentUser = this.userService.getCurrentUser();
  private isRequired = false;
  private click = null;
  public heading = 'Tariff';

  public list: any [] = [];
  public query = new FormControl('');
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

    this.control.valueChanges.subscribe((value) => {
      if (value) {
        console.log('test control');
        console.log(value);
        this.load(true, true);
        let item = this.list.find(x => x.id === value);
        this.query.setValue(item.id, {emitEvent: false});
        // this.query.setErrors(null);
        // this.control.setErrors(null);
        // this.selected = true;
      } else{
        this.control.setValue(null, {emitEvent: false});
        this.query.setValue(null, {emitEvent: false});
      }
    });

    this.query.valueChanges.subscribe((value) => {
      if (value) {
        if (value.id) {
          this.control.setValue(value.id);
          this.query.setErrors(null);
          this.control.setErrors(null);
          this.selected = true;
        } else {
          this.selected = false;
          this.load(false);
          this.control.reset(null);
          this.query.setErrors({ incorrect: true });
          this.control.setErrors({ incorrect: true });
        }
        this.click = null;
      } else {
        this.selected = false;
        this.control.setValue(null);
        this.click = null;
      }
    });
    if (this.tariffHeading > 0 && this.tariffHeading !== null) {
      this.isTariffType = this.tariffHeading;
      if (this.isTariffType === 1) {
        this.heading = 'Export Tariff';
      } else if (this.isTariffType === 2) {
        this.heading = 'Import Tariff';
      } else {
        this.heading = 'Tariff';
      }
    }
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
      this.load(false);
      this.load(true, true);
    }
  }

  load(setDefault?: boolean, getSpecific?: boolean) {
    let filter = '';

    if (this.query.value && this.query.value !== null) {
      filter = this.query.value;
    }

    this.tariffService
    .list({
      userID: this.currentUser.userID,
      specificTariffID: getSpecific === null ? this.control.value : -1,
      filter: "",
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

        console.log('list');
        console.log(this.list);

        if (setDefault) {
          const defaultValue = this.list.find(x => x.id === +this.control.value);
          console.log('defaultValue');
          console.log(defaultValue);

          if (defaultValue) {
            this.query.setValue(defaultValue, { emitEvent: false });
          }
        }
      });

    if (this.status === 5 && this.transstatus === 10) {
        this.query.disable();
    }
  }

  public displayFn(item: any): string {
    // tslint:disable-next-line: max-line-length
    return item ? `${item.subHeading == null ? item.itemNumber : item.subHeading}${item.subHeading ? item.subHeading.length < 8 && item.subHeading != null ? '.00' : '' : ''}` : '';
  }

  focusOut(trigger) {
    setTimeout(() => {
      if (this.list.length > 0 && !this.selected && (this.query.value !== null && this.query.value !== '')) {
        if (this.click === null) {
          this.query.setValue(this.list[0]);
        }
        else {
          this.query.setValue(this.click);
          this.click = null;
        }
        console.log(this.query.value);
        trigger.closePanel();
      }
    }, 200);
  }

  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
  }

  selectedOption($event){
    this.click = $event;
    console.log($event);
  }

  ngOnDestroy(): void {}

}
