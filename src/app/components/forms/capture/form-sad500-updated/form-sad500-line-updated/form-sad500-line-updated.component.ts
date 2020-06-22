import { Component, OnInit, Input, OnChanges, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AllowIn, KeyboardShortcutsComponent } from 'ng-keyboard-shortcuts';

@Component({
  selector: 'app-form-sad500-line-updated',
  templateUrl: './form-sad500-line-updated.component.html',
  styleUrls: ['./form-sad500-line-updated.component.scss']
})
export class FormSad500LineUpdatedComponent implements OnInit, OnChanges, AfterViewInit {

  constructor() { }

  public form = new FormGroup({
    userID: new FormControl(null, [Validators.required]),
    specificSAD500LineID: new FormControl(null, [Validators.required]),
    tariffID: new FormControl(null, [Validators.required]),
    unitOfMeasureID: new FormControl(null, [Validators.required]),
    originalLineID: new FormControl(null, [Validators.required]),
    cooID: new FormControl(null, [Validators.required]),
    replacedByLineID: new FormControl(null, [Validators.required]),
    lineNo: new FormControl(null, [Validators.required]),
    customsValue: new FormControl(null, [Validators.required]),
    previousDeclaration: new FormControl(null, [Validators.required]),
    quantity: new FormControl(null, [Validators.required]),
    duty: new FormControl(null, [Validators.required]),
    duties: new FormControl(null, [Validators.required]),
    supplyUnit: new FormControl(null, [Validators.required]),
    lineNoOBit: new FormControl(false, [Validators.required]),
    lineNoOUserID: new FormControl(null, [Validators.required]),
    lineNoODate: new FormControl(new Date(), [Validators.required]),
    lineNoOReason: new FormControl(null, [Validators.required]),
    customsValueOBit: new FormControl(false, [Validators.required]),
    customsValueOUserID: new FormControl(null, [Validators.required]),
    customsValueODate: new FormControl(new Date(), [Validators.required]),
    customsValueOReason: new FormControl(null, [Validators.required]),
    quantityOBit: new FormControl(false, [Validators.required]),
    quantityOUserID: new FormControl(null, [Validators.required]),
    quantityODate: new FormControl(new Date(), [Validators.required]),
    quantityOReason: new FormControl(null, [Validators.required]),
    previousDeclarationOBit: new FormControl(false, [Validators.required]),
    previousDeclarationOUserID: new FormControl(null, [Validators.required]),
    previousDeclarationODate: new FormControl(new Date(), [Validators.required]),
    previousDeclarationOReason: new FormControl(null, [Validators.required]),
    dutyOBit: new FormControl(false, [Validators.required]),
    dutyOUserID: new FormControl(null, [Validators.required]),
    dutyODate: new FormControl(new Date(), [Validators.required]),
    dutyOReason: new FormControl(null, [Validators.required]),
    vatOBit: new FormControl(false, [Validators.required]),
    vatOUserID: new FormControl(null, [Validators.required]),
    vatODate: new FormControl(new Date(), [Validators.required]),
    vatOReason: new FormControl(null, [Validators.required]),
    supplyUnitOBit: new FormControl(false, [Validators.required]),
    supplyUnitOUserID: new FormControl(null, [Validators.required]),
    supplyUnitODate: new FormControl(new Date(), [Validators.required]),
    supllyUnitOReason: new FormControl(null, [Validators.required]),
    sad500ID: new FormControl(null, [Validators.required]),
    isDeleted: new FormControl(0, [Validators.required]),
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
    this.submission.emit(form.value);
  }

}
