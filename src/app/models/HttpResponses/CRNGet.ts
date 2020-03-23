import { Outcome } from './Outcome';
import { AttachmentErrorResponse } from './AttachmentErrorResponse';

export class CRNList {
  customs: CRNGet[];
  outcome: Outcome;
  rowCount: number;
  attachmentErrors: AttachmentErrorResponse;
}

export class CRNGet {
   customReleaseID: number;
   serialNo: string;
   lrn: string;
   importersCode: string;
   pcc: string;
   fob: string;
   waybillNo: string;
   mrn: string;
   statusID: number;
   status?: string;
   rowNum?: number;
   supplierRef: string;
   fileRef: string;
   totalDuty: number;
   totalCustomsValue: number;

   serialNoOBit: boolean;
   serialNoOUserID: number;
   serialNoODate: string;
   serialNoOReason: string;

   lrnOBit: boolean;
   lrnOUserID: number;
   lrnODate: string;
   lrnOReason: string;

   importersCodeOBit: boolean;
   importersCodeOUserID: number;
   importersCodeODate: string;
   importersCodeOReason: string;

   pccOBit: boolean;
   pccOUserID: number;
   pccODate: string;
   pccOReason: string;

   fobOBit: boolean;
   fobOUserID: number;
   fobODate: string;
   fobOReason: string;

   waybillNoOBit: boolean;
   waybillNoOUserID: number;
   waybillNoODate: string;
   waybillNoOReason: string;

   fileRefOBit: boolean;
   fileRefOUserID: number;
   fileRefODate: string;
   fileRefOReason: string;

   totalCustomsValueOBit: boolean;
   totalCustomsValueOUserID: number;
   totalCustomsValueODate: string;
   totalCustomsValueOReason: string;

   totalDutyOBit: boolean;
   totalDutyOUserID: number;
   totalDutyODate: string;
   totalDutyOReason: string;

   mrnOBit: boolean;
   mrnOUserID: number;
   mrnODate: string;
   mrnOReason: string;
}

