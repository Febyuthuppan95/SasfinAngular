import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-add-company-permit',
  templateUrl: './add-company-permit.component.html',
  styleUrls: ['./add-company-permit.component.scss']
})
export class AddCompanyPermitComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<AddCompanyPermitComponent>) { }
  form : FormGroup;

  PermitCode: number;

  public mask = {
    // guide: true,
     //showMask: true,
     // keepCharPositions : true,
     mask: [/\d/, /\d/,/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/] // i made changes here
   };

  ngOnInit() {
    this.form = new FormGroup({
      dateStart: new FormControl(null, [Validators.required]),
      dateEnd: new FormControl(null, [Validators.required]),
      importdateStart: new FormControl(null, [Validators.required]),
      importdateEnd: new FormControl(null, [Validators.required]),
      exportdateStart: new FormControl(null, [Validators.required]),
      exportdateEnd: new FormControl(null, [Validators.required])
    })
  }

  addCompany(group : FormGroup){
    if (group.valid){

    }
  }

  toStartDate(value) {
    this.form.controls.dateStart.setValue(new Date(value));
  }

  toEndDate(value) {
    this.form.controls.dateEnd.setValue(new Date(value));
  }

  toImportStartDate(value) {
    this.form.controls.importdateStart.setValue(new Date(value));
  }

  toImportEndDate(value) {
    this.form.controls.importdateEnd.setValue(new Date(value));
  }

  toExportStartDate(value) {
    this.form.controls.exportdateStart.setValue(new Date(value));
  }

  toExportEndDate(value) {
    this.form.controls.exportdateStart.setValue(new Date(value));
  }







}
