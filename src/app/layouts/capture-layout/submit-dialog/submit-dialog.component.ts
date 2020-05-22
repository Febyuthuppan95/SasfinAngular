import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-submit-dialog',
  templateUrl: './submit-dialog.component.html',
  styleUrls: ['./submit-dialog.component.scss']
})
export class SubmitDialogComponent implements OnInit {

  constructor(private matDialogRef: MatDialogRef<SubmitDialogComponent>) { }

  ngOnInit() {
  }

  confirm() {
    console.log('submitting..');
    this.matDialogRef.close(true);
  }

  cancel() {
    console.log('cancelling..');
    this.matDialogRef.close(false);
  }

}
