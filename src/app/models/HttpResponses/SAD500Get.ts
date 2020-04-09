import { Outcome } from './Outcome';
import { AttachmentErrorResponse } from './AttachmentErrorResponse';

export class SAD500Get {
  attachmentErrors: AttachmentErrorResponse;

  importersCode: string;
  customReleaseID: number;
  serialNo: string;
  lrn: string;
  pcc: string;
  cpc: string;
  totalCustomsValue: string;
  waybillNo: string;
  supplierRef: string;
  mrn: string;
  totalDuty: string;
  fileRef: string;
  rebateCode: string;
  status: string;
  statusID: number;
  rowNum: number;

  waybillNoOBit: boolean;
  waybillNoOUserID: number;
  waybillNoODate: string;
  waybillNoOReason: string;

  serialNoOBit: boolean;
  serialNoOUserID: number;
  serialNoODate: string;
  serialNoOReason: string;

  pccOBit: boolean;
  pccOUserID: number;
  pccODate: string;
  pccOReason: string;

  supplierRefOBit: boolean;
  supplierRefOUserID: number;
  supplierRefODate: string;
  supplierRefOReason: string;

  totalCustomValueOBit: boolean;
  totalCustomValueOUserID: number;
  totalCustomValueODate: string;
  totalCustomValueOReason: string;

  lrnOBit: boolean;
  lrnOUserID: number;
  lrnODate: string;
  lrnOReason: string;

  mrnOBit: boolean;
  mrnOUserID: number;
  mrnODate: string;
  mrnOReason: string;

  cpcOBit: boolean;
  cpcOUserID: number;
  cpcODate: string;
  cpcOReason: string;

  importersCodeOBit: boolean;
  importersCodeOUserID: number;
  importersCodeODate: string;
  importersCodeOReason: string;

  fileRefOBit: boolean;
  fileRefOUserID: number;
  fileRefODate: string;
  fileRefOReason: string;

  totalDutyOBit: boolean;
  totalDutyOUserID: number;
  totalDutyODate: string;
  totalDutyOReason: string;
}

export class SAD500ListResponse {
  sad500s: SAD500Get[];
  rowCount: number;
  outcome: Outcome;
}
