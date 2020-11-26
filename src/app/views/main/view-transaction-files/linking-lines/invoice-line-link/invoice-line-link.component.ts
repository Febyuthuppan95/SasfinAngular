import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invoice-line-link',
  templateUrl: './invoice-line-link.component.html',
  styleUrls: ['./invoice-line-link.component.scss']
})
export class InvoiceLineLinkComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<InvoiceLineLinkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbar: MatSnackBar,
    private api: ApiService) { }

  // @Output() onFilter = new EventEmitter<any>();

  public currentLinks: any[] = [];
  public lines: any[] = [];
  public Templines: any[] = [];
  public lineKeys: string[] = [];
  public filter = '';

  public formattedInvoiceLines: any[] = [];

  ngOnInit() {
    // console.log('data');
    // console.log(this.data);

    this.currentLinks = [...this.data.currentLinks];
    this.lines = [...this.data.lines];
    this.Templines = [...this.lines];

    // console.log('lines');
    // console.log(this.lines);

    this.linesList(this.Templines, this.currentLinks);

  }

  linesList(lines, links) {

    this.formattedInvoiceLines = this.groupBy(lines, 'invoiceNo');
    this.lineKeys = Object.keys(this.formattedInvoiceLines);

    links.forEach((link) => {
      this.lineKeys.forEach((key) => {
        const inv = this.formattedInvoiceLines[key].find(x => x.lineID == link.InvoiceLineID);

        if (inv) {
          this.formattedInvoiceLines[key].splice(this.formattedInvoiceLines[key].indexOf(inv), 1);
        }
      });
    });

  }

 groupBy(xs, key) {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  async addJoin(item) {
    console.log('item link');
    console.log(item);
    const request: any = {};
    const invoiceLine = this.lines.find(x => x.lineID == item.lineID);

    request.transactionID = this.data.transactionID;
    request.userID = this.data.currentUser.userID;
    request.SAD500LineID = this.data.currentLine.sad500LineID;
    request.invoiceLineID = invoiceLine.lineID;

    await this.api.post(`${environment.ApiEndpoint}/capture/post`, {
      request,
      procedure: 'CaptureJoinAdd'
    }).then(
      (res: any) => {
        if (res.outcome) {
          const currentLine = this.lines.find(x => x.lineID == item.lineID);
          const line = this.lines.splice(this.lines.indexOf(currentLine), 1)[0];

          line.captureJoinID = +res.outcomeMessage;
          this.currentLinks.push(line);

          this.formattedInvoiceLines = this.groupBy([...this.lines], 'invoiceNo');
          this.lineKeys = Object.keys(this.formattedInvoiceLines);

          this.currentLinks.forEach((link) => {
            this.lineKeys.forEach((key) => {
              const inv = this.formattedInvoiceLines[key].find(x => x.lineID == link.InvoiceLineID);

              if (inv) {
                this.formattedInvoiceLines[key].splice(this.formattedInvoiceLines[key].indexOf(item), 1);
              }
            });
          });

          this.snackbar.open('Line linked', 'OK', { duration: 3000 });
        }
      },
    );

    this.searchBar();
  }

  async removeJoin(index) {
    const currentLink = this.currentLinks[index];
    const request: any = {};

    request.userID = this.data.currentUser.userID;
    request.SAD500LineID = this.data.currentLine.sad500LineID;
    request.isDeleted = 1;
    request.captureJoinID = currentLink.captureJoinID;

    await this.api.post(`${environment.ApiEndpoint}/capture/post`, {
      request,
      procedure: 'CaptureJoinUpdate'
    }).then(
      (res: any) => {
        if (res.outcome) {
          const removed = this.currentLinks.splice(index, 1)[0];
          this.lines.push(removed);

          this.formattedInvoiceLines = this.groupBy([...this.lines], 'invoiceNo');
          this.lineKeys = Object.keys(this.formattedInvoiceLines);

          this.currentLinks.forEach((link) => {
            this.lineKeys.forEach((key) => {
              const inv = this.formattedInvoiceLines[key].find(x => x.lineID == link.InvoiceLineID);

              if (inv) {
                this.formattedInvoiceLines[key].splice(this.formattedInvoiceLines[key].indexOf(inv), 1);
              }
            });
          });

          this.snackbar.open('Line unlinked', 'OK', { duration: 3000 });
        }
      },
    );

    this.searchBar();
  }

  searchBar() {
    // this.onFilter.emit({filter: this.filter, index: this.data.index});

    let templines  = [...this.lines];

    if (this.filter !== '') {
      templines = templines.filter(x => x.totalLineValue === +this.filter);

      this.Templines = templines;
    } else {
      this.Templines = [...this.lines];
    }
    // console.log('filter lines');
    // console.log(this.Templines);

    this.linesList(this.Templines, this.currentLinks);


  }

}
