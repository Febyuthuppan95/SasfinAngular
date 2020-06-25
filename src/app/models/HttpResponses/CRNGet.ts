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
   ediStatusID?: number;

   serialNoOBit: boolean;
   serialNoOUserID: number;
   serialNoODate: Date;
   serialNoOReason: string;

   lrnOBit: boolean;
   lrnOUserID: number;
   lrnODate: Date;
   lrnOReason: string;

   importersCodeOBit: boolean;
   importersCodeOUserID: number;
   importersCodeODate: Date;
   importersCodeOReason: string;

   pccOBit: boolean;
   pccOUserID: number;
   pccODate: Date;
   pccOReason: string;

   fobOBit: boolean;
   fobOUserID: number;
   fobODate: Date;
   fobOReason: string;

   waybillNoOBit: boolean;
   waybillNoOUserID: number;
   waybillNoODate: Date;
   waybillNoOReason: string;

   fileRefOBit: boolean;
   fileRefOUserID: number;
   fileRefODate: Date;
   fileRefOReason: string;

   totalCustomsValueOBit: boolean;
   totalCustomsValueOUserID: number;
   totalCustomsValueODate: Date;
   totalCustomsValueOReason: string;

   totalDutyOBit: boolean;
   totalDutyOUserID: number;
   totalDutyODate: Date;
   totalDutyOReason: string;

   mrnOBit: boolean;
   mrnOUserID: number;
   mrnODate: Date;
   mrnOReason: string;
}

