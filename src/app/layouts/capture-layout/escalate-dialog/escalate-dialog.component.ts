import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-escalate-dialog',
  templateUrl: './escalate-dialog.component.html',
  styleUrls: ['./escalate-dialog.component.scss']
})
export class EscalateDialogComponent {

  constructor(public dialogRef: MatDialogRef<EscalateDialogComponent>) { }

  reasonControl = new FormControl(null, [Validators.required]);

  submit() {
    if (this.reasonControl.valid) {
      this.dialogRef.close(this.reasonControl.value);
    }
  }
}
