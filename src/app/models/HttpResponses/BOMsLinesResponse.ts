import {Outcome} from './Outcome';

export class BOMsLinesResponse {
  outcome: Outcome;
  bomLines: BOMLine[];
  rowCount: number;
}

export class BOMLine {
  rowNum: number;
  bomLineID: number;
  tariffInput: string;
  itemNameInput: string;
  quarterInput: string;
  unitOfMeasureInput: string;
  usageTypeInput: string;
}
export interface BOMUpload {
  outcome: Outcome;
  complete: boolean;
}
