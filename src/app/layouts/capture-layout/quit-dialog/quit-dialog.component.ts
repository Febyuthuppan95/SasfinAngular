import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-quit-dialog',
  templateUrl: './quit-dialog.component.html',
  styleUrls: ['./quit-dialog.component.scss']
})
export class QuitDialogComponent implements OnInit {

constructor(private matDialogRef: MatDialogRef<QuitDialogComponent>) { }

  ngOnInit() {
  }

  confirm() {
    this.matDialogRef.close(true);
  }

  cancel() {
    this.matDialogRef.close(false);
  }

}
