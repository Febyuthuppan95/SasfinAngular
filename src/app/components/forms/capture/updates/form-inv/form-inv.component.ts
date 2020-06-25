import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, HostListener, Input } from '@angular/core';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { CaptureService } from 'src/app/services/capture.service';
import { UserService } from 'src/app/services/user.Service';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { EventService } from 'src/app/services/event.service';
import { ObjectHelpService } from 'src/app/services/ObjectHelp.service';
import { MatDialog, MatSnackBar } from '@angular/material';
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

@AutoUnsubscribe()
@Component({
  selector: 'app-form-inv',
  templateUrl: './form-inv.component.html',
  styleUrls: ['./form-inv.component.scss']
})
export class FormInvComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private transactionService: TransactionService,
              private captureService: CaptureService,
              private userService: UserService,
              private snackbarService: HelpSnackbar,
              private eventService: EventService,
              private objectHelpService: ObjectHelpService,
              private dialog: MatDialog,
              private snackbar: MatSnackBar,
              private companyService: CompanyService,
              private router: Router) {}

  public form: FormGroup;
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

  private attachmentID: number;
  private transactionID: number;
  private currentUser = this.userService.getCurrentUser();
  private dialogOpen = false;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

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
  public submissionEvent = (escalation) => this.submit(this.form, escalation);

  ngOnInit() {
    this.form = new FormGroup({
      userID: new FormControl(null),
      invoiceID: new FormControl(null),
      invoiceNo: new FormControl(null, [Validators.required]),
      companyID: new FormControl(null),
      currencyID: new FormControl(null, [Validators.required]),
      attachmentStatusID: new FormControl(null),
      invoiceDate: new FormControl(new Date(), [Validators.required]),
      incoTermTypeID: new FormControl(null),
      cooID: new FormControl(null),
      isDeleted: new FormControl(0),
      invoiceNoOBit: new FormControl(null),
      invoiceNoOUserID: new FormControl(null),
      invoiceNoODate: new FormControl(null),
      invoiceNoOReason: new FormControl(null),
    });

    // this.transactionService.observerCurrentAttachment()
    // .subscribe((capture: any) => {
    //   if (capture) {
    //     console.log(capture);
    //     this.attachmentID = capture.attachmentID;
    //     this.transactionID = capture.transactionID;
    //     this.attachmentLabel = capture.docType;
    //     this.transactionLabel = capture.transactionType;
    //     this.load();
    //   }
    // });

    this.companyService.observeCompany()
      .subscribe(res => {
        this.companyID = res.companyID;
      });

    // this.eventService.observeCaptureEvent()
    // .subscribe((escalation?: boolean) => this.submit(this.form, escalation));

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
            key: 'alt + /',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => alert('Focus form')
          },
          {
            key: 'alt + m',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => {
              this.activeLine = null;
              this.activeIndex = -1;
            }
          },
          {
            key: 'alt + n',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => {
              this.activeLine = null;
              this.activeIndex = -1;
            }
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
      const response: any = res.invoices[0];
      response.invoiceID = res.invoices[0].invoiceID;
      response.incoTermTypeID = res.invoices[0].incoID;

      this.form.patchValue(response);
      this.form.controls.userID.setValue(this.currentUser.userID);
      this.form.controls.invoiceDate.setValue(new Date(res.invoices[0].invoiceDate));
      this.errors = res.attachmentErrors.attachmentErrors;

      if (res.attachmentErrors.attachmentErrors.length > 0) {
        Object.keys(this.form.controls).forEach(key => {
          res.attachmentErrors.attachmentErrors.forEach((error) => {
            if (key.toUpperCase() === error.fieldName.toUpperCase()) {
              this.form.controls[key].setErrors({incorrect: true});
              this.form.controls[key].markAsTouched();
            }
          });
        });
      }

      this.form.updateValueAndValidity();
      await this.loadLines();
    });
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
        this.lines = res.lines;
        this.lines.forEach((line) => {
          line.isLocal = false;
          line.invoiceID = this.attachmentID;
          line.uniqueIdentifier = UUID.UUID();
          line.errors = res.attachmentErrors.attachmentErrors.filter(x => x.attachmentID === line.invoiceLineID);
        });

        if (this.lines.length > 0) {
            this.activeLine = this.lines[this.activeIndex];
        }
      });
  }

  getError(key: string): string {
    return this.errors.find(x => x.fieldName.toUpperCase() === key.toUpperCase()).errorDescription;
  }

  async submit(form: FormGroup, escalation?: boolean) {
    if ((form.valid && this.lines.length > 0) || escalation) {
      const requestModel = form.value;
      requestModel.attachmentStatusID = escalation ? 7 : 3;

      await this.captureService.invoiceUpdate(requestModel).then(
        async (res: Outcome) => {
          await this.saveLines(this.lines, async (line) => {
            line.isDeleted = 0;
            line.invoiceID = form.controls.invoiceID.value;
            line.userID = this.currentUser.userID;

            if (line.isLocal) {
              await this.captureService.invoiceLineAdd(line).then(
                (res: any) => console.log(res),
                (msg) => console.log(JSON.stringify(msg)));
            } else {
              await this.captureService.invoiceLineUpdate(line).then(
                (res) => console.log(res),
                (msg) => console.log(JSON.stringify(msg)));
            }
          });

          if (res.outcome === 'SUCCESS') {
            this.notify.successmsg(res.outcome, res.outcomeMessage);
            this.companyService.setCapture({ capturestate: true });
            this.router.navigateByUrl('transaction/capturerlanding');
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
  queueLine($event: any) {
    let target = null;

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
      this.lines.push($event);
      this.snackbar.open('Line added to queue', '', {duration: 3000});
    } else {
      $event.isLocal = false;
      const original = this.lines[this.lines.indexOf(target)];
      $event.invoiceLineID = original.invoiceLineID;
      $event.invoiceID = original.invoiceID;

      this.lines[this.lines.indexOf(target)] = $event;
      this.snackbar.open('Line queued to update', '', {duration: 3000});
    }

    this.cancelLine();
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
    }
  }

  nextLine() {
    if (this.activeIndex < this.lines.length) {
      this.activeIndex++;
      this.activeLine = this.lines[this.activeIndex];
      this.paginationControl.setValue(this.activeIndex + 1, { emitEvent: false });
    }
  }

  specificLine(index: number) {
    this.activeLine = this.lines[index];
  }

  newLine() {
    this.activeLine = null;
    this.activeIndex = -1;
  }

  async deleteLine() {
    const targetLine = this.lines[this.activeIndex];
    targetLine.isDeleted = 1;
    targetLine.invoiceLineID = this.form.controls.invoiceLineID.value;

    if (!targetLine.isLocal) {
      await this.captureService.invoiceLineUpdate(targetLine);
    }

    this.lines.splice(this.lines.indexOf(targetLine), 1);
    this.activeLine = null;
    this.activeIndex = -1;
  }

  cancelLine() {
    this.activeLine = null;
    this.activeIndex = 0;
    this.activeLine = this.lines[this.activeIndex];
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
    this.form.controls[`${key}OUserID`].setValue(this.currentUser.userID);
    this.form.controls[`${key}ODate`].setValue(new Date());
    this.form.controls[`${key}OBit`].setValue(true);
    this.form.controls[`${key}OReason`].setValue(reason);
    this.form.controls[key].setErrors(null);
  }

  undoOverride(key: string) {
    this.form.controls[`${key}OUserID`].setValue(null);
    this.form.controls[`${key}ODate`].setValue(new Date());
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
}
