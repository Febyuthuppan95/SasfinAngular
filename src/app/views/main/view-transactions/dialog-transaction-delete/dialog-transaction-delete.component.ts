import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-transaction-delete',
  templateUrl: './dialog-transaction-delete.component.html',
  styleUrls: ['./dialog-transaction-delete.component.scss']
})
export class DialogTransactionDeleteComponent implements OnInit {
  constructor(private matDialogRef: MatDialogRef<DialogTransactionDeleteComponent>) {}

  ngOnInit() {}

  confirm() {
    this.matDialogRef.close(true);
  }
}
