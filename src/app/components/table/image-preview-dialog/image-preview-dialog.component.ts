import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-preview-dialog',
  templateUrl: './image-preview-dialog.component.html',
  styleUrls: ['./image-preview-dialog.component.scss']
})
export class ImagePreviewDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ImagePreviewDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: {src: string}) { }

  ngOnInit() {
  }

}
