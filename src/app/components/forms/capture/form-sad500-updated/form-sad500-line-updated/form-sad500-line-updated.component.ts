import { Component, OnInit, Input, OnChanges, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AllowIn, KeyboardShortcutsComponent } from 'ng-keyboard-shortcuts';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-form-sad500-line-updated',
  templateUrl: './form-sad500-line-updated.component.html',
  styleUrls: ['./form-sad500-line-updated.component.scss']
})
export class FormSad500LineUpdatedComponent implements OnInit, OnChanges, AfterViewInit {

  constructor(private snackbar: MatSnackBar) { }

  public form = new FormGroup({
    userID: new FormControl(null),
    specificSAD500LineID: new FormControl(null),
    tariffID: new FormControl(null, [Validators.required]),
    unitOfMeasureID: new FormControl(null, [Validators.required]),
    originalLineID: new FormControl(null),
    cooID: new FormControl(null, [Validators.required]),
    replacedByLineID: new FormControl(null),
    lineNo: new FormControl(null, [Validators.required]),
    customsValue: new FormControl(null, [Validators.required]),
    previousDeclaration: new FormControl(null, [Validators.required]),
    quantity: new FormControl(null, [Validators.required]),
    duty: new FormControl(null),
    duties: new FormControl(null, [Validators.required]),
    supplyUnit: new FormControl(null, [Validators.required]),
    lineNoOBit: new FormControl(false),
    lineNoOUserID: new FormControl(null),
    lineNoODate: new FormControl(new Date()),
    lineNoOReason: new FormControl(null),
    customsValueOBit: new FormControl(false),
    customsValueOUserID: new FormControl(null),
    customsValueODate: new FormControl(new Date()),
    customsValueOReason: new FormControl(null),
    quantityOBit: new FormControl(false),
    quantityOUserID: new FormControl(null),
    quantityODate: new FormControl(new Date()),
    quantityOReason: new FormControl(null),
    previousDeclarationOBit: new FormControl(false),
    previousDeclarationOUserID: new FormControl(null),
    previousDeclarationODate: new FormControl(new Date()),
    previousDeclarationOReason: new FormControl(null),
    dutyOBit: new FormControl(false),
    dutyOUserID: new FormControl(null),
    dutyODate: new FormControl(new Date()),
    dutyOReason: new FormControl(null),
    vatOBit: new FormControl(false),
    vatOUserID: new FormControl(null),
    vatODate: new FormControl(new Date()),
    vatOReason: new FormControl(null),
    supplyUnitOBit: new FormControl(false),
    supplyUnitOUserID: new FormControl(null),
    supplyUnitODate: new FormControl(new Date()),
    supllyUnitOReason: new FormControl(null),
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

  @Input() data: any;
  @Output() submission = new EventEmitter<any>();

  @ViewChild(KeyboardShortcutsComponent, { static: true })
  private keyboard: KeyboardShortcutsComponent;

  ngOnInit() {
    if (this.data) {
      this.data.sad500ID = this.data.SAD500ID;
      this.data.specificSAD500LineID = this.data.sad500LineID;
      this.form.patchValue(this.data);
      this.form.controls.duties.setValue(this.data.duties);
    } else {
      this.data.specificSAD500LineID = -1;
      this.data.sad500LineID = -1;
      this.form.controls.specificSAD500LineID.setValue(-1);
      this.form.controls.sad500LineID.setValue(-1);
    }
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

    if (this.data !== null) {
      this.data.specificSAD500LineID = this.data.sad500LineID;
      this.form.patchValue(this.data);

      this.form.controls.duties.setValue(this.data.duties);
    }
  }

  getError(key: string): string {
    return this.errors.find(x => x.fieldName === key).errorDescription;
  }

  submit(form: FormGroup) {
    if (form.valid) {
      this.submission.emit(form.value);
    } else {
      this.snackbar.open('Please fill in line details');
    }
  }

}
