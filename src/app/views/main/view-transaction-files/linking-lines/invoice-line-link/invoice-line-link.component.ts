import { Component, Inject, OnInit } from '@angular/core';
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
    @Inject(MAT_DIALOG_DATA) private data: any,
    private snackbar: MatSnackBar,
    private api: ApiService) { }

  public currentLinks: any[] = [];
  public lines: any[] = [];
  public lineKeys: string[] = [];

  public formattedInvoiceLines: any[] = [];

  ngOnInit() {
    this.currentLinks = this.data.currentLinks;
    this.lines = this.data.lines;

    this.formattedInvoiceLines = this.groupBy([...this.lines], 'invoiceNo');
    this.lineKeys = Object.keys(this.formattedInvoiceLines);

    this.currentLinks.forEach((link) => {
      this.lineKeys.forEach((key) => {
        const inv = this.formattedInvoiceLines[key].find(x => x.invoiceLineID == link.InvoiceLineID);

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

  async addJoin(index) {
    const request: any = {};
    const invoiceLine = this.lines[index];

    request.transactionID = this.data.transactionID;
    request.userID = this.data.currentUser.userID;
    request.SAD500LineID = this.data.currentLine.sad500LineID;
    request.invoiceLineID = invoiceLine.invoiceLineID;

    await this.api.post(`${environment.ApiEndpoint}/capture/post`, {
      request,
      procedure: 'CaptureJoinAdd'
    }).then(
      (res: any) => {
        console.log(res);

        if (res.outcome) {
          const item = this.lines.splice(index, 1)[0];
          item.captureJoinID = +res.outcomeMessage;
          this.currentLinks.push(item);

          this.formattedInvoiceLines = this.groupBy([...this.lines], 'invoiceNo');
          this.lineKeys = Object.keys(this.formattedInvoiceLines);

          this.currentLinks.forEach((link) => {
            this.lineKeys.forEach((key) => {
              const inv = this.formattedInvoiceLines[key].find(x => x.invoiceLineID == link.InvoiceLineID);

              if (inv) {
                this.formattedInvoiceLines[key].splice(this.formattedInvoiceLines[key].indexOf(inv), 1);
              }
            });
          });

          this.snackbar.open('Line linked', 'OK', { duration: 3000 });
        }
      },
    );
  }

  async removeJoin(index) {
    const currentLink = this.currentLinks[index]
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
              const inv = this.formattedInvoiceLines[key].find(x => x.invoiceLineID == link.InvoiceLineID);

              if (inv) {
                this.formattedInvoiceLines[key].splice(this.formattedInvoiceLines[key].indexOf(inv), 1);
              }
            });
          });

          this.snackbar.open('Line unlinked', 'OK', { duration: 3000 });
        }
      },
    );
  }

}
