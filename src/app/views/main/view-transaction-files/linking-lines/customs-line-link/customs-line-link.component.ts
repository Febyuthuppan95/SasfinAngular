import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

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
    public lines: any[] = [];

    ngOnInit() {
      this.currentLinks = JSON.parse(JSON.stringify(this.data.currentLinks));
      this.lines = JSON.parse(JSON.stringify(this.data.lines));

      console.log(this.data);
    }

    async addJoin(index) {
      const request: any = {};
      const customsLine = this.lines[index];
      console.log(customsLine);
      request.transactionID = this.data.transactionID;
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
            item.captureJoinID = +res.outcomeMessage;
            this.currentLinks.push(item);
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
            this.snackbar.open('Line unlinked', 'OK', { duration: 3000 });
          }
        },
      );
    }
}
