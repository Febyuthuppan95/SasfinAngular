import { Component, OnInit, OnChanges, AfterViewInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from 'src/app/services/event.service';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { KeyboardShortcutsComponent, AllowIn } from 'ng-keyboard-shortcuts';
import { UUID } from 'angular2-uuid';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';

@Component({
  selector: 'app-form-smd-lines',
  templateUrl: './form-smd-lines.component.html',
  styleUrls: ['./form-smd-lines.component.scss']
})
export class FormSmdLinesComponent implements OnInit , OnChanges, AfterViewInit, OnDestroy {

  constructor(private snackbar: MatSnackBar,
              private eventService: EventService,
              private snackbarService: HelpSnackbar) { }

  public form = new FormGroup({
    userID: new FormControl(null),
    SupplierSMDLineID: new FormControl(null),
    SupplierSMDID: new FormControl(null),
    ItemID: new FormControl(null),
    SupplierItemID: new FormControl(null),
    LineNo: new FormControl(null),
    UnitOfMeasureID: new FormControl(null),
    NonSMDValue: new FormControl(null),
    Aluminium: new FormControl(null),
    Brass: new FormControl(null),
    Leather: new FormControl(null),
    PGM: new FormControl(null),
    FlatGlass: new FormControl(null),
    StainlessSteel: new FormControl(null),
    Steel: new FormControl(null),
    Reference: new FormControl(null),
    Active: new FormControl(false),
    IsDeleted: new FormControl(0),
    uniqueIdentifier: new FormControl(null),
    isLocal: new FormControl(false),
  });

  public attachmentLabel: string;
  public transactionLabel: string;
  public lines: any[];
  public activeLine: any;
  public activeIndex: any;
  public displayLines = false;
  public errors: any[] = [];
  public shortcuts: any[] = [];
  public SupplierSMDLineID = -1;

  @Input() data: any;
  @Input() companyID: any;
  @Output() submission = new EventEmitter<any>();

  @ViewChild(KeyboardShortcutsComponent, { static: true })
  private keyboard: KeyboardShortcutsComponent;

  ngOnInit() {
    this.updateForm();

    this.eventService.submitLines.subscribe(() => {
      this.submit(this.form.value);
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
    this.updateForm();
  }

  updateForm() {
    if (this.data && this.data !== null) {
      this.form.patchValue(this.data);
      this.SupplierSMDLineID = this.data.SupplierSMDLineID;
    } else {
      this.SupplierSMDLineID = -1;
      this.form.controls.SupplierSMDLineID.setValue(-1);
      this.form.controls.uniqueIdentifier.setValue(UUID.UUID());
    }

    this.form.updateValueAndValidity();
  }

  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
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

  ngOnDestroy(): void {}
}
