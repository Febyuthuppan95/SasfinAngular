import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Input } from '@angular/core';
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
import { FormC1LinesComponent } from './form-c1-lines/form-c1-lines.component';
import { SubmitDialogComponent } from 'src/app/layouts/capture-layout/submit-dialog/submit-dialog.component';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { ListReadResponse } from '../../form-invoice/form-invoice-lines/form-invoice-lines.component';
import { DialogOverrideComponent } from '../../dialog-override/dialog-override.component';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-form-c1',
  templateUrl: './form-c1.component.html',
  styleUrls: ['./form-c1.component.scss']
})
export class FormC1Component implements OnInit, OnDestroy, AfterViewInit {
  constructor(private captureService: CaptureService,
              private userService: UserService,
              private snackbarService: HelpSnackbar,
              private eventService: EventService,
              private objectHelpService: ObjectHelpService,
              private dialog: MatDialog,
              private snackbar: MatSnackBar,
              private companyService: CompanyService,
              private router: Router,
              private apiService: ApiService) {}

  public form = new FormGroup({
    userID: new FormControl(null),
    SupplierC1ID: new FormControl(null, [Validators.required]),
    TransactionID: new FormControl(null, [Validators.required]),
    // PeriodYear: new FormControl(null, [Validators.required]),
    // QuarterID: new FormControl(null, [Validators.required]),
    CompanyID: new FormControl(null, [Validators.required]),
    // SupplierName: new FormControl(null, [Validators.required]),
    IsDeleted: new FormControl(0),
    AttachmentStatusID: new FormControl(null)
  });

  public attachmentLabel: string;
  public transactionLabel: string;
  public lines: any[];
  public activeLine: any;
  public activeIndex = 0;
  public displayLines = false;
  public errors: any[] = [];
  public shortcuts: ShortcutInput[];
  public help = false;
  public isVOC = false;
  public isExport = false;
  public paginationControl = new FormControl(1);
  public loader = true;

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

  // tslint:disable-next-line: max-line-length
  public submissionEvent = (escalation, saveProgress, escalationResolved) => this.submit(this.form, escalation, saveProgress, escalationResolved);

  ngOnInit() {
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
    const requestParams = {
      userID: this.currentUser.userID,
      SupplierC1ID: this.attachmentID,
      TransactionID: this.transactionID,
    };

    this.captureService.post({ request: requestParams, procedure: 'SupplierC1List' }).then(
      async (res: ListReadResponse) => {
      this.loader = false;
      console.log(res);

      if (res.data !== null) {
        this.form.patchValue(res.data[0]);
        this.form.controls.userID.setValue(this.currentUser.userID);

        this.form.updateValueAndValidity();
        await this.loadLines();
      } else {
        this.snackbar.open('Failed to retrieve capture data', '', { duration: 3000 });
      }
    }, (err) => {
      this.loader = false;
    });
  }

  async loadLines() {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        SupplierC1ID: this.form.controls.SupplierC1ID.value,
        filter:  '',
        orderBy: '',
        orderByDirection: '',
        rowStart: 1,
        rowEnd: 1000000,
      },
      requestProcedure: 'SupplierC1LineList'
    };

    this.captureService.post({ request: model.requestParams, procedure: model.requestProcedure }).then(
      async (res: ListReadResponse) => {
        console.log(res);
        this.lines = res.data;
        this.lines.forEach((line) => {
          line.isLocal = false;
          line.SupplierC1ID = this.form.controls.SupplierC1ID.value,
          line.uniqueIdentifier = UUID.UUID();
        });

        if (this.lines.length > 0) {
          this.activeIndex = 0;
          this.activeLine = this.lines[this.activeIndex];
          this.paginationControl.setValue(1, { emitEvent: false });
        } else {
          this.lines = [];
          this.newLine();
        }
      });
  }

  /* TODO */
  async submit(form: FormGroup, escalation?: boolean, saveProgress?: boolean, escalationResolved?: boolean) {
    form.markAllAsTouched();

    if ((form.valid && this.lines.length > 0) || escalation) {
      const request = form.value;
      // tslint:disable-next-line: max-line-length
      request.AttachmentStatusID = escalation ? 7 : (escalationResolved ? 8 : (saveProgress && request.AttachmentStatusID === 7 ? 7 : (saveProgress ? 2 : 3)));
      request.userID = this.currentUser.userID;

      await this.captureService.post({ request, procedure: 'SupplierC1Update' }).then(
        async (res: { data: any[], outcome: boolean, outcomeMessage: string, rowCount: number }) => {
          await this.saveLines(this.lines, async (line) => {
            const lineRequest = line;
            delete lineRequest.RowNum;
            delete lineRequest.isLocal;
            delete lineRequest.uniqueIdentifier;
            delete lineRequest.ItemName;
            delete lineRequest.SupplierItem;
            delete lineRequest.SupplierName;

            line.IsDeleted = 0;
            line.userID = this.currentUser.userID;

            console.log(line);

            if (line.SupplierC1LineID === -1) {
              delete lineRequest.SupplierC1LineID;
              delete lineRequest.IsDeleted;
              console.log(lineRequest);
              await this.captureService
                .post({ request: lineRequest, procedure: 'SupplierC1LineAdd' })
                .then((response: any) => console.log(JSON.stringify(response)), (msg) => console.log(JSON.stringify(msg)));
            } else {
              await this.captureService
                .post({ request: lineRequest, procedure: 'SupplierC1LineUpdate' })
                .then((response) => console.log(response), (msg) => console.log(JSON.stringify(msg)));
            }
          });

          if (res.outcome) {
            if (saveProgress) {
              this.snackbar.open('Progress Saved', '', { duration: 3000 });
              this.load();
            } else {
              this.notify.successmsg('SC1 Submitted', res.outcomeMessage);
              this.companyService.setCapture({ capturestate: true });
              this.router.navigateByUrl('transaction/capturerlanding');
            }
          } else {
            this.notify.errorsmsg('Failed to submit SC1', res.outcomeMessage);
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

      this.refresh();
      this.snackbar.open('Line added to queue', '', {duration: 3000});
    } else {
      $event.isLocal = false;
      const original = this.lines[this.lines.indexOf(target)];
      $event.SupplierC1LineID = original.SupplierC1LineID;
      $event.SupplierC1ID = this.attachmentID;

      this.refresh();
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

      this.refresh();
    }
  }

  nextLine() {
    if (this.activeIndex < this.lines.length) {
      this.activeIndex++;
      this.activeLine = this.lines[this.activeIndex];
      this.paginationControl.setValue(this.activeIndex + 1, { emitEvent: false });

      this.refresh();
    }
  }

  specificLine(index: number) {
    this.activeLine = this.lines[index];
    this.refresh();
  }

  newLine() {
    this.activeLine = null;
    this.activeIndex = -1;
    this.refresh();
  }

  async deleteLine() {
    const targetLine = this.lines[this.activeIndex];
    targetLine.isDeleted = 1;
    targetLine.saD500ID = this.form.controls.SAD500ID.value;

    if (!targetLine.isLocal) {
      await this.captureService.post({ request: targetLine, procedure: 'SupplierC1LineUpdate' });
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
    this.activeLine = this.lines[this.activeIndex];
    this.refresh();
  }

  ngOnDestroy(): void {}

  refresh() {
    this.displayLines = false;
    this.loader = true;
    setTimeout(() => {
      this.displayLines = true;
      this.loader = false;
    }, 500);
  }
}


export class SupplierC1 {
  TransactionID: number;
  CompanyID: number;
  SupplierName: string;
  CertificateNo: string;
  AttachmentStatusID: number;
  AttachmentStatus: string;
}

export class SupplierC1Line {
  LineNo: number;
  ItemID: number;
  ItemName: string;
  ItemDescription: string;
  UOM: string;
  UOMID: number;
  UnitPrice: number;
  ImportedComponentValue?: number;
}
