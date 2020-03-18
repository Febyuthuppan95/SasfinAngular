import { Outcome } from './Outcome';

export class ICIListResponse {
  outcome: Outcome;
  rowCount: number;
  clearingInstructions: ICI[];
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
  supplierRefODate: string;
  supplierRefOReason: string;

  importersCodeOBit: boolean;
  importersCodeOUserID: number;
  importersCodeODate: string;
  importersCodeOReason: string;

  waybillNoOBit: boolean;
  waybillNoOUserID: number;
  waybillNoODate: string;
  waybillNoOReason: string;
}
