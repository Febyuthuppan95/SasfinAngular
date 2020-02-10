import { Outcome } from './Outcome';

export class SAD500Get {
  customReleaseID: number;
  serialNo: string;
  lrn: string;
  pcc: string;
  cpc: string;
  cpcError: string;
  totalCustomsValue: string;
  waybillNo: string;
  supplierRef: string;
  mrn: string;
  serialNoError: string;
  lrnError: string;
  pccError: string;
  totalCustomsValueError: string;
  waybillNoError: string;
  supplierRefError: string;
  mrnError: string;
  totalDuty: string;
  totalDutyError: string;
  fileRef: string;
  fileRefError: string;
  rebateCode: string;
  rebateCodeError: string;
  status: string;
  statusID: number;
  rowNum: number;
}

export class SAD500ListResponse {
  sad500s: SAD500Get[];
  rowCount: number;
  outcome: Outcome;
}
