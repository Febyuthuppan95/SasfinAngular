import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Input } from '@angular/core';
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
import { VOCListResponse } from 'src/app/models/HttpResponses/VOC';
import { SAD500Get } from 'src/app/models/HttpResponses/SAD500Get';
import { SPSAD500LineList } from 'src/app/models/HttpResponses/SAD500Line';
import { UUID } from 'angular2-uuid';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { DialogOverrideComponent } from '../../dialog-override/dialog-override.component';
import { CustomWorksheetLinesResponse } from 'src/app/models/HttpResponses/CustomWorksheetLine';
import { CustomsWorksheetListResponse } from 'src/app/models/HttpResponses/CustomsWorksheet';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-form-csw',
  templateUrl: './form-csw.component.html',
  styleUrls: ['./form-csw.component.scss']
})
export class FormCswComponent implements OnInit, OnDestroy, AfterViewInit {
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
  public activeLine: any;
  public activeIndex = 0;
  public displayLines = false;
  public errors: any[] = [];
  public shortcuts: ShortcutInput[];
  public help = false;
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
      this.isExport = this.capture.transactionType === 'Export' ? true : false;
      this.load();
    }
  }

  // tslint:disable-next-line: max-line-length
  public submissionEvent = (escalation, saveProgress, escalationResolved) => this.submit(this.form, escalation, saveProgress, escalationResolved);

  ngOnInit() {
    this.form = new FormGroup({
      userID: new FormControl(null),
      customworksheetID: new FormControl(null),
      transactionID: new FormControl(null),
      waybillNo: new FormControl(null, [Validators.required]),
      lrn: new FormControl(null, [Validators.required]),
      fileRef: new FormControl(null, [Validators.required]),
      attachmentStatusID: new FormControl(null),
      isDeleted: new FormControl(0),
      waybillNoOBit: new FormControl(null),
      waybillNoOUserID: new FormControl(null),
      waybillNoODate: new FormControl(null),
      waybillNoOReason: new FormControl(null),
      lrnOBit: new FormControl(null),
      lrnOUserID: new FormControl(null),
      lrnODate: new FormControl(null),
      lrnOReason: new FormControl(null),
      fileRefOBit: new FormControl(null),
      fileRefOUserID: new FormControl(null),
      fileRefODate: new FormControl(null),
      fileRefOReason: new FormControl(null),
    });

    // this.transactionService.observerCurrentAttachment()
    // .subscribe((capture: any) => {
    //   if (capture) {
    //     this.attachmentID = capture.attachmentID;
    //     this.transactionID = capture.transactionID;
    //     this.attachmentLabel = capture.docType;
    //     this.transactionLabel = capture.transactionType;
    //     this.isExport = capture.transactionType === 'Export' ? true : false;
    //     this.load();
    //   }
    // });

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
    this.loader = true;
    const request = {
      customsWorksheetID: this.attachmentID,
      userID: this.currentUser.userID,
      transactionID: this.transactionID,
      rowStart: 1,
      rowEnd: 15,
      filter: '',
      orderBy: '',
      orderByDirection: '',
    };

    this.captureService.customWorksheetList(request).then(async (res: CustomsWorksheetListResponse) => {
      if (res.customsWorksheets.length > 0) {
        this.loader = false;
        const response: any = res.customsWorksheets[0];
        response.userID = request.userID;
        response.customworksheetID = res.customsWorksheets[0].customWorksheetID;
        response.attachmentStatusID = response.statusID;

        this.form.patchValue(response);
        this.form.controls.userID.setValue(this.currentUser.userID);
        this.form.controls.customworksheetID.setValue(this.attachmentID);

        Object.keys(this.form.controls).forEach(key => {
          if (key.indexOf('ODate') !== -1) {
            if (this.form.controls[key].value !== null || this.form.controls[key].value) {
              this.form.controls[key].setValue(null);
            }
          }
        });

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

      } else {
        this.snackbar.open('Failed to retrieve capture data', '', { duration: 3000 });
      }
    }, (err) => {
      this.loader = false;
    });
  }

  async loadLines() {
    const requestModel = {
      userID: this.currentUser.userID,
      customsWorksheetID: this.attachmentID,
      rowStart: 1,
      rowEnd: 1000,
      orderBy: '',
      orderByDirection: '',
      filter: '',
      transactionID: this.transactionID,
    };

    this.captureService.customWorksheetLineList(requestModel).then(
      (res: CustomWorksheetLinesResponse) => {
        if (res.lines.length > 0) {
        this.lines = res.lines;
        this.lines.forEach((line) => {
          line.isLocal = false;
          line.customWorksheetID = this.form.controls.customworksheetID.value;
          line.uniqueIdentifier = UUID.UUID();
          line.errors = res.attachmentErrors.attachmentErrors.filter(x => x.attachmentID === line.sad500LineID);
        });

        this.activeIndex = 0;
        this.activeLine = this.lines[this.activeIndex];
        this.paginationControl.setValue(1, { emitEvent: false });
        } else {
          this.lines = [];
          this.newLine();
        }
      });
  }

  getError(key: string): string {
    return this.errors.find(x => x.fieldName.toUpperCase() === key.toUpperCase()).errorDescription;
  }

  async submit(form: FormGroup, escalation?: boolean, saveProgress?: boolean, escalationResolved?: boolean) {
    form.markAllAsTouched();

    if ((form.valid && this.lines.length > 0) || escalation) {
      const requestModel = form.value;
      // tslint:disable-next-line: max-line-length
      requestModel.attachmentStatusID = escalation ? 7 : (escalationResolved ? 8 : (saveProgress && requestModel.attachmentStatusID === 7 ? 7 : (saveProgress ? 2 : 3)));
      requestModel.userID = this.currentUser.userID;

      console.log(requestModel);

      await this.captureService.customWorksheetUpdate(requestModel).then(
        async (res: Outcome) => {
          await this.saveLines(this.lines, async (line) => {
            line.isDeleted = 0;
            line.userID = this.currentUser.userID;
            line.customsWorksheetID = this.attachmentID;

            if (line.isLocal) {
              await this.captureService.customWorksheetLineAdd(line);
            } else {
              await this.captureService.customWorksheetLineUpdate(line);
            }
          });

          if (res.outcome === 'SUCCESS') {
            if (saveProgress) {
              this.snackbar.open('Progress Saved', '', { duration: 3000 });
              this.load();
            } else {
              this.notify.successmsg(res.outcome, res.outcomeMessage);
              this.companyService.setCapture({ capturestate: true });
              this.router.navigateByUrl('transaction/capturerlanding');
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
  queueLine($event: any) {
    console.log($event);
    let target = null;

    if (this.lines) {
      if (this.lines.length > 0) {
        target = this.lines.find(x => x.uniqueIdentifier === $event.uniqueIdentifier);
      }
    } else {
      this.lines = [];
    }

    $event.userID = this.currentUser.userID;
    $event.customwsWorksheetID = this.attachmentID;

    if (!target) {
      $event.isLocal = true;
      this.lines.push($event);
      this.snackbar.open('Line added to queue', '', {duration: 3000});
    } else {
      $event.isLocal = false;
      const original = this.lines[this.lines.indexOf(target)];
      $event.customworksheetLineID = original.customworksheetLineID;

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
      this.displayLines = false;
      this.loader = true;
      setTimeout(() => {
        this.displayLines = true;
        this.loader = false;
      }, 1000);
    }
  }

  nextLine() {
    if (this.activeIndex < this.lines.length) {
      this.activeIndex++;
      this.activeLine = this.lines[this.activeIndex];
      this.paginationControl.setValue(this.activeIndex + 1, { emitEvent: false });
      this.displayLines = false;
      this.loader = true;
      setTimeout(() => {
        this.displayLines = true;
        this.loader = false;
      }, 1000);
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
    targetLine.customWorksheetID = this.attachmentID;

    if (!targetLine.isLocal) {
      await this.captureService.customWorksheetLineUpdate(targetLine);
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
