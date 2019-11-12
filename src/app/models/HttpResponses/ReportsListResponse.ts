import {Outcome} from './Outcome';

export class ReportsListResponse {
  outcome: Outcome;
  reportsLists: Report[];
  rowCount: number;
}

export class Report {
  itemsrowNum: number;
  reportID: number;

}
