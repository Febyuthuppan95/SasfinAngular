import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-company-permit',
  templateUrl: './add-company-permit.component.html',
  styleUrls: ['./add-company-permit.component.scss']
})
export class AddCompanyPermitComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<AddCompanyPermitComponent>) { }

  file: any;
  filePreview: any;

  ngOnInit() {

  }

  inputFileChange(file: any) {

  }
}
