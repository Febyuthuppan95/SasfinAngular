import { Component, OnInit, Input, OnChanges, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.Service';
import { AllowIn } from 'ng-keyboard-shortcuts';

@Component({
  selector: 'app-form-sad500-line-updated',
  templateUrl: './form-sad500-line-updated.component.html',
  styleUrls: ['./form-sad500-line-updated.component.scss']
})
export class FormSad500LineUpdatedComponent implements OnInit, OnChanges, AfterViewInit {

  constructor(private userService: UserService) { }

  public form = new FormGroup({
    userID: new FormControl(null, [Validators.required]),
    SAD500ID: new FormControl(null, [Validators.required]),
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
    supplyUnit: new FormControl(null, [Validators.required]),
    lineNoOBit: new FormControl(false, [Validators.required]),
    lineNoOUserID: new FormControl(null, [Validators.required]),
    lineNoODate: new FormControl(null, [Validators.required]),
    lineNoOReason: new FormControl(null, [Validators.required]),
    customsValueOBit: new FormControl(false, [Validators.required]),
    customsValueOUserID: new FormControl(null, [Validators.required]),
    customsValueODate: new FormControl(null, [Validators.required]),
    customsValueOReason: new FormControl(null, [Validators.required]),
    quantityOBit: new FormControl(false, [Validators.required]),
    quantityOUserID: new FormControl(null, [Validators.required]),
    quantityODate: new FormControl(null, [Validators.required]),
    quantityOReason: new FormControl(null, [Validators.required]),
    previousDeclarationOBit: new FormControl(false, [Validators.required]),
    previousDeclarationOUserID: new FormControl(null, [Validators.required]),
    previousDeclarationODate: new FormControl(null, [Validators.required]),
    previousDeclarationOReason: new FormControl(null, [Validators.required]),
    dutyOBit: new FormControl(false, [Validators.required]),
    dutyOUserID: new FormControl(null, [Validators.required]),
    dutyODate: new FormControl(null, [Validators.required]),
    dutyOReason: new FormControl(null, [Validators.required]),
    vatOBit: new FormControl(false, [Validators.required]),
    vatOUserID: new FormControl(null, [Validators.required]),
    vatODate: new FormControl(null, [Validators.required]),
    vatOReason: new FormControl(null, [Validators.required]),
    supplyUnitOBit: new FormControl(false, [Validators.required]),
    supplyUnitOUserID: new FormControl(null, [Validators.required]),
    supplyUnitODate: new FormControl(null, [Validators.required]),
    supllyUnitOReason: new FormControl(null, [Validators.required]),
  });

  public attachmentLabel: string;
  public transactionLabel: string;
  public lines: any[];
  public activeLine: any;
  public activeIndex: any;
  public displayLines = false;
  public errors: any[] = [];
  public shortcuts: any[];

  private attachmentID: number;
  private transactionID: number;
  private currentUser = this.userService.getCurrentUser();

  @Input() data: any;
  @Output() submission = new EventEmitter<any>();

  ngOnInit() {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  ngAfterViewInit(): void {
    this.shortcuts.push(
      {
        key: 'alt + a',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => this.submit(this.form),
      },
      {
        key: 'alt + k',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        // command: (e) => (this.focusDutiesQuery = !this.focusDutiesQuery),
      }
    );
  }

  ngOnChanges() {
    this.form.reset();
    this.form.patchValue(this.data);
  }

  getError(key: string): string {
    return this.errors.find(x => x.fieldName === key).errorDescription;
  }

  submit(form: FormGroup) {
    this.submission.emit(form.value);
  }

}
