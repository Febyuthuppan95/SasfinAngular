import { Component, OnInit, Input, OnChanges, ViewChild, AfterViewInit, Output, EventEmitter, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'app-form-c1-lines',
  templateUrl: './form-c1-lines.component.html',
  styleUrls: ['./form-c1-lines.component.scss']
})
export class FormC1LinesComponent implements OnInit , OnChanges, AfterViewInit, OnDestroy {

  constructor(private snackbar: MatSnackBar,
              private eventService: EventService,
              private snackbarService: HelpSnackbar) { }

  public form = new FormGroup({
    userID: new FormControl(null),
    SupplierC1LineID: new FormControl(null),
    SupplierC1ID: new FormControl(null),
    DocumentNo: new FormControl(null),
    DocumentLineNo: new FormControl(null),
    ItemID: new FormControl(null),
    SupplierItemID: new FormControl(null), // ?
    LineNo: new FormControl(null),
    Quantity: new FormControl(null),
    TotalCost: new FormControl(null),
    ComponentValue: new FormControl(null),
    RawMaterialValue: new FormControl(null),
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
  public SupplierC1LineID = -1;

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
      this.SupplierC1LineID = this.data.SupplierC1LineID;
    } else {
      this.SupplierC1LineID = -1;
      this.form.controls.SupplierC1LineID.setValue(-1);
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
