import {Outcome} from './Outcome';

export class ServiceClaimReportsListResponse {
  outcome: Outcome;
  companyServiceClaimReports: ServiceClaimReport[];
  rowCount: number;
}

export class ServiceClaimReport {
  rowNum: number;
  file: File;
  reportQueueID: number;
  reportID: number;
  companyServiceClaimID: number;
  reportName: string;
  serviceID: number;
  serviceName: string;
  reportQueueStatusID: number;
  reportQueueStatus: string;
  startDate: string;
  endDate: string;
  selected?: boolean;
}
