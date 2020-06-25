import { Outcome } from './Outcome';
import { AttachmentErrorResponse } from './AttachmentErrorResponse';

export class ICIListResponse {
  outcome: Outcome;
  rowCount: number;
  clearingInstructions: ICI[];
  attachmentErrors: AttachmentErrorResponse;
}

export class ICI {
  rowNum: number;
  clearingInstructionID: number;
  importersCode: string;
  supplierRef: string;
  waybillNo: string;
  importersCodeError: string;
  supplierRefError: string;
  waybillNoError: string;
  status: string;
  statusID: number;

  supplierRefOBit: boolean;
  supplierRefOUserID: number;
  supplierRefODate: Date;
  supplierRefOReason: string;

  importersCodeOBit: boolean;
  importersCodeOUserID: number;
  importersCodeODate: Date;
  importersCodeOReason: string;

  waybillNoOBit: boolean;
  waybillNoOUserID: number;
  waybillNoODate: Date;
  waybillNoOReason: string;
}
