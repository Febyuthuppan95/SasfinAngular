import { ItemParent } from './ItemParentsListResponse';
import {Outcome} from './Outcome';

export class BOMsLinesResponse {
  outcome: Outcome;
  bomLines: BOMLine[];
  rowCount: number;
}

export class BOMLine {
  rowNum: number;
  itemParentID: number;
  parentID: string;
  itemParent: string;
  itemID: number;
  itemchild: string;
  quantity: string;
  quarterID: string;
  PeriodYear: string;
}
export interface BOMUpload {
  outcome: Outcome;
  complete: boolean;
}
