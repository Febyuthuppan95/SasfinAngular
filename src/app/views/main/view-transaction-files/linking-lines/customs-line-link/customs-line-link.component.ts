import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { ShortcutInput } from 'ng-keyboard-shortcuts';

@Component({
  selector: 'app-customs-line-link',
  templateUrl: './customs-line-link.component.html',
  styleUrls: ['./customs-line-link.component.scss']
})
export class CustomsLineLinkComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<CustomsLineLinkComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private snackbar: MatSnackBar,
    private api: ApiService) { }

    public currentLinks: any[] = [];
    public newLink: any[] = [];
    public lines: any[] = [];
    public Templines: any[] = [];
    public invoice: any;
    public filter = '';

    shortcuts: ShortcutInput[] = [];

    ngOnInit() {

      this.currentLinks = [...this.data.currentLinks];
      this.lines = [...this.data.lines];
      this.Templines = [...this.lines];
      this.invoice = this.data.invoice;
      console.log('lists');

      console.log(this.lines);
      console.log(this.Templines);
      console.log(this.invoice);
      console.log(this.data);


      this.CWSList(this.Templines, this.currentLinks);

    }

    CWSList(lines, links) {
      this.currentLinks = JSON.parse(JSON.stringify(links));
      this.Templines = JSON.parse(JSON.stringify(lines));
    }

    async addJoin(index) {
      if (this.newLink.length === 0){
        this.newLink[0] = this.Templines[index];
        const item = this.lines.splice(index, 1)[0];
        this.Templines.splice(index, 1)[0];
      }
      else {
      }
      /*
      const request: any = {};
      const customsLine = this.lines[index];
      console.log(customsLine);
      request.transactionID = this.data.transactionID;
      request.invoiceLineID = this.invoice.lineID
      request.userID = this.data.currentUser.userID;
      request.SAD500LineID = this.data.currentLine.sad500LineID;
      request.customWorksheetLineID = customsLine.customWorksheetLineID;

      await this.api.post(`${environment.ApiEndpoint}/capture/post`, {
        request,
        procedure: 'CaptureJoinAdd'
      }).then(
        (res: any) => {
          if (res.outcome) {
            const item = this.lines.splice(index, 1)[0];
            this.Templines.splice(index, 1)[0];
            item.captureJoinID = +res.outcomeMessage;
            this.currentLinks.push(item);
            this.snackbar.open('Line linked', 'OK', { duration: 3000 });
          }
        },
      );*/
    }

    ngAfterViewInit(): void {
      this.shortcuts.push(
        {
          key: 'alt + a',
          preventDefault: true,
          command: e => {
            console.log('hi')
            if (this.newLink.length !== 0) {
              this.continue();
            }
          },
        },
      );
    }

    async continue() {
      const request: any = {};
      const customsLine = this.newLink[0];
      console.log(customsLine);
      request.transactionID = this.data.transactionID;
      request.invoiceLineID = this.invoice.lineID
      request.userID = this.data.currentUser.userID;
      request.SAD500LineID = this.data.currentLine.sad500LineID;
      request.customWorksheetLineID = customsLine.customWorksheetLineID;
      console.log(request.invoiceLineID);
      console.log(request.customWorksheetLineID)
      console.log(request.SAD500LineID)
      if (request.invoiceLineID !== null || request.customWorksheetLineID !== null || request.SAD500LineID !== null) {
        await this.api.post(`${environment.ApiEndpoint}/capture/post`, {
          request,
          procedure: 'CaptureJoinAdd'
        }).then(
          (res: any) => {
            if (res.outcome) {
              /*const item = this.lines.splice(index, 1)[0];
              this.Templines.splice(index, 1)[0];
              item.captureJoinID = +res.outcomeMessage;
              this.currentLinks.push(item);*/
              this.snackbar.open('Line linked', 'OK', { duration: 3000 });
              this.dialogRef.close(true);
            }
            else {
              this.snackbar.open(res.outcomeMessage,'Error' , { duration: 3000 });
            }
          },
        );
      }
    }

    removeNewLink(){
      const removed = this.newLink[0];
      this.lines.push(removed);
      this.Templines.push(removed);
      this.newLink = [];
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
            this.Templines.push(removed);
            this.snackbar.open('Line unlinked', 'OK', { duration: 3000 });
          }
        },
      );
    }

    searchBar() {
      // this.onFilter.emit({filter: this.filter, index: this.data.index});

      console.log('filter');
      console.log(this.filter);

      let templines  = [...this.lines];

      if (this.filter !== '') {
        templines = templines.filter(x => x.custVal === +this.filter);

        this.Templines = templines;
      } else {
        this.Templines = [...this.lines];
      }
      console.log('filter lines');
      console.log(this.Templines);

      this.CWSList(this.Templines, this.currentLinks);


    }
}
