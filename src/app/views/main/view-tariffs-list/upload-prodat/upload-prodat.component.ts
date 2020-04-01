import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { TariffService } from 'src/app/services/Tariff.service';

@Component({
  selector: 'app-upload-prodat',
  templateUrl: './upload-prodat.component.html',
  styleUrls: ['./upload-prodat.component.scss']
})
export class UploadProdatComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<UploadProdatComponent>,
              private tariffService: TariffService, private snackbar: MatSnackBar) { }

  ngOnInit() {
  }

  file: File;
  fileName: string = '';

  fileChange(files: FileList) {
    this.file = files.item(0);
    this.fileName = files.item(0).name;
  }

  submit() {
    this.tariffService.upload(this.file).then(
      (res) => {
        this.snackbar.open('PRODAT File Uploaded', 'OK', {
          duration: 3000
        });

        this.dialogRef.close();
      },
      (msg) => {
        this.snackbar.open('Failed to upload PRODAT File', 'OK', {
          duration: 3000
        });
      }
    );
  }

}
