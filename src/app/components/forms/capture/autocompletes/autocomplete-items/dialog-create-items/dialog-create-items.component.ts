import { ContextCompanyItemsListComponent } from './../../../../../../views/main/view-company-items-list/view-company-items-list.component';
import { Component, OnInit } from '@angular/core';
import { CaptureService } from 'src/app/services/capture.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.Service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
@Component({
  selector: 'app-dialog-create-items',
  templateUrl: './dialog-create-items.component.html',
  styleUrls: ['./dialog-create-items.component.scss']
})
export class DialogCreateItemsComponent implements OnInit {

  constructor(private captureService: CaptureService, private userService: UserService,
              private dialogRef: MatDialogRef<DialogCreateItemsComponent>, private snackbar: MatSnackBar,
              private snackbarService: HelpSnackbar) { }

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
          // console.log(res);
          if (res.outcome) {
            this.dialogRef.close(res.data[0].createdID);
          } else {
            this.snackbar.open(res.outcomeMessage, '', { duration: 3000 });
          }
        }
      );
    }
  }

  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
  }
}

