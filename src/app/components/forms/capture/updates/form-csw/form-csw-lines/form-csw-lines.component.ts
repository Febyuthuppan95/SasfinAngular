import { Component, OnInit, OnChanges, AfterViewInit, Input, Output, EventEmitter, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.Service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { KeyboardShortcutsComponent, AllowIn } from 'ng-keyboard-shortcuts';
import { DialogOverrideComponent } from '../../../dialog-override/dialog-override.component';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { EventService } from 'src/app/services/event.service';
import { UUID } from 'angular2-uuid';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';

@AutoUnsubscribe()
@Component({
  selector: 'app-form-csw-lines',
  templateUrl: './form-csw-lines.component.html',
  styleUrls: ['./form-csw-lines.component.scss']
})
export class FormCswLinesComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  constructor(private snackbar: MatSnackBar,
              private dialog: MatDialog,
              private userService: UserService,
              private eventService: EventService,
              private snackbarService: HelpSnackbar) { }

  public form = new FormGroup({
    userID: new FormControl(null),
    customWorksheetLineID: new FormControl(null),
    customWorksheetID: new FormControl(null),
    currencyID: new FormControl(null, [Validators.required]),
    unitOfMeasureID: new FormControl(null),
    cooID: new FormControl(null),
    tariffID: new FormControl(null),
    invoiceNo: new FormControl(null),
    commonFactor: new FormControl(null), // @required
    hsQuantity: new FormControl(null),
    foreignInv: new FormControl(null), // @required
    custVal: new FormControl(null), // @required
    duty: new FormControl(null), // @required
    prodCode: new FormControl(null),
    supplyUnit: new FormControl(null),
    isDeleted: new FormControl(null),

    cooOBit: new FormControl(null),
    cooOUserID: new FormControl(null),
    cooODate: new FormControl(null),
    cooOReason: new FormControl(null),
    cooError: new FormControl(null),

    tariffHeadingOBit: new FormControl(null),
    tariffHeadingOUserID: new FormControl(null),
    tariffHeadingODate: new FormControl(null),
    tariffHeadingOReason: new FormControl(null),
    tariffHeadingError: new FormControl(null),

    hsQuantityOBit: new FormControl(null),
    hsQuantityOUserID: new FormControl(null),
    hsQuantityODate: new FormControl(null),
    hsQuantityOReason: new FormControl(null),
    hsQuantityError: new FormControl(null),

    foreignInvOBit: new FormControl(null),
    foreignInvOUserID: new FormControl(null),
    foreignInvODate: new FormControl(null),
    foreignInvOReason: new FormControl(null),
    foreignInvError: new FormControl(null),

    custValOBit: new FormControl(null),
    custValOUserID: new FormControl(null),
    custValODate: new FormControl(null),
    custValOReason: new FormControl(null),
    custValError: new FormControl(null),

    dutyOBit: new FormControl(null),
    dutyOUserID: new FormControl(null),
    dutyODate: new FormControl(null),
    dutyOReason: new FormControl(null),
    dutyError: new FormControl(null),

    commonFactorOBit: new FormControl(null),
    commonFactorOUserID: new FormControl(null),
    commonFactorODate: new FormControl(null),
    commonFactorOReason: new FormControl(null),
    commonFactorError: new FormControl(null),

    invoiceNoOBit: new FormControl(null),
    invoiceNoOUserID: new FormControl(null),
    invooiceNoODate: new FormControl(null),
    invoiceNoOReason: new FormControl(null),
    invoiceNoError: new FormControl(null),

    supplyUnitOBit: new FormControl(null),
    supplyUnitOUserID: new FormControl(null),
    supplyUnitODate: new FormControl(null),
    supplyUnitOReason: new FormControl(null),
    supplyUnitError: new FormControl(null),

    uniqueIdentifier: new FormControl(),
  });

  public attachmentLabel: string;
  public transactionLabel: string;
  public lines: any[];
  public activeLine: any;
  public activeIndex: any;
  public displayLines = false;
  public errors: any[] = [];
  public shortcuts: any[] = [];
  public loader = false;

  private currentUser = this.userService.getCurrentUser();

  @Input() data: any;
  @Input() isExport: boolean;
  @Output() submission = new EventEmitter<any>();

  @ViewChild(KeyboardShortcutsComponent, { static: true })
  private keyboard: KeyboardShortcutsComponent;

  @ViewChild('startLineForm', { static: false })
  private startLineForm: ElementRef;

  ngOnInit() {
    this.form.controls.duty.setValidators(this.isExport ? null : [Validators.required]);
    this.form.controls.duty.updateValueAndValidity();

    if (this.data && this.data !== null) {
      this.form.patchValue(this.data);

      Object.keys(this.form.controls).forEach(key => {
        if (key.indexOf('ODate') !== -1) {
          if (this.form.controls[key].value !== null || this.form.controls[key].value) {
            this.form.controls[key].setValue(null);
          }
        }
      });

      console.log(this.form.value);
      this.errors = this.data.errors;

      if (this.errors) {
        if (this.errors.length > 0) {
          this.loader = true;

          Object.keys(this.form.controls).forEach(key => {
            this.errors.forEach((error) => {
              if (key.toUpperCase() === error.fieldName.toUpperCase()) {
                if (!this.form.controls[`${key}OBit`].value) {
                  this.form.controls[key].markAsTouched();
                  this.form.controls[key].setErrors({incorrect: true});
                }
              }

              if (error.fieldName.toUpperCase() == 'CUSTOMS VALUE') {
                this.form.controls.custVal.markAsTouched();
                this.form.controls.custVal.setErrors({
                  incorrect: true,
                });

                const error = this.getError('CUSTOMS VALUE');
                this.form.controls.custValError.setValue(error);
              }

              if (error.fieldName.toUpperCase() == 'SUPPLY UNIT') {
                this.form.controls.supplyUnit.markAsTouched();
                this.form.controls.supplyUnit.setErrors({
                  incorrect: true,
                });

                const error = this.getError('SUPPLY UNIT');
                this.form.controls.supplyUnitError.setValue(error);
              }

              if (error.fieldName.toUpperCase() == 'FOREIGN INV') {
                this.form.controls.foreignInv.markAsTouched();
                this.form.controls.foreignInv.setErrors({
                  incorrect: true,
                });

                const error = this.getError('FOREIGN INV');
                this.form.controls.foreignInvError.setValue(error);
              }

              if (error.fieldName.toUpperCase() == 'DUTY') {
                this.form.controls.duty.markAsTouched();
                this.form.controls.duty.setErrors({
                  incorrect: true,
                });

                const error = this.getError('duty');
                this.form.controls.dutyError.setValue(error);
              }
            });
          });

          this.form.updateValueAndValidity();
        }
      }

      setTimeout(() => this.loader = false, 100);
    } else {
      this.form.controls.customWorksheetLineID.setValue(-1);
    }

    setTimeout(() => this.startLineForm.nativeElement.focus(), 100);

    this.eventService.submitLines.subscribe(() => {
      this.submit(this.form);
    });

    this.eventService.focusForm.subscribe(() => {
      setTimeout(() => this.startLineForm.nativeElement.focus(), 100);
    });

    this.form.valueChanges.subscribe((e) => console.log(e));
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.shortcuts.push(
        {
          key: 'alt + a',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: () => this.submit(this.form),
        },
        {
          key: 'alt + k',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          // command: (e) => (this.focusDutiesQuery = !this.focusDutiesQuery),
        }
      );
    });
  }

  ngOnChanges() {
    // this.form.reset();

    // if (this.data && this.data !== null) {
    //   this.form.patchValue(this.data);
    //   Object.keys(this.form.controls).forEach(key => {
    //     if (key.indexOf('ODate') !== -1) {
    //       if (this.form.controls[key].value !== null || this.form.controls[key].value) {
    //         this.form.controls[key].setValue(null);
    //       }
    //     }
    //   });
    //   this.errors = this.data.errors;
    //   console.log(this.data.errors);

    //   this.checkErrors();
    // } else {
    //   this.form.controls.customWorksheetLineID.setValue(-1);
    // }

    // this.form.controls.duty.setValidators(this.isExport ? null : [Validators.required]);
    // this.form.controls.duty.updateValueAndValidity();
  }

  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
  }

  getError(key: string): string {
    console.log(this.errors);
    console.log(this.errors.find(x => x.fieldName.toUpperCase() === key.toUpperCase()));
    return this.errors.find(x => x.fieldName.toUpperCase() === key.toUpperCase()) ? this.errors.find(x => x.fieldName.toUpperCase() === key.toUpperCase()).errorDescription : '';
  }

  public findInvalidControls(form: FormGroup) {
    const invalid = [];
    const controls = form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }

    console.log(invalid);
}

  submit(form: FormGroup) {
    form.markAllAsTouched();

    if (form.valid) {
      const line: any = form.value;
      line.uniqueIdentifier = line.uniqueIdentifier === null ? UUID.UUID() : line.uniqueIdentifier;

      this.submission.emit(line);
    } else {
      this.findInvalidControls(form);
      this.snackbar.open('Please fill in line details', '', {duration: 3000});
    }
  }

    // @override methods
    overrideDialog(key, label) {
      this.dialog.open(DialogOverrideComponent, {
        width: '512px',
        data: {
          label
        }
      }).afterClosed().subscribe((val) => {
        if (val) {
          this.override(key, val);
        }
      });
    }

    override(key: string, reason: string) {
      this.form.controls[`${key}OUserID`].setValue(this.currentUser.userID);
      this.form.controls[`${key}ODate`].setValue(new Date());
      this.form.controls[`${key}OBit`].setValue(true);
      this.form.controls[`${key}OReason`].setValue(reason);
    }

    undoOverride(key: string) {
      this.form.controls[`${key}OUserID`].setValue(null);
      this.form.controls[`${key}ODate`].setValue(new Date());
      this.form.controls[`${key}OBit`].setValue(false);
      this.form.controls[`${key}OReason`].setValue(null);
    }

    ngOnDestroy(): void {}
}
