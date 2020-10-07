import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-return-attachment',
  templateUrl: './dialog-return-attachment.component.html',
  styleUrls: ['./dialog-return-attachment.component.scss']
})
export class DialogReturnAttachmentComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogReturnAttachmentComponent>) { }

  reason = new FormControl(null, [Validators.required]);

  ngOnInit() {
  }

  submit(control: FormControl) {
    if (control.valid) {
      this.dialogRef.close(control.value);
    }
  }

}
