import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-deleteline-dialog',
  templateUrl: './deleteline-dialog.component.html',
  styleUrls: ['./deleteline-dialog.component.scss']
})
export class DeletelineDialogComponent implements OnInit {

  constructor(private matDialogRef: MatDialogRef<DeletelineDialogComponent>) { }

  ngOnInit() {
  }

  confirm() {
    this.matDialogRef.close(true);
  }

  cancel() {
    this.matDialogRef.close(false);
  }

}
