import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { TransactionFileListResponse } from 'src/app/models/HttpResponses/TransactionFileListModel';
import { ApiService } from 'src/app/services/api.service';
import { CaptureService } from 'src/app/services/capture.service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { UserService } from 'src/app/services/user.Service';
import { environment } from 'src/environments/environment';

@AutoUnsubscribe()
@Component({
  selector: 'app-linking-lines',
  templateUrl: './linking-lines.component.html',
  styleUrls: ['./linking-lines.component.scss']
})
export class LinkingLinesComponent implements OnInit, OnDestroy {
  constructor(
    private transationService: TransactionService,
    private capture: CaptureService,
    private user: UserService,
    private api: ApiService) { }

  public transaction: string;
  public transactionType: string;
  public transactionID: number;

  public control = new FormControl();
  public currentSAD: any;
  public currentSADLine: any;
  public currentLinks: any[] = [];

  public invoiceTotal = 0;
  public cwsTotal = 0;

  public sadLines: any[] = [];
  public invLines: any[] = [];
  public cwsLines: any[] = [];
  public sadLinesTemp: any[] = [];
  public invLinesTemp: any[] = [];
  public cwsLinesTemp: any[] = [];
  public attachments: any[] = [];

  private currentUser: any = this.user.getCurrentUser();

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  dropInSAD(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  ngOnInit() {
    this.transationService.observerCurrentAttachment()
    .subscribe((data) => {
      if (data) {
        this.transactionID = +data.transactionID;
        this.transactionType = data.transactionType;
        this.transaction = data.transactionName;

        this.init();
      }
    });

    this.control.valueChanges.subscribe((value) => {
      if (value) {
        this.currentSADLine = value;
        this.currentLinks = [];
        this.invLines = this.invLinesTemp;
        this.cwsLines = this.cwsLinesTemp;
      }
    });
  }

  async init() {
    await this.loadAttachments();
    await this.loadSADLines();
    await this.loadInvoiceLines();
    await this.loadWorksheetLines();
    await this.loadCaptureJoins();
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

    this.transationService
      .listAttatchments(model)
      .then(
        (res: TransactionFileListResponse) => {
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
      (res: any) => {
        this.sadLines = res.lines;
        this.control.setValue(this.sadLines[0]);
      }
    );
  }

  async loadInvoiceLines() {
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

    console.log(header);

    await this.capture.invoiceLineList({
      invoiceID: header.invoices[0].invoiceID,
      userID: this.currentUser.userID,
      transactionID: this.transactionID,
      filter:  '',
      orderBy: '',
      orderByDirection: '',
      rowStart: 1,
      rowEnd: 1000000 }).then(
      (res: any) => {
        this.invLines = res.lines;
        console.log(res);
      }
    );
  }

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

    console.log(header);

    await this.capture.customWorksheetLineList({
      userID: this.currentUser.userID,
      customsWorksheetID: header.customsWorksheets[0].customWorksheetID,
      rowStart: 1,
      rowEnd: 1000,
      orderBy: '',
      orderByDirection: '',
      filter: '',
      transactionID: this.transactionID, }).then(
      (res: any) => {
        this.cwsLines = res.lines;
        console.log(res);
      }
    );
  }

  async loadCaptureJoins() {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        filter: '',
        rowStart: 1,
        rowEnd: 1000,
        orderBy: '',
        orderByDirection: ''
      },
      requestProcedure: 'CaptureJoinsList'
    };

    this.api.post(`${environment.ApiEndpoint}/checking/read`, model).then(
      (res: any) => {
        console.log('res.data');
        console.log(res.data);
      },
    );
  }

  async addJoin(request) {
    request.transactionID = this.transactionID;
    request.userID = this.currentUser.userID;
    request.SAD500LineID = this.currentSADLine.sad500LineID;

    await this.api.post(`${environment.ApiEndpoint}/checking/add`, {
      requestParams: request,
      requestProcedure: 'CaptureJoinAdd'
    }).then(
      (res: any) => {
        console.log('res');
        console.log(res);
      },
    );
  }

  async removeJoin(request) {
    request.userID = this.currentUser.userID;
    request.SAD500LineID = this.currentSADLine.sad500LineID;
    request.isDeleted = 0;

    await this.api.post(`${environment.ApiEndpoint}/checking/update`, {
      requestParams: request,
      requestProcedure: 'CaptureJoinsUpdate'
    }).then(
      (res: any) => {
        console.log('res');
        console.log(res);
      },
    );
  }

  previewCapture(src: string, id: number) {
    const myWindow = window.open(
      `${environment.appRoute}/documentpreview/${btoa(src)}`,
      '_blank',
      'width=600, height=800, noreferrer'
    );

    myWindow.opener = null;
  }

  ngOnDestroy(): void {}
}
