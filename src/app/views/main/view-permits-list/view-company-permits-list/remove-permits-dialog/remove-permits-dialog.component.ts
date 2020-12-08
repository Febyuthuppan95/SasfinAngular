import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-permits-dialog',
  templateUrl: './remove-permits-dialog.component.html',
  styleUrls: ['./remove-permits-dialog.component.scss']
})
export class RemovePermitsDialogComponent implements OnInit {

private result = false;


  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
               private dialogRef: MatDialogRef<RemovePermitsDialogComponent>) { }

  ngOnInit() {

  }

  UpdatePermit() {
    this.result = true;
}
  dismiss() {
    this.dialogRef.close(false);
  }
}
