import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx'
import { CompanyService, SelectedCompany, SelectedClaimReport } from 'src/app/services/Company.Service';
import { GetServiceClaimReports } from 'src/app/models/HttpRequests/GetServiceClaimReports';
import { UserService } from 'src/app/services/user.Service';
import { User } from 'src/app/models/HttpResponses/User';
import { ServiceClaimReportsListResponse, ServiceClaimReport } from 'src/app/models/HttpResponses/ServiceClaimReportsListResponse';
import { ReportsService } from 'src/app/services/Reports.Service';
import { DomSanitizer } from '@angular/platform-browser';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import {convertToHtml} from "mammoth";

type AOA = any[][];

@Component({
  selector: 'app-preview-reports',
  templateUrl: './preview-reports.component.html',
  styleUrls: ['./preview-reports.component.scss']
})
export class PreviewReportsComponent implements OnInit {

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private reportService: ReportsService,
    private sanitizer: DomSanitizer,
    private apiService: ApiService,
  ) { }

  reports: ServiceClaimReport[] = [];
  rep: Report[] = [];
  selectedReport = '';
  currentUser: User = this.userService.getCurrentUser();
  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName = 'SheetJS.xlsx';

  @ViewChild('fileDownload', { static: false })
  fileDownload: ElementRef;

  @ViewChild('ngxDoc', {static: false})
  ngxDoc: ElementRef;

  @ViewChild('iframe', {static: false})
  iframe: ElementRef;

  file;
  claimReport: SelectedClaimReport;
  reportHTMLTest;

  ngOnInit() {
    this.companyService.observeClaimReport().subscribe((obj: SelectedClaimReport) => {
      this.claimReport = obj;
    });
    this.getClaimReports();
  }

  getClaimReports() {
    console.log(this.claimReport.claimNumber);
    const model: GetServiceClaimReports = {
      userID: this.currentUser.userID,
      companyServiceClaimID: this.claimReport.claimNumber,
      filter: '',
      rowStart: 1,
      rowEnd: 15,
      orderBy: '',
      orderByDirection: ''
    };
    this.companyService.getServiceClaimReports(model).then(
      (res: ServiceClaimReportsListResponse) => {
        console.log(res);
        if (res.outcome.outcome === 'SUCCESS') {
          this.reports = res.companyServiceClaimReports;
        } else {

        }
      },
      (msg) => {

      }
    );
  }
  getSingleReport(rep: ServiceClaimReport) {
    console.log(this.claimReport);
  // return "C:\Users\Eathon\Documents\LatSol_Documentation\SasfinGTS\521\Tempaltes\report1.xlsx";

  // GET .. ?reportID=12&claimID=23&
  // selectedReport = URL
    console.log(rep);
    const model = {
      reportID: rep.reportID,
      // claimID: this.claimReport.claimNumber,
      claimID: this.claimReport.claimNumber,
      companyID: this.claimReport.companyID,
      reportService: this.claimReport.serviceName
    };
    this.reportService.getReport(model).then(
      (res: Blob) => {
        const fileBlob = new Blob([res] , {type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(fileBlob);
        this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.fileDownload.nativeElement.download = `Report_${rep.reportID}.xlsx`;
        this.fileDownload.nativeElement.href = url;
        // let iframe = this.ngxDoc.nativeElement;
        this.selectedReport = url;
        // this.iframe.nativeElement.src = `Report_${rep.reportID}.xlsx`;
        this.fileDownload.nativeElement.click();
        console.log(url);
      });
  }

  buildGetLink(rep: ServiceClaimReport) {
    console.log(rep);
    // tslint:disable-next-line: max-line-length
    if (rep.reportQueueStatusID === 2) {
      // tslint:disable-next-line: max-line-length
      this.selectedReport =  `${environment.ApiEndpoint}/reports/preview/${rep.reportID}/${this.claimReport.claimNumber}/${this.claimReport.companyID}/${rep.serviceName}`;
    }

  }

  loaded() {
    const advertismentContainer = document.getElementsByClassName('pdfViewer');
    advertismentContainer.item(advertismentContainer.length - 1).remove();
  }

  onFileChange(evt: any) {
    console.log(evt);


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
  selectReport(rep: ServiceClaimReport) {
    // this.selectedReport = rep.re
    this.onFileChange(rep);
  }
  getSelected() {
    return this.reports.filter(x => x.selected);
  }
  downloadFiles() {
    this.reports.forEach((x: ServiceClaimReport) => {
      this.getSingleReport(x);
    });
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
export class ReportRequest {
  companyID: number;
  claimID: number;
  reportService: string;
  reportID: number;
}
