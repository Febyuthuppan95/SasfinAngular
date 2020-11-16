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
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-form-inv-lines',
  templateUrl: './form-inv-lines.component.html',
  styleUrls: ['./form-inv-lines.component.scss']
})
export class FormInvLinesComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  constructor(private snackbar: MatSnackBar,
              private dialog: MatDialog,
              private userService: UserService,
              private eventService: EventService,
              private snackbarService: HelpSnackbar) { }

  public form = new FormGroup({
    userID: new FormControl(null),
    invoiceLineID: new FormControl(null),
    invoiceID: new FormControl(null),
    itemID: new FormControl(null, [Validators.required]),
    unitOfMeasureID: new FormControl(null),
    cooID: new FormControl(null),
    prodCode: new FormControl(null),
    commonFactor: new FormControl(null),
    quantity: new FormControl(null, [Validators.required]),
    itemValue: new FormControl(null),
    unitPrice: new FormControl(null, [Validators.required]),
    totalLineValue: new FormControl(null, [Validators.required]),
    isDeleted: new FormControl(0),
    invoiceNoOBit: new FormControl(null),
    invoiceNoOUserID: new FormControl(null),
    invoiceNoDate: new FormControl(null),
    invoiceNoReason: new FormControl(null),
    commonFactorOBit: new FormControl(null),
    commonFactorID: new FormControl(null),
    commonFactorNoDate: new FormControl(null),
    commonFactorReason: new FormControl(null),
    prodCodeOBit: new FormControl(null),
    prodCodeOUserID: new FormControl(null),
    prodCodeODate: new FormControl(null),
    prodCodeOReason: new FormControl(null),
    quantityOBit: new FormControl(null),
    quantityOUserID: new FormControl(null),
    quantityODate: new FormControl(null),
    quantityOReason: new FormControl(null),
    itemValueOBit: new FormControl(null),
    itemValueOUserID: new FormControl(null),
    itemValueODate: new FormControl(null),
    itemValueOReason: new FormControl(null),
    unitPriceOBit: new FormControl(null),
    unitPriceOUserID: new FormControl(null),
    unitPriceODate: new FormControl(null),
    unitPriceOReason: new FormControl(null),
    totalLineValueOBit: new FormControl(null),
    totalLineValueOUserID: new FormControl(null),
    totalLineValueODate: new FormControl(null),
    totalLineValueOReason: new FormControl(null),
    uniqueIdentifier: new FormControl(),
  });

  public tempForm = new FormGroup({
    itemID: new FormControl(null, [Validators.required]),
    unitOfMeasureID: new FormControl(null),
    cooID: new FormControl(null),
    prodCode: new FormControl(null),
    commonFactor: new FormControl(null),
    quantity: new FormControl(null, [Validators.required]),
    itemValue: new FormControl(null),
    unitPrice: new FormControl(null, [Validators.required]),
    totalLineValue: new FormControl(null, [Validators.required]),
    shortClaim: new FormControl(null),
  });

  public attachmentLabel: string;
  public transactionLabel: string;
  public lines: any[];
  public activeLine: any;
  public activeIndex: any;
  public displayLines = false;
  public errors: any[] = [];
  public shortcuts: any[] = [];
  public invoiceID = -1;
  public unsavedChanges = false;

  private currentUser = this.userService.getCurrentUser();

  @Input() data: any;
  @Input() status: number;
  @Input() companyID: number;
  @Input() isQA = false;
  @Input() savedChanges = false;
  @Output() submission = new EventEmitter<any>();

  @ViewChild('startLineForm', { static: false })
  private startLineForm: ElementRef;

  @ViewChild(KeyboardShortcutsComponent, { static: true })
  private keyboard: KeyboardShortcutsComponent;

  ngOnInit() {
    if (this.data && this.data !== null) {
      this.data.invoiceID = this.data.invoiceID;
      this.data.invoiceLineID = this.data.invoiceLineID;
      this.invoiceID = this.data.invoiceID;
      this.form.patchValue(this.data);
      this.tempForm.patchValue(this.data);

      Object.keys(this.form.controls).forEach(key => {
        if (key.indexOf('ODate') !== -1) {
          if (this.form.controls[key].value !== null || this.form.controls[key].value) {
            this.form.controls[key].setValue(null);
          }
        }
      });

      this.errors = this.data.errors;

      if (this.isQA && !this.data.qaComplete) {
        this.form.controls.commonFactor.reset();
        this.form.controls.quantity.reset();
        this.form.controls.unitPrice.reset();
        this.form.controls.totalLineValue.reset();
        this.form.controls.unitOfMeasureID.reset();
        this.form.controls.itemID.reset();
        this.form.controls.cooID.reset();
      }

    } else {
      this.invoiceID = -1;
      this.form.controls.invoiceLineID.setValue(-1);
      this.form.controls.invoiceID.setValue(-1);
    }

    setTimeout(() => this.startLineForm.nativeElement.focus(), 100);

    this.eventService.submitLines.subscribe(() => {
      this.submit(this.form);
    });

    this.eventService.focusForm.subscribe(() => {
      setTimeout(() => this.startLineForm.nativeElement.focus(), 100);
    });

    // QA Recapture
    if (this.isQA && !this.data.qaComplete && !this.savedChanges) {
      this.form.controls.commonFactor.valueChanges.subscribe((value) => {
        if (value) {
          this.markAsNoMatch('commonFactor', value);
        }
      });

      this.form.controls.quantity.valueChanges.subscribe((value) => {
        if (value) {
          this.markAsNoMatch('quantity', value);
        }
      });

      this.form.controls.totalLineValue.valueChanges.subscribe((value) => {
        if (value) {
          this.markAsNoMatch('totalLineValue', value);
        }
      });

      this.form.controls.unitPrice.valueChanges.subscribe((value) => {
        if (value) {
          this.markAsNoMatch('unitPrice', value);
        }
      });
    }

    this.form.valueChanges.subscribe(() => this.unsavedChanges = true);

    if (this.status === 5) {
      this.form.disable();
    }
  }

  markAsNoMatch(key, value) {
    if (value != this.tempForm.controls[key].value) {
      this.form.controls[key].setErrors({ noMatch: true });
    } else {
      this.form.controls[key].setErrors(null);
    }

    this.form.controls[key].updateValueAndValidity();
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
          command: (e) => setTimeout(() => this.startLineForm.nativeElement.focus(), 100),
        }
      );
    });
  }

  ngOnChanges() {
    this.form.reset();

    if (this.data && this.data !== null) {
      this.data.invoiceID = this.data.invoiceID;
      this.data.invoiceLineID = this.data.invoiceLineID;
      this.invoiceID = this.data.invoiceID;
      this.form.patchValue(this.data);
      this.tempForm.patchValue(this.data);

      Object.keys(this.form.controls).forEach(key => {
        if (key.indexOf('ODate') !== -1) {
          if (this.form.controls[key].value !== null || this.form.controls[key].value) {
            this.form.controls[key].setValue(null);
          }
        }
      });

      if (this.isQA && !this.data.qaComplete && !this.savedChanges) {
        this.form.controls.commonFactor.reset();
        this.form.controls.quantity.reset();
        this.form.controls.unitPrice.reset();
        this.form.controls.totalLineValue.reset();
        this.form.controls.unitOfMeasureID.reset();
        this.form.controls.itemID.reset();
        this.form.controls.cooID.reset();
      }

      this.errors = this.data.errors;
    } else {
      this.invoiceID = -1;
      this.form.controls.invoiceLineID.setValue(-1);
      this.form.controls.invoiceID.setValue(-1);
    }
  }

  getError(key: string): string {
    return this.errors.find(x => x.fieldName === key).errorDescription;
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

    const keys = Object.keys(form.controls);

    keys.forEach((key) => {
      if (form.controls[key].hasError('noMatch')) {
        form.controls[key].setErrors(null);
      }
    });

    form.updateValueAndValidity();

    if (form.valid) {
      const line: any = form.value;
      line.uniqueIdentifier = line.uniqueIdentifier === null ? UUID.UUID() : line.uniqueIdentifier;
      this.submission.emit(line);
    } else {
      this.findInvalidControls(form);
      this.snackbar.open('Please fill in line details', '', {duration: 3000});
    }
  }

  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
  }

    // @override methods
    overrideDialog(key, label) {
      this.dialog.open(DialogOverrideComponent, {
        autoFocus: true,
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


      this.form.controls[`${key}OBit`].setValue(true);
      this.form.controls[`${key}OReason`].setValue(reason);
    }

    undoOverride(key: string) {


      this.form.controls[`${key}OBit`].setValue(false);
      this.form.controls[`${key}OReason`].setValue(null);
    }

    ngOnDestroy(): void {}
}
