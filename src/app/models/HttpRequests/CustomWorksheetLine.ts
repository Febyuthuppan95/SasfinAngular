import { AttachmentErrorResponse } from '../HttpResponses/AttachmentErrorResponse';

export class CustomWorksheetLineReq {

  // attachmentErrors: AttachmentErrorResponse;

  customWorksheetID?: number;
  customWorksheetLineID?: number;
  tariffHeading: string;
  hsQuantity: number;
  foreignInv: number;
  custVal: number;
  duty: number;
  commonFactor: string;
  unitOfMeasureID: number;
  cooID: number;
  cooError?: string;
  invoiceNo: number;
  hsQuantityError?: string;
  foreignInvError?: string;
  custValError?: string;
  dutyError?: string;
  commonFactorError?: string;
  isPersistant?: boolean;
  userID?: number;
  prodCode: number;
  tariffID: number;
  vat: number;
  supplyUnit: number;
  currencyID: number;

  cooOBit: boolean;
  cooOUserID: number;
  cooODate: Date;
  cooOReason: string;

  tariffHeadingOBit: boolean;
  tariffHeadingOUserID: number;
  tariffHeadingODate: Date;
  tariffHeadingOReason: string;

  hsQuantityOBit: boolean;
  hsQuantityOUserID: number;
  hsQuantityODate: Date;
  hsQuantityOReason: string;

  foreignInvOBit: boolean;
  foreignInvOUserID: number;
  foreignInvODate: Date;
  foreignInvOReason: string;

  custValOBit: boolean;
  custValOUserID: number;
  custValODate: Date;
  custValOReason: string;

  dutyOBit: boolean;
  dutyOUserID: number;
  dutyODate: Date;
  dutyOReason: string;

  commonFactorOBit: boolean;
  commonFactorOUserID: number;
  commonFactorODate: Date;
  commonFactorOReason: string;

  invoiceNoOBit: boolean;
  invoiceNoOUserID: number;
  invooiceNoODate: Date;
  invoiceNoOReason: string;

  prodCodeOBit: boolean;
  prodCodeOUserID: number;
  prodCodeODate: Date;
  prodCodeOReason: string;

  vatOBit: boolean;
  vatOUserID: number;
  vatODate: Date;
  vatOReason: string;

  supplyUnitOBit: boolean;
  supplyUnitOUserID: number;
  supplyUnitODate: Date;
  supplyUnitOReason: string;
}
