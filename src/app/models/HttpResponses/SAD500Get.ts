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
  waybillNoODate: Date;
  waybillNoOReason: string;

  serialNoOBit: boolean;
  serialNoOUserID: number;
  serialNoODate: Date;
  serialNoOReason: string;

  pccOBit: boolean;
  pccOUserID: number;
  pccODate: Date;
  pccOReason: string;

  supplierRefOBit: boolean;
  supplierRefOUserID: number;
  supplierRefODate: Date;
  supplierRefOReason: string;

  totalCustomValueOBit: boolean;
  totalCustomValueOUserID: number;
  totalCustomValueODate: Date;
  totalCustomValueOReason: string;

  lrnOBit: boolean;
  lrnOUserID: number;
  lrnODate: Date;
  lrnOReason: string;

  mrnOBit: boolean;
  mrnOUserID: number;
  mrnODate: Date;
  mrnOReason: string;

  cpcOBit: boolean;
  cpcOUserID: number;
  cpcODate: Date;
  cpcOReason: string;

  importersCodeOBit: boolean;
  importersCodeOUserID: number;
  importersCodeODate: Date;
  importersCodeOReason: string;

  fileRefOBit: boolean;
  fileRefOUserID: number;
  fileRefODate: Date;
  fileRefOReason: string;

  totalDutyOBit: boolean;
  totalDutyOUserID: number;
  totalDutyODate: Date;
  totalDutyOReason: string;

  escalationReason: string;
}

export class SAD500ListResponse {
  sad500s: SAD500Get[];
  rowCount: number;
  outcome: Outcome;
}
