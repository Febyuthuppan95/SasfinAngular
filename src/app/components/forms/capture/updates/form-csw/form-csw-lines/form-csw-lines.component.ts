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
    commonFactor: new FormControl(null, [Validators.required]),
    hsQuantity: new FormControl(null),
    foreignInv: new FormControl(null, [Validators.required]),
    custVal: new FormControl(null, [Validators.required]),
    duty: new FormControl(null, [Validators.required]),
    prodCode: new FormControl(null),
    supplyUnit: new FormControl(null, [Validators.required]),
    isDeleted: new FormControl(null),
    cooOBit: new FormControl(null),
    cooOUserID: new FormControl(null),
    cooODate: new FormControl(null),
    cooOReason: new FormControl(null),
    tariffHeadingOBit: new FormControl(null),
    tariffHeadingOUserID: new FormControl(null),
    tariffHeadingODate: new FormControl(null),
    tariffHeadingOReason: new FormControl(null),
    hsQuantityOBit: new FormControl(null),
    hsQuantityOUserID: new FormControl(null),
    hsQuantityODate: new FormControl(null),
    hsQuantityOReason: new FormControl(null),
    foreignInvOBit: new FormControl(null),
    foreignInvOUserID: new FormControl(null),
    foreignInvODate: new FormControl(null),
    foreignInvOReason: new FormControl(null),
    custValOBit: new FormControl(null),
    custValOUserID: new FormControl(null),
    custValODate: new FormControl(null),
    custValOReason: new FormControl(null),
    dutyOBit: new FormControl(null),
    dutyOUserID: new FormControl(null),
    dutyODate: new FormControl(null),
    dutyOReason: new FormControl(null),
    commonFactorOBit: new FormControl(null),
    commonFactorOUserID: new FormControl(null),
    commonFactorODate: new FormControl(null),
    commonFactorOReason: new FormControl(null),
    invoiceNoOBit: new FormControl(null),
    invoiceNoOUserID: new FormControl(null),
    invooiceNoODate: new FormControl(null),
    invoiceNoOReason: new FormControl(null),
    prodCodeOBit: new FormControl(null),
    prodCodeOUserID: new FormControl(null),
    prodCodeODate: new FormControl(null),
    prodCodeOReason: new FormControl(null),
    vatOBit: new FormControl(null),
    vatOUserID: new FormControl(null),
    vatODate: new FormControl(null),
    vatOReason: new FormControl(null),
    supplyUnitOBit: new FormControl(null),
    supplyUnitOUserID: new FormControl(null),
    supplyUnitODate: new FormControl(null),
    supplyUnitOReason: new FormControl(null),
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

  private currentUser = this.userService.getCurrentUser();

  @Input() data: any;
  @Input() isExport: boolean;
  @Output() submission = new EventEmitter<any>();

  @ViewChild(KeyboardShortcutsComponent, { static: true })
  private keyboard: KeyboardShortcutsComponent;

  @ViewChild('startLineForm', { static: false })
  private startLineForm: ElementRef;

  ngOnInit() {
    if (this.data && this.data !== null) {
      this.form.patchValue(this.data);
      Object.keys(this.form.controls).forEach(key => {
        if (key.indexOf('ODate') !== -1) {
          if (this.form.controls[key].value !== null || this.form.controls[key].value) {
            this.form.controls[key].setValue(null);
          }
        }
      });
      this.errors = this.data.errors;
    } else {
      this.form.controls.customWorksheetLineID.setValue(-1);
    }

    this.form.controls.duty.setValidators(this.isExport ? null : [Validators.required]);
    this.form.controls.duty.updateValueAndValidity();

    setTimeout(() => this.startLineForm.nativeElement.focus(), 100);

    this.eventService.submitLines.subscribe(() => {
      this.submit(this.form);
    });

    this.eventService.focusForm.subscribe(() => {
      setTimeout(() => this.startLineForm.nativeElement.focus(), 100);
    });
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
    this.form.reset();

    if (this.data && this.data !== null) {
      this.form.patchValue(this.data);
      Object.keys(this.form.controls).forEach(key => {
        if (key.indexOf('ODate') !== -1) {
          if (this.form.controls[key].value !== null || this.form.controls[key].value) {
            this.form.controls[key].setValue(null);
          }
        }
      });
      this.errors = this.data.errors;
    } else {
      this.form.controls.customWorksheetLineID.setValue(-1);
    }

    this.form.controls.duty.setValidators(this.isExport ? null : [Validators.required]);
    this.form.controls.duty.updateValueAndValidity();
  }

  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
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
