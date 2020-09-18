import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-goto-line',
  templateUrl: './dialog-goto-line.component.html',
  styleUrls: ['./dialog-goto-line.component.scss'],
})
export class DialogGotoLineComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<DialogGotoLineComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  public control = new FormControl();
  public max = 0;

  ngOnInit() {
    this.max = +this.data;
  }

  submit() {
    if (this.control.value) {
      if (this.control.value > 0 && this.control.value <= this.max) {
        this.dialogRef.close(this.control.value);
      } else {
        this.snackbar.open('Line number out of range', '', { duration: 3000 });
      }
    } else {
      this.snackbar.open('Line number out of range', '', { duration: 3000 });
    }
  }
}
