import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SAD500LineCreateRequest } from 'src/app/models/HttpRequests/SAD500Line';

@Component({
  selector: 'app-sad500-line-preview',
  templateUrl: './sad500-line-preview.component.html',
  styleUrls: ['./sad500-line-preview.component.scss']
})
export class Sad500LinePreviewComponent implements OnInit {

  constructor(private ref: MatDialogRef<Sad500LinePreviewComponent>, @Inject(MAT_DIALOG_DATA) public data: SAD500LineCreateRequest) { }

  ngOnInit() {
  }

}
