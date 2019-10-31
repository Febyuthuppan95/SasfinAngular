import {Outcome} from './Outcome';

export class BOMsLinesResponse {
  outcome: Outcome;
  BOMLines: BOMLine[];
  rowCount: number;
}

export class BOMLine {
  itemsrowNum: number;
  itemID: number;
  groupID: number;
  item: string;
  description: string;
  tariff: number;
  vulnerable: string;
}
