import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-submit-dialog',
  templateUrl: './submit-dialog.component.html',
  styleUrls: ['./submit-dialog.component.scss']
})
export class SubmitDialogComponent implements OnInit, AfterViewInit {

  constructor(private matDialogRef: MatDialogRef<SubmitDialogComponent>) { }
  focus = true;
  @ViewChild('matDialogSubmit', {static: true}) dialogRef: ElementRef;
  ngOnInit() {
   
  }
  ngAfterViewInit():void {
    console.log(this.dialogRef.nativeElement.innerHTML);
    this.dialogRef.nativeElement.click();
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
