import { Outcome } from './Outcome';

export class CRNGet {
   customReleaseID: number;
   serialNo: string;
   lrn: string;
   importersCode: string;
   pcc: string;
   fob: string;
   waybillNo: string;
   supplierRef: string;
   mrn: string;
   serialNoError: string;
   lrnError: string;
   importersCodeError: string;
   pccError: string;
   fobError: string;
   waybillNoError: string;
   supplierRefError: string;
   mrnError: string;
   statusID: number;
   status?: string;
   rowNum?: number;
}

export class CRNList {
  customs: CRNGet[];
  outcome: Outcome;
  rowCount: number;
}
