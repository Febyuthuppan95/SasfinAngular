import { Component, OnInit } from '@angular/core';
import { CaptureService } from 'src/app/services/capture.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.Service';
import { MatDialogRef, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-dialog-create-items',
  templateUrl: './dialog-create-items.component.html',
  styleUrls: ['./dialog-create-items.component.scss']
})
export class DialogCreateItemsComponent implements OnInit {

  constructor(private captureService: CaptureService, private userService: UserService,
              private dialogRef: MatDialogRef<DialogCreateItemsComponent>, private snackbar: MatSnackBar) { }

  currentUser = this.userService.getCurrentUser();

  form = new FormGroup({
    userID: new FormControl(this.currentUser.userID),
    tariffID: new FormControl(null),
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
  });

  ngOnInit() {}

  submit(form: FormGroup) {
    if (form.valid) {
      this.captureService.post({ request: form.value, procedure: 'ItemAdd' }).then(
        (res: any) => {
          console.log(res);
          if (res.outcome) {
            this.dialogRef.close(res.data[0].createdID);
          } else {
            this.snackbar.open(res.outcomeMessage, '', { duration: 3000 });
          }
        }
      );
    }
  }

}
