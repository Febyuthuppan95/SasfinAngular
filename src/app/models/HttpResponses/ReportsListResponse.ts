import {Outcome} from './Outcome';

export class ReportsListResponse {
  outcome: Outcome;
  reportQueuesLists: ReportQueue[];
  rowCount: number;
}

export class ReportQueue {
  rowNum: number;
  reportQueueID: number;
  reportID: number;
  reportName: string;
  companyID: number;
  companyName: string;
  serviceID: number;
  serviceName: string;
  compnayServiceClaimNumber: number;
  reportQueueStatusID: number;
  reportQueueStatus: string;
  startDate: string;
  endDate: string;

}
