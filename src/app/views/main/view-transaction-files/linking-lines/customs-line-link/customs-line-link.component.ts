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

  ngOnInit() {
    this.currentLinks = this.data.currentLinks;
  }

  async addJoin(request, index) {
    request.transactionID = this.data.transactionID;
    request.userID = this.data.currentUser.userID;
    request.SAD500LineID = this.data.currentSADLine.sad500LineID;

    await this.api.post(`${environment.ApiEndpoint}/capture/post`, {
      request,
      procedure: 'CaptureJoinAdd'
    }).then(
      (res: any) => {
        console.log(res);
        if (res.outcome) {
          this.snackbar.open('Line linked', 'OK', { duration: 3000 });

          this.data.currentLinks[index].captureJoinID = +res.outcomeMessage;
        }
      },
    );
  }

  async removeJoin(request) {
    request.userID = this.data.currentUser.userID;
    request.SAD500LineID = this.data.currentSADLine.sad500LineID;
    request.isDeleted = 1;

    await this.api.post(`${environment.ApiEndpoint}/capture/post`, {
      request,
      procedure: 'CaptureJoinUpdate'
    }).then(
      (res: any) => {
        if (res.outcome) {
          this.snackbar.open('Line unlinked', 'OK', { duration: 3000 });
        }
      },
    );
  }


}
