import { Component, OnInit } from '@angular/core';
import { HelpGlossaryService } from 'src/app/services/HelpGlossary.Service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.Service';
import { MatSnackBar, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-create-help',
  templateUrl: './create-help.component.html',
  styleUrls: ['./create-help.component.scss'],
})
export class CreateHelpComponent implements OnInit {
  constructor(
    private help: HelpGlossaryService,
    private user: UserService,
    private snackbar: MatSnackBar,
    private ref: MatDialogRef<CreateHelpComponent>) {}

  private currentUser = this.user.getCurrentUser();
  public form = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
  });

  ngOnInit() {}

  async submit(form: FormGroup) {
    if (form.valid) {
      const request = {
        userID: this.currentUser.userID,
        name: form.controls.title.value,
        description: form.controls.description.value,
      };

      this.help.create(request).then(
        (res: any) => {
          this.snackbar.open(res.outcome.outcomeMessage, '', { duration: 3000 });
          console.log(res);

          if (res.outcome.outcome === 'SUCCESS') {
            this.ref.close(true);
          }
        },
        (msg) => {
          this.snackbar.open(msg.message, '', { duration: 3000 });
        }
      );
    }
  }
}
