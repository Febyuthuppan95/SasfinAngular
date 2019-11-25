import {Outcome} from './Outcome';

export class SAD500LinesByPermitResponse {
  outcome: Outcome;
  permits: SAD500LinesByPermit[];
  rowCount: number;
}

export class SAD500LinesByPermit {
  rowNum: number;
  permitID: number;
  permitCode: string;
  SAD500LineID: number;
  SAD500Line: string;
}
