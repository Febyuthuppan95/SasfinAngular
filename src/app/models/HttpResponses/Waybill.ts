import { Outcome } from './Outcome';
import { AttachmentErrorResponse } from './AttachmentErrorResponse';

export class WaybillListResponse {
  outcome: Outcome;
  rowCount: number;
  waybills: Waybill[];
  attachmentErrors: AttachmentErrorResponse;
}

export class Waybill {
  rowNum: number;
  waybillID: number;
  waybillNo: string;
  waybillError: string;
  status: string;
  statusID: number;
}
