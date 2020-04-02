import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

type AOA = any[][];

@Component({
  selector: 'app-preview-reports',
  templateUrl: './preview-reports.component.html',
  styleUrls: ['./preview-reports.component.scss']
})
export class PreviewReportsComponent implements OnInit {

  constructor() { }

  reports: Report[] = [];

  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName = 'SheetJS.xlsx';

  ngOnInit() {
    this.reports = [
      { reportFile: 'file', reportName: '521 - Report', reportID: 1, selected: false },
      { reportFile: 'file', reportName: '521 - Report', reportID: 1, selected: false },
      { reportFile: 'file', reportName: '521 - Report', reportID: 1, selected: false },
      { reportFile: 'file', reportName: '521 - Report', reportID: 1, selected: false },
    ];
  }

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = (evt.target) as DataTransfer;
    if (target.files.length !== 1) { throw new Error('Cannot use multiple files'); }
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 })) as AOA;
    };
    reader.readAsBinaryString(target.files[0]);
  }

  export(): void {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  getSelected() {
    return this.reports.filter(x => x.selected);
  }

}

export class ReportListRequest {
  claimID: number;
  // TBA
}

export class Report {
  reportFile: string;
  reportName: string;
  reportID: number;
  claimID?: number;
  // TBA

  // UI
  selected?: boolean;
}
