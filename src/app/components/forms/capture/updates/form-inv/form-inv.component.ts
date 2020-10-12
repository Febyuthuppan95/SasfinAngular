import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, HostListener, Input, ElementRef } from '@angular/core';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { CaptureService } from 'src/app/services/capture.service';
import { UserService } from 'src/app/services/user.Service';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { EventService } from 'src/app/services/event.service';
import { ObjectHelpService } from 'src/app/services/ObjectHelp.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyService } from 'src/app/services/Company.Service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShortcutInput, KeyboardShortcutsComponent, AllowIn } from 'ng-keyboard-shortcuts';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { SubmitDialogComponent } from 'src/app/layouts/capture-layout/submit-dialog/submit-dialog.component';
import { UUID } from 'angular2-uuid';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { DialogOverrideComponent } from '../../dialog-override/dialog-override.component';
import { InvoiceGetResponse, InvoiceLinesResponse } from 'src/app/models/HttpResponses/Invoices';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DateService } from 'src/app/services/tools/date.service';
import {DeletelineDialogComponent} from '../../../../../layouts/capture-layout/deleteline-dialog/deleteline-dialog.component';
import { Location } from '@angular/common';
import { DialogGotoLineComponent } from '../../dialog-goto-line/dialog-goto-line.component';

@AutoUnsubscribe()
@Component({
  selector: 'app-form-inv',
  templateUrl: './form-inv.component.html',
  styleUrls: ['./form-inv.component.scss']
})
export class FormInvComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private captureService: CaptureService,
              private userService: UserService,
              private snackbarService: HelpSnackbar,
              private eventService: EventService,
              private objectHelpService: ObjectHelpService,
              private dialog: MatDialog,
              private snackbar: MatSnackBar,
              private companyService: CompanyService,
              private router: Router,
              private dateService: DateService,
              private location: Location) {}

  public form: FormGroup;
  public temporaryForm: FormGroup;
  public attachmentLabel: string;
  public transactionLabel: string;
  public lines: any[];
  public activeLine: any = null;
  public activeIndex = 0;
  public displayLines = false;
  public errors: any[] = [];
  public shortcuts: ShortcutInput[];
  public help = false;
  public companyID: number;
  public paginationControl = new FormControl(1);
  public loader = true;
  public showErrors = false;
  public lineErrors: any[] = [];
  public invoiceDate = new FormControl();

  private attachmentID: number;
  private transactionID: number;
  private currentUser = this.userService.getCurrentUser();
  private dialogOpen = false;

  public isQA = false;

  datemask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild('startForm', { static: false })
  private startForm: ElementRef;

  @ViewChild(KeyboardShortcutsComponent, { static: true })
  private keyboard: KeyboardShortcutsComponent;

  @Input() capture: any;

  public init() {
    if (this.capture) {
      this.attachmentID = this.capture.attachmentID;
      this.transactionID = this.capture.transactionID;
      this.attachmentLabel = this.capture.docType;
      this.transactionLabel = this.capture.transactionType;
      this.load();
    }
  }
  // Validators.pattern('[12]\d{3}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])')
  public submissionEvent =
    (escalation, saveProgress, escalationResolved) => this.submit(this.form, escalation, saveProgress, escalationResolved)

  ngOnInit() {
    this.form = new FormGroup({
      userID: new FormControl(null),
      invoiceID: new FormControl(null),
      invoiceNo: new FormControl(null, [Validators.required]),
      companyID: new FormControl(null, [Validators.required]),
      seededCompanyID: new FormControl(null),
      freightCost: new FormControl(null),
      insuranceCost: new FormControl(null),
      bankCharges: new FormControl(null),
      pop: new FormControl(false),
      currencyID: new FormControl(null, [Validators.required]),
      attachmentStatusID: new FormControl(null),
      invoiceDate: new FormControl(null, [Validators.required]),
      incoTermTypeID: new FormControl(null),
      cooID: new FormControl(null),
      isDeleted: new FormControl(0),
      qaUserID: new FormControl(-1),

      invoiceNoOBit: new FormControl(null),
      invoiceNoOUserID: new FormControl(null),
      invoiceNoODate: new FormControl(null),
      invoiceNoOReason: new FormControl(null),
      currencyIDOBit: new FormControl(null),
      currencyIDOUserID: new FormControl(null),
      currencyIDODate: new FormControl(null),
      currencyIDOReason: new FormControl(null),
    });

    this.temporaryForm = new FormGroup({
      invoiceID: new FormControl(null),
      invoiceNo: new FormControl(null, [Validators.required]),
      companyID: new FormControl(null, [Validators.required]),
      seededCompanyID: new FormControl(null),
      freightCost: new FormControl(null),
      insuranceCost: new FormControl(null),
      bankCharges: new FormControl(null),
      pop: new FormControl(false),
      currencyID: new FormControl(null, [Validators.required]),
      invoiceDate: new FormControl(null, [Validators.required]),
      incoTermTypeID: new FormControl(null),
      cooID: new FormControl(null),
    });

    this.companyService.observeCompany()
      .subscribe(res => {
        this.companyID = res.companyID;
      });

    this.paginationControl.valueChanges.subscribe((value) => {
      if (value && value !== null && value == '') {
        if (value > this.lines.length) {
          value = this.lines.length;
          this.paginationControl.setValue(this.lines.length);
        } else if (value <= 0) {
          this.paginationControl.setValue(1);
        } else {
          this.activeIndex = value - 1;
          this.activeLine = this.lines[this.activeIndex];
        }
      } else {
        this.paginationControl.setValue(1);
      }
    });

    this.invoiceDate.valueChanges.subscribe((value) => {
      if (value) {
        if (value.length === 8) {
          // tslint:disable-next-line: max-line-length
          this.form.controls.invoiceDate.setValue(new Date(`${value[4]}${value[5]}/${value[6]}${value[7]}/${value[0]}${value[1]}${value[2]}${value[3]}`));
          console.log(this.form.controls.invoiceDate.value);
        }
      }
    });

    this.form.controls.invoiceNo.valueChanges.subscribe((value) => {
      if (value && this.form.controls.qaUserID.value !== -1) {
        if (value !== this.temporaryForm.controls.invoiceNo.value) {
          this.form.controls.invoiceNo.setErrors({ noMatch: true });
        } else {
          this.form.controls.invoiceNo.setErrors(null);
        }
      }
    });

    this.form.controls.invoiceDate.valueChanges.subscribe((value) => {
      if (value && this.form.controls.qaUserID.value !== -1) {
        if (value !== this.temporaryForm.controls.invoiceDate.value) {
          this.form.controls.invoiceDate.setErrors({ noMatch: true });
        } else {
          this.form.controls.invoiceDate.setErrors(null);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
        this.shortcuts = [
          {
            key: 'alt + .',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => this.nextLine()
          },
          {
            key: 'alt + ,',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => this.prevLine()
          },
          {
            key: 'alt + c',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => this.cancelLine()
          },
          {
            key: 'alt + v',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => this.deleteLinePrompt()
          },
          {
            key: 'alt + /',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => console.log('Deprecated')
          },
          {
            key: 'alt + m',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => {
              this.displayLines = false;
              setTimeout(() => this.startForm.nativeElement.focus());
            }
          },
          {
            key: 'alt + n',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => {
              this.activeLine = null;
              this.activeIndex = -1;
              this.refresh();
            }
          },
          {
            key: 'alt + k',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: (e) => this.eventService.focusForm.next(),
          },
          {
            key: 'alt + s',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => {
                {
                  if (!this.dialogOpen) {
                    this.dialogOpen = true;
                    this.dialog.open(SubmitDialogComponent).afterClosed().subscribe((status: boolean) => {
                      this.dialogOpen = false;
                      if (status) {
                        this.submit(this.form);
                      }
                    });
                  }
                }
            }
          },
          {
            key: 'alt + l',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => {
              this.displayLines = !this.displayLines;
              setTimeout(() => this.startForm.nativeElement.focus());
            }
          },
          {
            key: 'alt + j',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: (e) => {
              this.dialog.open(DialogGotoLineComponent, {
                data: this.lines ? this.lines.length : 0,
                width: '256'
              }).afterClosed().subscribe((num: number) => {
                if (num) {
                  this.activeIndex = num - 1;
                  this.activeLine = this.lines[this.activeIndex];
                  this.paginationControl.setValue(this.activeIndex + 1, { emitEvent: false });
                  this.refresh();
                }
              });
            }
          },
          {
              key: 'ctrl + alt + h',
              preventDefault: true,
              allowIn: [AllowIn.Textarea, AllowIn.Input],
              command: e => {
                this.toggelHelpBar();
              }
            },
            {
              key: 'alt + a',
              preventDefault: true,
              allowIn: [AllowIn.Textarea, AllowIn.Input],
              command: e => {
                if (this.displayLines) {
                  this.eventService.submitLines.next();
                }
              }
            },
            {
              key: 'alt + c',
              preventDefault: true,
              allowIn: [AllowIn.Textarea, AllowIn.Input],
              command: e => {
                if (this.displayLines) {
                  this.cancelLine();
                }
              }
            },
            {
              key: 'alt + t',
              preventDefault: true,
              allowIn: [AllowIn.Textarea, AllowIn.Input],
              command: e => {
                this.showErrors = !this.showErrors;
              }
            }];
    });
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

  async load() {
    const request = {
      invoiceID: this.attachmentID,
      userID: this.currentUser.userID,
      rowStart: 1,
      rowEnd: 15,
      filter: '',
      orderBy: '',
      orderByDirection: '',
      transactionID: this.transactionID
    };

    this.captureService.invoiceList(request).then(async (res: InvoiceGetResponse) => {

      if (res.invoices.length > 0) {
      const response: any = res.invoices[0];
      console.log(response);
      response.invoiceID = res.invoices[0].invoiceID;
      response.incoTermTypeID = res.invoices[0].incoID;

      this.form.patchValue(response, { emitEvent: false });
      this.form.controls.userID.setValue(this.currentUser.userID, { emitEvent: false });
      this.form.controls.attachmentStatusID.setValue(res.invoices[0].statusID, { emitEvent: false });
      this.form.updateValueAndValidity();

      this.temporaryForm.patchValue(response);
      this.temporaryForm.updateValueAndValidity();

      const invoiceDate = this.dateService.getUTC(new Date(res.invoices[0].invoiceDate));

      if (invoiceDate.getFullYear() < 2000) {
        invoiceDate.setFullYear(2020);
      }

      this.form.controls.invoiceDate.setValue(invoiceDate);
      this.invoiceDate.setValue(
        `${invoiceDate.getFullYear()}-${this.leadingZero(invoiceDate.getMonth() + 1)}-${this.leadingZero(invoiceDate.getDate())}`
        , { emitEvent: false });

      console.log(`${invoiceDate.getFullYear()}-${this.leadingZero(invoiceDate.getMonth())}-${this.leadingZero(invoiceDate.getDate())}`);
      this.errors = res.attachmentErrors.attachmentErrors;

      Object.keys(this.form.controls).forEach(key => {
        if (key.indexOf('ODate') !== -1) {
          if (this.form.controls[key].value !== null || this.form.controls[key].value) {
            this.form.controls[key].setValue(null);
          }
        }
      });

      if (res.attachmentErrors.attachmentErrors.length > 0) {
        Object.keys(this.form.controls).forEach(key => {
          res.attachmentErrors.attachmentErrors.forEach((error) => {
            if (key.toUpperCase() === error.fieldName.toUpperCase()) {
              if (!this.form.controls[`${key}OBit`].value) {
                this.form.controls[key].setErrors({incorrect: true});
                this.form.controls[key].markAsTouched();
              }
            }
          });
        });
      }

      this.form.updateValueAndValidity();
      this.isQA = this.form.controls.qaUserID.value !== -1;

      if (this.isQA) {
        this.invoiceDate.reset();

        this.form.controls.invoiceNo.reset();
        this.form.controls.invoiceDate.reset();
        this.form.controls.freightCost.reset();
        this.form.controls.insuranceCost.reset();
        this.form.controls.bankCharges.reset();
        this.form.controls.pop.reset();

        this.form.controls.incoTermTypeID.reset();
        this.form.controls.cooID.reset();
        this.form.controls.currencyID.reset();
        this.form.controls.seededCompanyID.reset();
        this.form.controls.companyID.reset();
      }

      console.log(`======= QA USER ID ${this.isQA} =======`);
      this.loader = false;
      setTimeout(() => this.startForm.nativeElement.focus(), 100);
      await this.loadLines();
    } else {
      this.loader = false;
      this.snackbar.open('Failed to retrieve capture data', '', { duration: 3000 });
    }
    }, (err) => {
      this.loader = false;
    });
  }

  leadingZero(num: number): string {
    if (num < 10) {
      return `0${num}`;
    }

    return `${num}`;
  }

  async loadLines() {
    const requestModel = {
      userID: this.currentUser.userID,
      invoiceID: this.attachmentID,
      transactionID: this.transactionID,
      invoiceLineID: -1,
      filter: '',
      orderBy: '',
      orderByDirection: '',
      rowStart: 1,
      rowEnd: 1000,
    };

    this.captureService.invoiceLineList(requestModel).then(
      (res: InvoiceLinesResponse) => {
        console.log(res);

        this.lines = res.lines;
        this.lines.forEach((line) => {
          line.isLocal = false;
          line.invoiceID = this.attachmentID;
          line.uniqueIdentifier = UUID.UUID();
          line.errors = res.attachmentErrors.attachmentErrors.filter(x => x.attachmentID === line.invoiceLineID);
        });

        // tslint:disable-next-line: curly
        if (this.lines)
          if (this.lines.length > 0) {
            this.activeIndex = 0;
            this.activeLine = this.lines[this.activeIndex];
            this.paginationControl.setValue(1, { emitEvent: false });
          }  else {
            this.lines = [];
            this.newLine(true);
          }
      });
  }

  getError(key: string): string {
    return this.errors.find(x =>
      x.fieldName.toUpperCase() === key.toUpperCase()) ?
      this.errors.find(x => x.fieldName.toUpperCase() === key.toUpperCase()).errorDescription : '';
  }

  async submit(form: FormGroup, escalation?: boolean, saveProgress?: boolean, escalationResolved?: boolean) {
    form.markAllAsTouched();

    const keys = Object.keys(form.controls);

    keys.forEach((key) => {
      if (form.controls[key].hasError('noMatch')) {
        form.controls[key].setErrors(null);
      }
    });

    form.updateValueAndValidity();

    if ((form.valid && this.lines.length > 0) || escalation || saveProgress || escalationResolved) {
      const requestModel = form.value;
      let statusID = 2;

      if (escalation || (saveProgress && requestModel.attachmentStatusID === 7)) {
        statusID = 7;
      } else if (escalationResolved) {
        statusID = 8;
      } else if (saveProgress) {
        statusID = 2;
      } else {
        statusID = 3;
      }

      if (this.form.controls.qaUserID.value === -1
        && !escalation
        && !saveProgress
        && !escalationResolved) {

        requestModel.attachmentStatusID = 11;
      } else if (this.form.controls.qaUserID.value !== -1) {

        if (saveProgress) {
          requestModel.attachmentStatusID = 11;
        } else {
          requestModel.attachmentStatusID = 3;
        }
      }

      requestModel.attachmentStatusID = statusID;
      requestModel.userID = this.currentUser.userID;
      requestModel.invoiceDate = this.dateService.getUTC(new Date(requestModel.invoiceDate));

      await this.captureService.invoiceUpdate(requestModel).then(
        async (res: Outcome) => {
          await this.saveLines(this.lines, async (line) => {
            line.isDeleted = 0;
            line.invoiceID = form.controls.invoiceID.value;
            line.userID = this.currentUser.userID;

            if (line.isLocal) {
              await this.captureService.invoiceLineAdd(line).then((res) => console.log(res),
                (msg) => this.snackbar.open('Failed to create line', '', { duration: 3000 }));
            }

            // else {
            //   await this.captureService.invoiceLineUpdate(line).then((res) => console.log(res),
            //   (msg) => this.snackbar.open('Failed to update line', '', { duration: 3000 }));
            // }
          });

          if (res.outcome === 'SUCCESS') {
            if (saveProgress) {
              this.snackbar.open('Progress Saved', '', { duration: 3000 });
              this.load();
            } else {
              this.notify.successmsg(res.outcome, res.outcomeMessage);
              if (this.currentUser.designation === 'Consultant') {
                this.router.navigate(['escalations']);
              } else {
                this.location.back();
              }
            }
          } else {
            this.notify.errorsmsg(res.outcome, res.outcomeMessage);
          }
        },
        (msg) => console.log(JSON.stringify(msg))
      );
    } else {
      this.snackbar.open('Please fill in header details as well as have at least one line', '', {duration: 3000});
      this.findInvalidControls(form);
    }
  }

  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
  }

  toggelHelpBar() {
    this.help = !this.help;
    this.objectHelpService.toggleHelp(this.help);
  }

  // [Line Controls]
  async queueLine($event: any) {
    let target = null;
    console.log($event);

    if (this.lines) {
      if (this.lines.length > 0) {
        target = this.lines.find(x => x.uniqueIdentifier === $event.uniqueIdentifier);
      }
    } else {
      this.lines = [];
    }

    $event.userID = this.currentUser.userID;

    if (!target) {
      $event.isLocal = true;
      $event.qaComplete = true;
      this.lines.push($event);
      this.cancelLine();

      this.newLine(true);

      this.snackbar.open('Line added to queue', '', {duration: 3000});
    } else {
      $event.isLocal = false;
      const original = this.lines[this.lines.indexOf(target)];
      $event.invoiceLineID = original.invoiceLineID;
      $event.invoiceID = original.invoiceID;
      $event.qaComplete = true;

      $event.isDeleted = 0;
      $event.invoiceID = this.form.controls.invoiceID.value;
      $event.userID = this.currentUser.userID;

      await this.captureService.invoiceLineUpdate($event).then((res) => console.log(res),
      (msg) => this.snackbar.open('Failed to update line', '', { duration: 3000 }));

      this.lines[this.lines.indexOf(target)] = $event;
      this.activeLine = $event;

      // this.cancelLine();

      // this.newLine(true);

      this.refresh();

      // this.snackbar.open('Line queued to update', '', {duration: 3000});
    }

    // this.cancelLine();
  }

  async saveLines(lines: any[], callback) {
    for (let index = 0; index < lines.length; index++) {
      await callback(lines[index], index, lines);
    }
  }

  prevLine() {
    if (this.activeIndex >= 1) {
      this.activeIndex--;
      this.activeLine = this.lines[this.activeIndex];
      this.paginationControl.setValue(this.activeIndex + 1, { emitEvent: false });

      this.refresh();
    }
  }

  nextLine() {
    this.activeIndex++;

    if (this.activeIndex < (this.lines ? this.lines.length : 0)) {
      this.activeLine = this.lines[this.activeIndex];
      this.paginationControl.setValue(this.activeIndex + 1, { emitEvent: false });
      this.refresh();
    } else {
      this.activeIndex--;
    }
  }

  specificLine(index: number) {
    this.activeLine = this.lines[index];
    this.refresh();
  }

  newLine(norefresh) {
    this.activeLine = null;
    this.activeIndex = -1;

    if (!norefresh) {
      this.refresh();
    }
  }

  deleteLinePrompt() {
    this.dialog.open(DeletelineDialogComponent).afterClosed().subscribe( (status: boolean) => {
      if (status) {
        this.deleteLine();
      }
    });
  }

  async deleteLine() {
    const targetLine = this.lines[this.activeIndex];
    targetLine.isDeleted = 1;
    targetLine.invoiceID = this.attachmentID;

    if (!targetLine.isLocal) {
      await this.captureService.invoiceLineUpdate(targetLine);
    }

    if (this.lines.length === 1) {
      this.lines = [];
      this.activeLine = null;
      this.activeIndex = -1;
      this.paginationControl.setValue(1, { emitEvent: false });
    } else {
      this.lines.splice(this.lines.indexOf(targetLine), 1);
      this.activeIndex = 0;
      this.activeLine = this.lines[this.activeIndex];
      this.paginationControl.setValue(1, { emitEvent: false });
    }

    this.refresh();
  }

  cancelLine() {
    this.activeLine = null;
    this.activeIndex = 0;
    if (this.lines) {
      if (this.lines.length > 0) {
        this.activeLine = this.lines[this.activeIndex];
      }
    }

    this.refresh();
  }

  ngOnDestroy(): void {}

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


    this.form.controls[`${key}OBit`].setValue(true);
    this.form.controls[`${key}OReason`].setValue(reason);
    this.form.controls[key].setErrors(null);
  }

  undoOverride(key: string) {


    this.form.controls[`${key}OBit`].setValue(false);
    this.form.controls[`${key}OReason`].setValue(null);

    if (this.errors.length > 0) {
      this.errors.forEach((error) => {
        if (key.toUpperCase() === error.fieldName.toUpperCase()) {
          this.form.controls[key].setErrors({incorrect: true});
          this.form.controls[key].markAsTouched();
        }
      });
    }
  }

  refresh() {
    this.displayLines = false;
    this.loader = true;
    setTimeout(() => {
      this.displayLines = true;
      this.loader = false;
    }, 500);
  }
}
