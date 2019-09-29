import { Outcome } from './Outcome';

export class CaptureInfoResponse {
  outcome: Outcome;
  captureInfo: CaptureInfoItem[];
  rowCount: number;
}

export class CaptureInfoItem {
  rowNum: number;
  captureInfoID: number;
  companyID: number;
  doctypeID: number;
  info: string;
  doctype: string;
}

