import { Outcome } from './Outcome';

export class VOCListResponse {
  outcome: Outcome;
  rowCount: number;
  vocs: VOC[];
}

export class VOC {
  rowNum: number;
  vocID: number;
  fileName: string;
  referenceNo: string;
  reason: string;
  mrn: string;
  status: string;
  sad500ID: number;
  originalID: number;
}
