import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
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
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private location: Location,
    private render: Renderer2) { }

  public transaction: string;
  public transactionType: string;
  public transactionID: number;

  // public control = new FormControl(undefined);
  public currentSAD: any;
  // public currentSADLine: any;
  // public currentLinks: any[] = [];

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
  public currentPDFIndex: number;
  public showHelp = false;

  // public cwsTotalValue = 0;
  // public invTotalValue = 0;

  // public sadTotalValue = 0;
  // public sadInvTotalValue = 0;
  // public sadCwsTotalValue = 0;

  public warning: any;
  public loading = false;

  private currentUser: any = this.user.getCurrentUser();
  // tslint:disable-next-line: max-line-length
  public consultant = this.user.getCurrentUser().designation.toUpperCase() === 'CONSULTANT' || this.user.getCurrentUser().designation.toUpperCase() === 'ADMIN';

  @ViewChild(KeyboardShortcutsComponent, { static: true })
  private keyboard: KeyboardShortcutsComponent;

  shortcuts: ShortcutInput[] = [];

  @ViewChild('startLines', { static: false }) firstLine: any;

  // dropCWS(event: CdkDragDrop<any[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     if (event.previousContainer.data[event.previousIndex].type === 'cws') {
  //       transferArrayItem(event.previousContainer.data,
  //                         event.container.data,
  //                         event.previousIndex,
  //                         event.currentIndex);

  //       this.removeJoin({ captureJoinID: event.container.data[event.currentIndex].captureJoinID });
  //     } else { this.snackbar.open('Item must be CWS', 'OK', { duration: 3000 }); }
  //   }
  // }

  // dropINV(event: CdkDragDrop<any[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     if (event.previousContainer.data[event.previousIndex].type === 'inv') {
  //       transferArrayItem(event.previousContainer.data,
  //                         event.container.data,
  //                         event.previousIndex,
  //                         event.currentIndex);

  //       this.removeJoin({ captureJoinID: event.container.data[event.currentIndex].captureJoinID });
  //     } else { this.snackbar.open('Item must be INV', 'OK', { duration: 3000 }); }
  //   }
  // }

  // dropInSAD(event: CdkDragDrop<any[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(event.previousContainer.data,
  //                       event.container.data,
  //                       event.previousIndex,
  //                       event.currentIndex);

  //     if (event.container.data[event.currentIndex].invoiceLineID) {
  //       this.addJoin({ invoiceLineID: event.container.data[event.currentIndex].invoiceLineID }, event.currentIndex);
  //     } else {
  //       this.addJoin({ customWorksheetLineID: event.container.data[event.currentIndex].customWorksheetLineID}, event.currentIndex);
  //     }
  //   }
  // }

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

    // this.control.valueChanges.subscribe((value) => {
    //   if (value) {
    //     this.currentSADLine = value;
    //     this.currentLinks = [];
    //     console.log('CONTROL CHANGED');
    //     this.loadInvoiceLines();
    //   }
    // });
  }

  ngAfterViewInit(): void {
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
              setTimeout(() => this.currentPDFSource = btoa(this.attachments[this.currentPDFIndex].file));
            }
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
                setTimeout(() => this.currentPDFSource = btoa(this.attachments[this.currentPDFIndex].file));
              }
          }
      },
      {
        key: 'alt + q',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: e => {
          this.location.back();
        }
      },
      {
        key: 'alt + s',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: e => {
          if (this.consultant) {
            this.approve();
          } else {
            this.submitToConsultant();
          }
        }
      },
    );

    this.keyboard.select('cmd + f').subscribe(e => console.log(e));
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

          this.currentPDFIndex = 0;
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

        await this.iterate(this.sadLinesTemp, async (el) => {
          el.unit = this.units.find(x => x.UnitOfMeasureID == el.unitOfMeasureID);
          el.country = this.countries.find(x => x.CountryID == el.cooID);
        });

        this.sadLines = this.sadLinesTemp;
        await this.loadInvoiceLines();
      }
    );
  }

  async loadInvoiceLines() {
    this.loading = true;

    const header: any = await this.capture.invoiceList({
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

    await this.capture.invoiceLineList({
      invoiceID: header.invoices[0].invoiceID,
      invoiceLineID: -1,
      userID: this.currentUser.userID,
      transactionID: this.transactionID,
      filter:  '',
      orderBy: '',
      orderByDirection: '',
      rowStart: 1,
      rowEnd: 1000000 }).then(
      async (res: any) => {
        this.invLinesTemp = res.lines;

        await this.iterate(this.invLinesTemp, (el) => {
          el.type = 'inv';
          el.items = this.items.find(x => x.ItemID == el.itemID);
          el.unit = this.units.find(x => x.UnitOfMeasureID == el.unitOfMeasureID);
        });

        this.invLines = this.invLinesTemp;

        await this.loadWorksheetLines();
      }
    );
  }

  // async totalValues() {
  //   let invValue = 0;

  //   await this.iterate(this.invLines, (el) => {
  //     if (!isNaN(+el.totalLineValue)) {
  //       invValue += +el.totalLineValue;
  //     }
  //   });

  //   this.invTotalValue = invValue;

  //   let cwsValue = 0;

  //   await this.iterate(this.cwsLines, (el) => {
  //     if (!isNaN(+el.custVal)) {
  //       cwsValue += +el.custVal;
  //     }
  //   });

  //   this.cwsTotalValue = cwsValue;

  //   let sadcwsValue = 0;
  //   let sadinvValue = 0;

  //   await this.iterate(this.currentLinks, (el) => {
  //     if (el.type === 'cws') {
  //       if (!isNaN(+el.custVal)) {
  //         sadcwsValue += +el.custVal;
  //       }
  //     } else if (el.type === 'inv') {
  //       if (!isNaN(+el.totalLineValue)) {
  //         sadinvValue += +el.totalLineValue;
  //       }
  //     }
  //   });

  //   this.sadCwsTotalValue = sadcwsValue;
  //   this.sadInvTotalValue = sadinvValue;
  // }

  async loadWorksheetLines() {
    const header: any = await this.capture.customWorksheetList({
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
      customsWorksheetID: header.customsWorksheets[0].customWorksheetID,
      rowStart: 1,
      rowEnd: 1000,
      orderBy: '',
      orderByDirection: '',
      filter: '',
      transactionID: this.transactionID, }).then(
      async (res: any) => {
        this.cwsLinesTemp = res.lines;

        await this.iterate(this.cwsLinesTemp, async (el) => {
          el.type = 'cws';
          el.country = this.countries.find(x => x.CountryID == el.cooID);
          el.unit = this.units.find(x => x.UnitOfMeasureID == el.unitOfMeasureID);
        });

        this.cwsLines = this.cwsLinesTemp;

        await this.loadCaptureJoins();
      }
    );
  }

  async loadCaptureJoins() {
    console.log('LOADING CAPTURE JOINS============================');
    // this.currentLinks = [];

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
        this.cwsLines = this.cwsLinesTemp;
        this.invLines = this.invLinesTemp;

        await this.iterate(this.allCaptureJoins, async (el) => {
          this.cwsLines = this.cwsLines.filter(x => x.customWorksheetLineID != el.CustomWorksheetLineID);
          this.invLines = this.invLines.filter(x => x.invoiceLineID != el.InvoiceLineID);
        });

        this.loading = false;
        // await this.totalValues();
    });
  }

  findCustomsWorksheetLine(array, value) {
    let found;

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < array.length; i++) {
      console.log(`${array[i].customWorksheetLineID} == ${value}`);
      // tslint:disable-next-line: triple-equals
      if (array[i].customWorksheetLineID == value) {
        found = array[i];
      }
    }

    return found;
  }

  // async addJoin(request, index) {
  //   request.transactionID = this.transactionID;
  //   request.userID = this.currentUser.userID;
  //   request.SAD500LineID = this.currentSADLine.sad500LineID;

  //   await this.api.post(`${environment.ApiEndpoint}/capture/post`, {
  //     request,
  //     procedure: 'CaptureJoinAdd'
  //   }).then(
  //     (res: any) => {
  //       console.log(res);
  //       if (res.outcome) {
  //         this.snackbar.open('Line linked', 'OK', { duration: 3000 });

  //         this.currentLinks[index].captureJoinID = +res.outcomeMessage;
  //       }
  //     },
  //   );
  // }

  // async removeJoin(request) {
  //   request.userID = this.currentUser.userID;
  //   request.SAD500LineID = this.currentSADLine.sad500LineID;
  //   request.isDeleted = 1;

  //   await this.api.post(`${environment.ApiEndpoint}/capture/post`, {
  //     request,
  //     procedure: 'CaptureJoinUpdate'
  //   }).then(
  //     (res: any) => {
  //       if (res.outcome) {
  //         this.snackbar.open('Line unlinked', 'OK', { duration: 3000 });
  //       }
  //     },
  //   );
  // }

  async iterate(list, callback) {
    for (let i = 0; i < list.length; i++) {
      await callback(list[i]);
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
          setTimeout(() => {
            this.router.navigate(['companies', 'transactions']);
          }, 2000);
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
          this.snackbar.open('Notification Sent to Consultant', '', { duration: 3000 });
          setTimeout(() => {
            this.router.navigate(['companies', 'transactions']);
          }, 2000);
        }
      },
    );
  }

  // async evaluate() {
  //   this.warning = undefined;

  //   this.warning = {
  //     title: 'test',
  //     msg: 'warning message'
  //   };
  // }

  _invoiceLinkDialog(index: number) {
    const currentLinks = this.getCurrentLinks(this.sadLines[index], 'inv');
    console.log(currentLinks);

    this.dialog.open(InvoiceLineLinkComponent, {
      width: '860px',
      data: {
        currentLine: this.sadLines[index],
        joins: this.captureJoins,
        transactionID: this.transactionID,
        lines: this.invLines,
        currentLinks,
        currentUser: this.currentUser,
      }
    }).afterClosed().subscribe(() => {
      this.loadInvoiceLines();
    });
  }

  _customsLinkDialog(index: number) {
    const currentLinks = this.getCurrentLinks(this.sadLines[index], 'cws');
    console.log(currentLinks);

    this.dialog.open(CustomsLineLinkComponent, {
      width: '860px',
      data: {
        currentLine: this.sadLines[index],
        transactionID: this.transactionID,
        joins: this.captureJoins,
        lines: this.cwsLines,
        currentLinks,
        currentUser: this.currentUser,
      }
    }).afterClosed().subscribe(() => {
      this.loadInvoiceLines();
    });
  }

  getCurrentLinks(currentSADLine: any, type: string): any[] {
    const currentLinks = [];
    const captureJoins: any = [] = this.allCaptureJoins.filter(x => x.SAD500LineID == currentSADLine.sad500LineID);
    console.log(this.allCaptureJoins);
    this.cwsLines = this.cwsLinesTemp;
    this.invLines = this.invLinesTemp;

    captureJoins.forEach((el) => {
      this.cwsLines = this.cwsLines.filter(x => x.customWorksheetLineID != el.CustomWorksheetLineID);
      this.invLines = this.invLines.filter(x => x.invoiceLineID != el.InvoiceLineID)

      if (currentSADLine) {
        if (el.CustomWorksheetLineID !== null) {
          const toAdd = this.findCustomsWorksheetLine(this.cwsLinesTemp, el.CustomWorksheetLineID);

          if (toAdd && type === 'cws') {
            console.log(toAdd);
            toAdd.captureJoinID = el.CaptureJoinID;
            toAdd.type = 'cws';
            currentLinks.push(toAdd);
          }
        }

        if (el.InvoiceLineID !== null && type === 'inv') {
          const invoiceToAdd = this.invLinesTemp.find(x => x.invoiceLineID == el.InvoiceLineID);

          if (invoiceToAdd) {
            invoiceToAdd.captureJoinID = el.CaptureJoinID;
            invoiceToAdd.type = 'inv';
            currentLinks.push(invoiceToAdd);
          }
        }
      }
    });

    return currentLinks;
  }

  ngOnDestroy(): void {}
}
