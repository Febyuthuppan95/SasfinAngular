import { Outcome } from './Outcome';

export class CustomWorksheetLinesResponse {
  lines: CustomWorksheetLine[];
  rowCount: number;
  outcome: Outcome;
}

export class CustomWorksheetLine {
  rowNum: number;
  customWorksheetID: number;
  customWorksheetLineID: number;
  invoiceID: number;
  coo: string;
  tariffHeading: string;
  hsQuantity: number;
  foreignInv: number;
  custVal: number;
  duty: number;
  commonFactor: string;
}
