import {Outcome} from './Outcome';

export class ReportsListResponse {
  outcome: Outcome;
  reportsLists: Report[];
  rowCount: number;
}

export class Report {
  rowNum: number;
  reportID: number;
  reportName: string;
  companyID: number;
  companyName: string;
  serviceID: number;
  serviceName: string;
  compnayServiceClaimNumber: number;
  status: string;

}
