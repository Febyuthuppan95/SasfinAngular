import {Outcome} from './Outcome';

export class ServiceClaimReportsListResponse {
  outcome: Outcome;
  serviceClaimReports: ServiceClaimReport[];
  rowCount: number;
}

export class ServiceClaimReport {
  rowNum: number;
  reportQueueID: number;
  reportID: number;
  reportName: string;
  serviceID: number;
  serviceName: string;
  compnayServiceClaimNumber: number;
  reportQueueStatusID: number;
  reportQueueStatus: string;
  startDate: string;
  endDate: string;
}
