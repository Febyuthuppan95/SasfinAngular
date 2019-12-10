import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/Company.Service';

@Component({
  selector: 'app-context-menu-company-serviceclaim-report',
  templateUrl: './context-menu-company-serviceclaim-report.component.html',
  styleUrls: ['./context-menu-company-serviceclaim-report.component.scss']
})
export class ContextMenuCompanyServiceclaimReportComponent implements OnInit {

  constructor(private router: Router, private companyService: CompanyService) { }

  @Input() reportQueueID: number;
  @Input() reportID: number;
  @Input() reportName: number;
  @Input() compnayServiceClaimNumber: string;
  @Input() reportQueueStatusID: number;
  @Input() serviceName: string;
  @Input() currentTheme: string;

  @Output() previewService = new EventEmitter<number>();
  @Output() downloadService = new EventEmitter<number>();
  @Output() regenerateService = new EventEmitter<number>();

  ngOnInit() {}

  Preview() {
    this.previewService.emit(+this.reportQueueID);
  }

  Regenerate() {
    this.regenerateService.emit(+this.reportQueueID);
  }

  Download() {
    this.downloadService.emit(+this.reportQueueID);
  }
}


