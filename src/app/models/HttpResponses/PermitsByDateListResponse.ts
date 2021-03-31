import {Outcome} from './Outcome';

export class PermitsByDateListResponse {
  outcome: Outcome;
  permitByDatelist: PermitByDate[];
  rowCount: number;
}

export class PermitByDate {
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
  filepath: string;
}
