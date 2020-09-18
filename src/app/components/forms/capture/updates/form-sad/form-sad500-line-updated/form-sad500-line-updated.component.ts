import { Component, OnInit, Input, OnChanges, ViewChild, AfterViewInit, Output, EventEmitter, OnDestroy, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AllowIn, KeyboardShortcutsComponent } from 'ng-keyboard-shortcuts';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.Service';
import { DialogOverrideComponent } from '../../../dialog-override/dialog-override.component';
import { EventService } from 'src/app/services/event.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { UUID } from 'angular2-uuid';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';

@AutoUnsubscribe()
@Component({
  selector: 'app-form-sad500-line-updated',
  templateUrl: './form-sad500-line-updated.component.html',
  styleUrls: ['./form-sad500-line-updated.component.scss']
})
export class FormSad500LineUpdatedComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  constructor(private snackbar: MatSnackBar,
              private dialog: MatDialog,
              private userService: UserService,
              private eventService: EventService,
              private snackbarService: HelpSnackbar) { }

  public form = new FormGroup({
    userID: new FormControl(null),
    specificSAD500LineID: new FormControl(null),
    tariffID: new FormControl(null, [Validators.required]),
    unitOfMeasureID: new FormControl(null),
    originalLineID: new FormControl(null),
    cooID: new FormControl(null),
    replacedByLineID: new FormControl(null),
    lineNo: new FormControl(null, [Validators.required]),
    customsValue: new FormControl(null, [Validators.required]),
    previousDeclaration: new FormControl(null),
    quantity: new FormControl(null),
    duty: new FormControl(null),
    duties: new FormControl(null),
    supplyUnit: new FormControl(null, [Validators.required]),

    lineNoOBit: new FormControl(false),
    lineNoOReason: new FormControl(null),
    lineNoError: new FormControl(null),

    customsValueOBit: new FormControl(false),
    customsValueOReason: new FormControl(null),
    customsValueError: new FormControl(null),

    quantityOBit: new FormControl(false),
    quantityOReason: new FormControl(null),
    quantityError: new FormControl(null),

    previousDeclarationOBit: new FormControl(false),
    previousDeclarationOReason: new FormControl(null),
    previousDeclarationError: new FormControl(null),

    dutyOBit: new FormControl(false),
    dutyOReason: new FormControl(null),
    dutyError: new FormControl(null),

    supplyUnitOBit: new FormControl(false),
    supplyUnitOReason: new FormControl(null),
    supplyUnitError: new FormControl(null),

    sad500ID: new FormControl(null),
    isDeleted: new FormControl(0),
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
  public sadLine500ID = -1;

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
      this.data.sad500ID = this.data.SAD500ID;
      this.data.specificSAD500LineID = this.data.sad500LineID;
      this.sadLine500ID = this.data.specificSAD500LineID;
      this.form.patchValue(this.data);

      if (this.data.quantity === -1) {
        this.data.quantity = null;
        this.form.controls.quantity.setValue(null);
      }

      this.form.controls.duties.setValue(this.data.duties);
      this.errors = this.data.errors;

      if (this.errors) {
        if (this.errors.length > 0) {
          Object.keys(this.form.controls).forEach(key => {
            this.errors.forEach((error) => {
              if (key.toUpperCase() === error.fieldName.toUpperCase()) {
                if (!this.form.controls[`${key}OBit`].value) {
                  this.form.controls[key].markAsTouched();
                  this.form.controls[key].setErrors({incorrect: true});
                }
              }

              if (error.fieldName.toUpperCase() == 'CUSTOMS VALUE') {
                this.form.controls.customsValue.markAsTouched();
                this.form.controls.customsValue.setErrors({
                  incorrect: true,
                });

                const error = this.getError('CUSTOMS VALUE');
                this.form.controls.customsValueError.setValue(error);
              }

              if (error.fieldName.toUpperCase() == 'SUPPLY UNIT') {
                this.form.controls.supplyUnit.markAsTouched();
                this.form.controls.supplyUnit.setErrors({
                  incorrect: true,
                });

                const error = this.getError('SUPPLY UNIT');
                this.form.controls.supplyUnitError.setValue(error);
              }

              if (error.fieldName.toUpperCase() == 'DUTY') {
                // this.form.controls.duty.markAsTouched();
                // this.form.controls.duty.setErrors({
                //   incorrect: true,
                // });

                const error = this.getError('duty');
                this.form.controls.dutyError.setValue(error);
              }
            });
          });

          this.form.updateValueAndValidity();
        }
      }

    } else {
      this.sadLine500ID = -1;
      this.form.controls.specificSAD500LineID.setValue(-1);
      // this.form.controls.sad500LineID.setValue(-1);
    }

    // this.form.controls.duties.setValidators(this.isExport ? null : null);
    // this.form.controls.duties.updateValueAndValidity();

    setTimeout(() => this.startLineForm.nativeElement.focus(), 100);

    this.eventService.submitLines.subscribe(() => {
      this.submit(this.form);
    });

    this.eventService.focusForm.subscribe(() => {
      setTimeout(() => this.startLineForm.nativeElement.focus(), 100);
    });
  }

  ngAfterViewInit(): void {
    // if (this.errors.length > 0) {
    //   Object.keys(this.form.controls).forEach(key => {
    //     this.errors.forEach((error) => {
    //       let field = error.fieldName.toUpperCase();

    //       if (field === 'TARIFF') {
    //         field = 'TARIFFID';
    //       }

    //       if (field === 'COUNTRY OF ORGIN') {
    //         field = 'COOID';
    //       }

    //       if (key.toUpperCase() === field) {
    //         this.form.controls[key].setErrors({incorrect: true});
    //         this.form.controls[key].markAsTouched();
    //       }
    //     });
    //   });
    // }

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
    //   this.data.sad500ID = this.data.SAD500ID;
    //   this.data.specificSAD500LineID = this.data.specificSAD500LineID;
    //   this.form.patchValue(this.data);
    //   console.log(this.data);

    //   Object.keys(this.form.controls).forEach(key => {
    //     if (key.indexOf('ODate') !== -1) {
    //       if (this.form.controls[key].value !== null || this.form.controls[key].value) {
    //         this.form.controls[key].setValue(null);
    //       }
    //     }
    //   });

    //   // null checking quantity field
    //   if (this.data.quantity === -1) {
    //     this.data.quantity = null;
    //     this.form.controls.quantity.setValue(null);
    //   }

    //   this.form.controls.duties.setValue(this.data.duties);
    //   this.errors = this.data.errors;
    //   this.sadLine500ID = this.data.sad500LineID;

    //   // if (this.errors.length > 0) {
    //   //   Object.keys(this.form.controls).forEach(key => {
    //   //     this.errors.forEach((error) => {
    //   //       let field = error.fieldName.toUpperCase();

    //   //       if (field === 'TARIFF') {
    //   //         field = 'TARIFFID';
    //   //       }

    //   //       if (field === 'COUNTRY OF ORGIN') {
    //   //         field = 'COOID';
    //   //       }

    //   //       if (key.toUpperCase() === field) {
    //   //         this.form.controls[key].setErrors({incorrect: true});
    //   //         this.form.controls[key].markAsTouched();
    //   //       }
    //   //     });
    //   //   });
    //   // }
    // } else {
    //   console.log(this.form.controls);
    //   this.sadLine500ID = -1;
    //   this.form.controls.specificSAD500LineID.setValue(-1);
    //   // this.form.controls.sad500LineID.setValue(-1);
    // }

    // // this.form.controls.duties.setValidators(this.isExport ? null : [Validators.required]);
    // this.form.updateValueAndValidity();
  }

  public resetForm() {
    this.form.controls.unitOfMeasureID.reset(null);
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
    console.log(form);
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
