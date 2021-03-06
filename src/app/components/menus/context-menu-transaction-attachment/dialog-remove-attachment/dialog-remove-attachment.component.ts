import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-remove-attachment',
  templateUrl: './dialog-remove-attachment.component.html',
  styleUrls: ['./dialog-remove-attachment.component.scss']
})
export class DialogRemoveAttachmentComponent implements OnInit {

  constructor(private ref: MatDialogRef<DialogRemoveAttachmentComponent>) { }

  ngOnInit() {
  }

  confirm() {
    console.log('Confirm');
    this.ref.close(true);
  }

}
