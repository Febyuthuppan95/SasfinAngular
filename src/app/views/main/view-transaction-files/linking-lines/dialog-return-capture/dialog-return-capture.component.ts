import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.Service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dialog-return-capture',
  templateUrl: './dialog-return-capture.component.html',
  styleUrls: ['./dialog-return-capture.component.scss']
})
export class DialogReturnCaptureComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private api: ApiService,
              private user: UserService,
              private ref: MatDialogRef<DialogReturnCaptureComponent>,
              private snackbar: MatSnackBar) { }

  form = new FormGroup({
    sad500ID: new FormControl(),
    invoiceID: new FormControl(),
    customsWorksheetID: new FormControl(),
    message: new FormControl(),
  });

  ngOnInit() {
    this.form.patchValue(this.data);
  }

  async submit(form: FormGroup) {
    const request = form.value;
    request.userID = this.user.getCurrentUser().userID;

    await this.api.post(`${environment.ApiEndpoint}/capture/post`, {
      request,
      procedure: 'CaptureJoinUpdate'
    }).then(
      (res: any) => {
        if (res.outcome) {
          this.snackbar.open('Returned to Capture', '', {duration: 3000});
          this.ref.close();
        }
      },
    );
  }

}
