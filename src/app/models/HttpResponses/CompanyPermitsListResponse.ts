import {Outcome} from './Outcome';

export class CompanyPermitsListResponse {
  outcome: Outcome;
  permits: Permit[];
  rowCount: number;
}

export class Permit {
  rowNum: number;
  permitID: number;
  permitCode: string;
  permitReference: string;
  dateStart: string;
  dateEnd: string;
  importdateStart: string;
  importdateEnd: string;
  exportdateStart: string;
  exportdateEnd: string;
}
