import { Outcome } from './Outcome';

export class CustomsWorksheetListResponse {
  outcome: Outcome;
  rowCount: number;
  customsWorksheets: CustomsWorksheet[];
}

export class CustomsWorksheet {
  rowNum: number;
  lrn: number;
  fileRef: number;
  customWorksheetID: number;
  transactonID: number;
  lrnError: string;
  fileRefError: string;
}
