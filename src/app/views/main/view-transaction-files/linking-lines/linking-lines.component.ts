import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { KeyboardShortcutsComponent, ShortcutInput, AllowIn } from 'ng-keyboard-shortcuts';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { TransactionFileListResponse } from 'src/app/models/HttpResponses/TransactionFileListModel';
import { ApiService } from 'src/app/services/api.service';
import { CaptureService } from 'src/app/services/capture.service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { UserService } from 'src/app/services/user.Service';
import { environment } from 'src/environments/environment';
import { CustomsLineLinkComponent } from './customs-line-link/customs-line-link.component';
import { InvoiceLineLinkComponent } from './invoice-line-link/invoice-line-link.component';
import { Location } from '@angular/common';
import { DialogConfirmationComponent } from './dialog-confirmation/dialog-confirmation.component';
import { DialogOverrideComponent } from 'src/app/components/forms/capture/dialog-override/dialog-override.component';
import { DialogReturnAttachmentComponent } from './dialog-return-attachment/dialog-return-attachment.component';

enum TotalStatus {
  Passed,
  Failed,
  None
}

@AutoUnsubscribe()
@Component({
  selector: 'app-linking-lines',
  templateUrl: './linking-lines.component.html',
  styleUrls: ['./linking-lines.component.scss']
})
export class LinkingLinesComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private transationService: TransactionService,
    private capture: CaptureService,
    private user: UserService,
    private api: ApiService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private location: Location,
    private render: Renderer2) { }

  public transaction: string;
  public transactionType: string;
  public transactionID: number;
  public currentSAD: any;
  public currentINV: any;
  public currentCWS: any;
  public totalStatuses = TotalStatus;

  public sadLines: any[] = [];
  public invLines: any[] = [];
  public cwsLines: any[] = [];
  public sadLinesTemp: any[] = [];
  public invLinesTemp: any[] = [];
  public cwsLinesTemp: any[] = [];
  public attachments: any[] = [];
  public captureJoins: any[] = [];
  public allCaptureJoins: any[] = [];

  public units: any[] = [];
  public countries: any[] = [];
  public items: any[] = [];

  public currentPDFSource: string;
  public currentAttachment: any;
  public currentPDFIndex: number;
  public showHelp = false;

  public warning: any;
  public loading = false;

  private pdfWrapper: HTMLElement;
  private scrollTop = 0;
  private scrollLeft = 0;

  private currentUser: any = this.user.getCurrentUser();
  public consultant =
  this.user.getCurrentUser().designation.toUpperCase() === 'CONSULTANT' ||
  this.user.getCurrentUser().designation.toUpperCase() === 'ADMIN';

  currentReaderPOS: { x: number, y: number } = {
    x: 0,
    y: 64,
  };

  @ViewChild(KeyboardShortcutsComponent, { static: true })
  private keyboard: KeyboardShortcutsComponent;

  shortcuts: ShortcutInput[] = [];

  @ViewChild('startLines', { static: false }) firstLine: any;

  ngOnInit(): void {
    this.transationService.observerCurrentAttachment()
    .subscribe((data) => {
      if (data) {
        this.transactionID = +data.transactionID;
        this.transactionType = data.transactionType;
        this.transaction = data.transactionName;

        this.init();
      }
    });
  }

  groupBy(xs, key) {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  requestFullscreen() {
    const el = document.documentElement as HTMLElement & {
      mozRequestFullScreen(): Promise<void>;
      webkitRequestFullscreen(): Promise<void>;
      msRequestFullscreen(): Promise<void>;
    };

    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.mozRequestFullScreen) { /* Firefox */
      el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) { /* IE/Edge */
      el.msRequestFullscreen();
    }
  }

  exitFullscreen() {
    const el = document as Document & {
      mozCancelFullScreen(): Promise<void>;
      webkitExitFullscreen(): Promise<void>;
      msExitFullscreen(): Promise<void>;
    };

    if (el.exitFullscreen) {
      el.exitFullscreen();
    } else if (el.mozCancelFullScreen) { /* Firefox */
      el.mozCancelFullScreen();
    } else if (el.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      el.webkitExitFullscreen();
    } else if (el.msExitFullscreen) { /* IE/Edge */
      el.msExitFullscreen();
    }
  }

  ngAfterViewInit(): void {
    this.requestFullscreen();

    this.shortcuts.push(
        {
            key: 'alt + l',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => {
              const element = this.render.selectRootElement('#startLine');
              setTimeout(() => element.focus(), 0);
            }
        },
        {
          key: 'alt + .',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => {
            // Next Document
            if (this.currentPDFIndex + 1 < this.attachments.length) {
              this.currentPDFIndex++;
              this.currentPDFSource = undefined;
              setTimeout(() => {
                this.currentPDFSource = btoa(this.attachments[this.currentPDFIndex].file);
                this.currentAttachment = this.attachments[this.currentPDFIndex]
              });            }
          }
        },
        {
          key: 'alt + h',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => this.showHelp = !this.showHelp
        },
        {
          key: 'alt + ,',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => {
              // Previous Document
              if (this.currentPDFIndex - 1 >= 0) {
                this.currentPDFIndex--;
                this.currentPDFSource = undefined;
                setTimeout(() => {
                  this.currentPDFSource = btoa(this.attachments[this.currentPDFIndex].file);
                  this.currentAttachment = this.attachments[this.currentPDFIndex]
                });
              }
          }
      },
      {
        key: 'alt + q',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: e => {
          this.dialog.open(DialogConfirmationComponent, {
            data: {
              title: 'Quit',
              message: 'Are you sure you want to quit?'
            },
            width: '512px'
          }).afterClosed().subscribe((state) => {
            if (state) {
              this.location.back();
            }
          });
        }
      },
      {
        key: 'alt + s',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: e => {
          if (this.consultant) {
            this.dialog.open(DialogConfirmationComponent, {
              data: {
                title: 'Approve',
                message: 'Are you sure you want to approve this transaction?'
              },
              width: '512px'
            }).afterClosed().subscribe((state) => {
              if (state) {
                this.approve();
              }
            });
          } else {
            this.dialog.open(DialogConfirmationComponent, {
              data: {
                title: 'Submit',
                message: 'Are you sure you want to submit this transaction?'
              },
              width: '512px'
            }).afterClosed().subscribe((state) => {
              if (state) {
                this.submitToConsultant();
              }
            });
          }
        }
      },
      {
        key: 'alt + 2',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: e => this.currentReaderPOS.y = this.currentReaderPOS.y + 15,
      },
      {
        key: 'alt + [',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: e => this.currentReaderPOS.y = this.currentReaderPOS.y + 15,
      },
      {
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: e => this.currentReaderPOS.y = this.currentReaderPOS.y - 15,
        key: 'alt + 8',
      },
      {
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: e => this.currentReaderPOS.y = this.currentReaderPOS.y - 15,
        key: 'alt + ]',
      },
      {
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: e => {
          const id = +this.currentAttachment.attachmentID;
          const type = this.currentAttachment.fileType;

          this._returnAttachmentDialog(type, id);
        },
        key: 'alt + b',
      },
      {
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: e => {
          this.scrollTop += 24;

          const total = this.scrollTop + this.pdfWrapper.clientHeight;

          if (total > this.pdfWrapper.scrollHeight) {
            this.scrollTop = (this.pdfWrapper.scrollHeight - this.pdfWrapper.clientHeight);
          }

          this.pdfWrapper.scrollTo({ top: this.scrollTop, behavior: 'smooth' });

        },
        key: 'alt + 3',
      },
      {
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: e => {
          this.scrollTop -= 24;

          if (this.scrollTop <= 0) { this.scrollTop = 0; }

          this.pdfWrapper.scrollTo({ top: this.scrollTop, behavior: 'smooth' });
        },
        key: 'alt + 9',
      },
      {
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: e => {
          this.scrollLeft += 24;

          const total = this.scrollLeft + this.pdfWrapper.clientWidth;

          if (total > this.pdfWrapper.scrollWidth) {
            this.scrollLeft = (this.pdfWrapper.scrollWidth - this.pdfWrapper.clientWidth);
          }

          this.pdfWrapper.scrollTo({ left: this.scrollLeft, behavior: 'smooth' });

        },
        key: 'alt + 4',
      },
      {
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: e => {
          this.scrollLeft -= 24;

          if (this.scrollLeft <= 0) { this.scrollLeft = 0; }

          this.pdfWrapper.scrollTo({ left: this.scrollLeft, behavior: 'smooth' });
        },
        key: 'alt + 6',
      },
    );

    this.keyboard.select('cmd + f').subscribe(e => console.log(e));
    this.pdfWrapper = document.getElementById('pdfWrapper');
  }

  async init() {
    this.loading = true;
    await this.loadUnits();
    await this.loadCountry();
    await this.loadItems();

    await this.loadAttachments();
    this.loading = false;
  }

  async loadUnits() {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        filter: '',
      },
      requestProcedure: 'UnitOfMeasuresList'
    };

    await this.api.post(`${environment.ApiEndpoint}/capture/read/list`, model).then(
      (res: any) => {
        this.units = res.data;
    });
  }

  async loadCountry() {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        filter: '',
      },
      requestProcedure: 'CountriesList'
    };

    await this.api.post(`${environment.ApiEndpoint}/capture/read/list`, model).then(
      (res: any) => {
        this.countries = res.data;
    });
  }

  async loadItems() {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        filter: '',
      },
      requestProcedure: 'ItemsList'
    };

    await this.api.post(`${environment.ApiEndpoint}/capture/read/list`, model).then(
      (res: any) => {
        this.items = res.data;
    });
  }

  async loadAttachments() {
    const model = {
      filter: '',
      userID: this.currentUser.userID,
      specificTransactionID: this.transactionID,
      specificAttachmentID: -1,
      rowStart: 1,
      rowEnd: 25,
      orderBy: '',
      orderByDirection: ''
    };

    await this.transationService
      .listAttatchments(model)
      .then(
        async (res: TransactionFileListResponse) => {
          this.attachments = res.attachments;

          this.attachments.forEach((attach) => {
            if (attach !== undefined) {
              attach.statusID === 1 ? attach.tooltip = 'Pending Capture' : console.log() ;
              attach.statusID === 2 ? attach.tooltip = 'In Capture' : console.log() ;
              attach.statusID === 3 ? attach.tooltip = 'Capture not Evaluated' : console.log() ;
              attach.statusID === 4 ? attach.tooltip = 'In Evaluation' : console.log() ;
              attach.statusID === 5 ? attach.tooltip = 'Assess Succeeded' : console.log() ;
              attach.statusID === 6 ? attach.tooltip = 'Assess Failed' : console.log() ;
              attach.statusID === 7 ? attach.tooltip = 'Escalated' : console.log() ;
              attach.statusID === 8 ? attach.tooltip = 'Escalation Resolved' : console.log() ;
              attach.statusID === 9 ? attach.tooltip = 'Override Capture' : console.log() ;
            }
          });

          this.attachments = this.attachments
            .filter(x => x.fileTypeID === 2 || x.fileTypeID === 5 || x.fileTypeID === 7);

          this.currentPDFIndex = 0;
          this.currentAttachment = this.attachments[this.currentPDFIndex];
          this.currentPDFSource =  btoa(this.attachments[this.currentPDFIndex].file);

          await this.loadSADLines();
        });
  }

  async loadSADLines() {
    this.currentSAD = await this.capture.sad500Get({
      userID: this.currentUser.userID,
      transactionID: this.transactionID,
      specificID: -1,
      fileType: 'SAD',
    });

    await this.capture.sad500LineList({
      sad500ID: this.currentSAD.customReleaseID,
      userID: this.currentUser.userID,
      transactionID: this.transactionID,
      specificSAD500LineID: -1,
      filter:  '',
      orderBy: '',
      orderByDirection: '',
      rowStart: 1,
      rowEnd: 1000000 }).then(
      async (res: any) => {
        this.sadLinesTemp = res.lines;

        await this.iterate(this.sadLinesTemp, async (el, i) => {
          this.sadLinesTemp[i].unit = this.units.find(x => x.UnitOfMeasureID == el.unitOfMeasureID);
          this.sadLinesTemp[i].country = this.countries.find(x => x.CountryID == el.cooID);
        });

        this.sadLines = [...this.sadLinesTemp];

        await this.loadInvoiceLines();
      }
    );
  }

  async loadInvoiceLines() {
    this.loading = true;

    this.currentINV = await this.capture.invoiceList({
      invoiceID: -1,
      userID: this.currentUser.userID,
      transactionID: this.transactionID,
      invoiceLineID: -1,
      filter: '',
      orderBy: '',
      orderByDirection: '',
      rowStart: 1,
      rowEnd: 1000,
    });

    await this.iterate(this.currentINV.invoices, async (invoice) => {
      await this.capture.invoiceLineList({
        invoiceID: invoice.invoiceID,
        invoiceLineID: -1,
        userID: this.currentUser.userID,
        transactionID: this.transactionID,
        filter:  '',
        orderBy: '',
        orderByDirection: '',
        rowStart: 1,
        rowEnd: 1000000 }).then(
        async (res: any) => {
          this.invLinesTemp = [...res.lines];

          await this.iterate(this.invLinesTemp, (el) => {
            el.invoiceID = invoice.invoiceID;
            el.invoiceNo = invoice.invoiceNo;
            el.type = 'inv';
            el.items = this.items.find(x => x.ItemID == el.itemID);
            el.unit = this.units.find(x => x.UnitOfMeasureID == el.unitOfMeasureID);
            el.currency = 'this';
          });

          this.invLines = [...this.invLinesTemp];

          await this.loadWorksheetLines();
        }
      );
    });
  }

  async loadWorksheetLines() {
    this.currentCWS = await this.capture.customWorksheetList({
      customsWorksheetID: -1,
      userID: this.currentUser.userID,
      transactionID: this.transactionID,
      rowStart: 1,
      rowEnd: 15,
      filter: '',
      orderBy: '',
      orderByDirection: '',
    });

    await this.capture.customWorksheetLineList({
      userID: this.currentUser.userID,
      customsWorksheetID: this.currentCWS.customsWorksheets[0].customWorksheetID,
      rowStart: 1,
      rowEnd: 1000,
      orderBy: '',
      orderByDirection: '',
      filter: '',
      transactionID: this.transactionID, }).then(
      async (res: any) => {
        this.cwsLinesTemp = res.lines;

        await this.iterate(this.cwsLinesTemp, async (el, i) => {
          this.cwsLinesTemp[i].type = 'cws';
          this.cwsLinesTemp[i].country = this.countries.find(x => x.CountryID == this.cwsLinesTemp[i].cooID);
          this.cwsLinesTemp[i].unit = this.units.find(x => x.UnitOfMeasureID == this.cwsLinesTemp[i].unitOfMeasureID);
        });

        this.cwsLines = [...this.cwsLinesTemp];

        await this.loadCaptureJoins();
      }
    );
  }

  async loadCaptureJoins() {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        transactionID: this.transactionID,
        filter: '',
        rowStart: 1,
        rowEnd: 1000,
        orderBy: '',
        orderByDirection: ''
      },
      requestProcedure: 'CaptureJoinsList'
    };

    await this.api.post(`${environment.ApiEndpoint}/checking/read`, model).then(
      async (res: any) => {
        this.allCaptureJoins = res.data;

        await this.iterate(this.sadLines, async (item, i) =>  {
          const exists = this.allCaptureJoins.find(x => x.SAD500LineID == this.sadLines[i].sad500LineID && x.CustomsValueOBit);

          if (exists) {
            this.sadLines[i].OBit = true;
            this.sadLines[i].OReason = exists.CustomsValueOReason;
          }

          const foreign = this.allCaptureJoins.find(x => x.SAD500LineID == this.sadLines[i].sad500LineID && x.ForeignInvoiceOBit);

          if (foreign) {
            this.sadLines[i].ForeignOBit = true;
            this.sadLines[i].ForeignOReason = exists.ForeignInvoiceOReason;
          }
        });

        this.loading = false;

        await this.evaluate();
    });
  }

  findCustomsWorksheetLine(array, value) {
    let found;

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < array.length; i++) {
      if (array[i].customWorksheetLineID == value) {
        found = JSON.parse(JSON.stringify(array[i]));
      }
    }

    return found;
  }

  async iterate(list, callback) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < list.length; i++) {
      await callback(list[i], i);
    }
  }

  previewCapture(src: string, id: number) {
    const myWindow = window.open(
      `${environment.appRoute}/documentpreview/${btoa(src)}`,
      '_blank',
      'width=600, height=800, noreferrer'
    );

    myWindow.opener = null;
  }

  async approve() {
    await this.api.post(`${environment.ApiEndpoint}/capture/post`, {
      request: {
        transactionID: this.transactionID,
      },
      procedure: 'TransactionReady'
    }).then(
      (res: any) => {
        if (res.outcome) {
          this.snackbar.open('Transaction set to "Ready"', '', { duration: 3000 });
          this.location.back();
        }
      },
    );
  }

  async submitToConsultant() {
    await this.api.post(`${environment.ApiEndpoint}/capture/post`, {
      request: {
        transactionID: this.transactionID,
        userID: this.currentUser.userID,
      },
      procedure: 'LinkingComplete'
    }).then(
      (res: any) => {
        if (res.outcome) {
          this.snackbar.open('Lines Linked', '', { duration: 3000 });
          this.location.back();
        }
      },
    );
  }

  _invoiceLinkDialog(index: number) {
    const currentLinks = this.getCurrentLinks(this.sadLines[index], 'inv');

    this.dialog.open(InvoiceLineLinkComponent, {
      width: '860px',
      data: {
        currentLine: this.sadLines[index],
        joins: this.captureJoins,
        transactionID: this.transactionID,
        lines: currentLinks.invLines,
        currentLinks: currentLinks.currentLinks,
        currentUser: this.currentUser,
      }
    }).afterClosed().subscribe(() => {
      this.loadInvoiceLines();
    });
  }

  _customsLinkDialog(index: number) {
    const currentLinks = this.getCurrentLinks(this.sadLines[index], 'cws');

    this.dialog.open(CustomsLineLinkComponent, {
      width: '860px',
      data: {
        currentLine: this.sadLines[index],
        transactionID: this.transactionID,
        joins: this.captureJoins,
        lines: currentLinks.cwsLines,
        currentLinks: currentLinks.currentLinks,
        currentUser: this.currentUser,
      }
    }).afterClosed().subscribe(() => {
      this.loadWorksheetLines();
    });
  }

  getCurrentLinks(currentSADLine: any, type: string): any {
    const currentLinks = [];
    const allCaptureJoins = [...this.allCaptureJoins];
    const captureJoins = allCaptureJoins.filter(x => x.SAD500LineID == currentSADLine.sad500LineID);

    const cwsLines = [...this.cwsLinesTemp];
    const invLines = [...this.invLinesTemp];

    captureJoins.forEach((el) => {

      if (currentSADLine) {
        if (el.CustomWorksheetLineID != null && type == 'cws') {
          const cws = cwsLines.find(x => x.customWorksheetLineID == el.CustomWorksheetLineID);

          if (cws) {
            cws.captureJoinID = el.CaptureJoinID;
            cws.type = 'cws';

            currentLinks.push(cws);
          }
        }

        if (el.InvoiceLineID != null && type == 'inv') {
          const inv = invLines.find(x => x.invoiceLineID == el.InvoiceLineID);

          if (inv) {
            inv.captureJoinID = el.CaptureJoinID;
            inv.type = 'inv';

            currentLinks.push(inv);
          }
        }
      }

    });

    allCaptureJoins.forEach((el) => {
      if (el.CustomWorksheetLineID != null) {
        const cws = cwsLines.find(x => x.customWorksheetLineID == el.CustomWorksheetLineID);

        if (cws) {
          cwsLines.splice(cwsLines.indexOf(cws), 1);
        }
      }

      if (el.InvoiceLineID != null) {
        const inv = invLines.find(x => x.invoiceLineID == el.InvoiceLineID);

        if (inv) {
          invLines.splice(invLines.indexOf(inv), 1);
        }
      }
    });

    return { currentLinks, invLines, cwsLines };
  }

  evaluate() {
    this.sadLines.forEach(item => {
      let cwsCustomsValue = 0;
      let invForeignValue = 0;
      let cwsForeignValue = 0;

      const linkedCWS = this.getCurrentLinks(item, 'cws');
      const linkedINV = this.getCurrentLinks(item, 'inv');

      linkedCWS.currentLinks.forEach(cws => {
        cwsCustomsValue += +cws.custVal;
        cwsForeignValue += cws.foreignInv;

        linkedINV.currentLinks.forEach(inv => {
          invForeignValue += inv.totalLineValue;
        });
      });

      item.runningCustomsValue = cwsCustomsValue;
      item.runningCustomsValueStatus = item.OBit ? this.totalStatuses.Passed : this.getTotalStatus(item.customsValue, cwsCustomsValue);

      item.runningForeignValue = invForeignValue;
      item.runningForeignValueStatus = item.ForeignOBit ? this.totalStatuses.Passed : this.getTotalStatus(cwsForeignValue, invForeignValue);
    });
  }

  getTotalStatus(parent, child) {
    if (parent === child) {
      return TotalStatus.Passed;
    } else if (child > parent) {
      return TotalStatus.Failed;
    }

    return TotalStatus.None;
  }

  customsValueChip(item: any) {
    if (item.runningCustomsValueStatus === this.totalStatuses.Failed || item.runningCustomsValueStatus === this.totalStatuses.None) {
      this.overrideDialog(item, 'Customs Value');
    }
  }

  foreignValueChip(item: any) {
    if (item.runningForeignValueStatus === this.totalStatuses.Failed || item.runningForeignValueStatus === this.totalStatuses.None) {
      this.overrideDialog(item, 'Foreign Invoice Value');
    }
  }

  _returnAttachmentDialog(type, id) {
    this.dialog.open(DialogReturnAttachmentComponent, {
      width: '512px',
      data: {
        label: type
      }
    }).afterClosed().subscribe((val) => {
      if (val) {
        const request = {
          sad500ID: type == 'SAD500' ? id : -1,
          customsWorksheetID: type == 'Custom Worksheet' ? id : -1,
          invoiceID: type == 'Invoice' ? id : -1,
          transactionID: this.transactionID,
          userID: this.currentUser.userID,
          reason: val
        };

        this.api.post(`${environment.ApiEndpoint}/capture/post`, {
          request,
          procedure: 'ReturnAttachment'
        }).then(
          (res: any) => {
            if (res.outcome) {
              this.snackbar.open('Attachment returned', '', { duration: 3000 });
              this.location.back();
            } else {
              this.snackbar.open('Failure: Could not return attachment', '', { duration: 3000 });
            }
          },
        );
      }
    });
  }

  overrideDialog(sad500Line: any, label) {
    this.dialog.open(DialogOverrideComponent, {
      autoFocus: true,
      width: '512px',
      data: {
        label
      }
    }).afterClosed().subscribe((val) => {
      if (val) {
        this.override(sad500Line, val, label);
      }
    });
  }

  override(sad500Line: any, reason: string, label: string) {
    if (label == 'Customs Value') {
      sad500Line.OBit = true;
      sad500Line.OReason = reason;

      sad500Line.runningCustomsValueStatus = this.totalStatuses.Passed;

      this.api.post(`${environment.ApiEndpoint}/capture/post`, {
        request: {
          sad500LineID: sad500Line.sad500LineID,
          customsValue: true,
          customsValueOBit: sad500Line.OBit,
          customsValueOReason: sad500Line.OReason,
        },
        procedure: 'OverrideSAD500LineLinking'
      }).then(
        (res: any) => {
          if (res.outcome) {
            this.snackbar.open('Overridden: Customs Value', '', { duration: 3000 });
          } else {
            this.snackbar.open('Failure: Could not override SAD500 Line', '', { duration: 3000 });
            this.undoOverride(sad500Line, label);
          }
        },
      );
    } else if (label == 'Foreign Invoice Value') {
      sad500Line.ForeignOBit = true;
      sad500Line.ForeignOReason = reason;
      sad500Line.runningForeignValueStatus = this.totalStatuses.Passed;

      this.api.post(`${environment.ApiEndpoint}/capture/post`, {
        request: {
          sad500LineID: sad500Line.sad500LineID,
          ForeignInvoiceValue: true,
          ForeignInvoiceOBit: sad500Line.ForeignOBit,
          ForeignInvoiceOReason: sad500Line.ForeignOReason,
        },
        procedure: 'OverrideSAD500LineLinking'
      }).then(
        (res: any) => {
          if (res.outcome) {
            this.snackbar.open('Overridden: Foreign Invoice Value', '', { duration: 3000 });
          } else {
            this.snackbar.open('Failure: Could not override SAD500 Line', '', { duration: 3000 });
            this.undoOverride(sad500Line, label);
          }
        },
      );
    }
  }

  undoOverride(sad500Line: any, label: string) {
    if (label == 'Customs Value') {
      sad500Line.OBit = false;
      sad500Line.OReason = null;

      this.evaluate();

      this.api.post(`${environment.ApiEndpoint}/capture/post`, {
        request: {
          sad500LineID: sad500Line.sad500LineID,
          customsValue: true,
          customsValueOBit: sad500Line.OBit,
          customsValueOReason: sad500Line.OReason,
        },
        procedure: 'OverrideSAD500LineLinking'
      }).then(
        (res: any) => {
          if (res.outcome) {
            this.snackbar.open('Undo: Customs Value Override', '', { duration: 3000 });
          }
        },
      );
    } else if (label == 'Foreign Invoice Value') {
      sad500Line.ForeignOBit = false;
      sad500Line.ForeignOReason = null;

      this.evaluate();

      this.api.post(`${environment.ApiEndpoint}/capture/post`, {
        request: {
          sad500LineID: sad500Line.sad500LineID,
          ForeignInvoiceValue: true,
          ForeignInvoiceOBit: sad500Line.ForeignOBit,
          ForeignInvoiceOReason: sad500Line.ForeignOReason,
        },
        procedure: 'OverrideSAD500LineLinking'
      }).then(
        (res: any) => {
          if (res.outcome) {
            this.snackbar.open('Undo: Foreign Invoice Value Override', '', { duration: 3000 });
          }
        },
      );
    }

  }

  ngOnDestroy(): void {
    this.exitFullscreen();
  }
}

