import { Outcome } from './Outcome';
import { AttachmentErrorResponse } from './AttachmentErrorResponse';

export class CustomWorksheetLinesResponse {
    lines: CustomWorksheetLine[];
    rowCount: number;
    outcome: Outcome;
    attachmentErrors: AttachmentErrorResponse;
}

export class CustomWorksheetLine {
    rowNum?: number;
    customWorksheetID: number;
    customWorksheetLineID?: number;
    hsQuantity: number;
    foreignInv: number;
    custVal: number;
    duty: number;
    commonFactor: string;
    unitOfMeasureID: number;
    unitOfMeasure?: string;
    cooID: number;
    invoiceNo: number;
    prodCode: number;
    tariffID: number;
    supplyUnit: number;
    currencyID: number;
    currency?: string;
    isDeleted: number;

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

    errors?: AttachmentErrorResponse;

    // UI Controls
    isPersistant?: boolean;
    userID: number;
    generatedID?: string;
}

export class CWSLineCaptureThatSHOULDWorks {
  userID: number;
  customsWorksheetID: number;
  currencyID: number;
  unitOfMeasureID: number;
  cooID: number;
  tariffID: number;
  invoiceNo: string;
  commonFactor: number;
  hsQuantity: number;
  foreignInv: number;
  custVal: number;
  duty: number;
  prodCode: string;
  supplyUnit: number;

  // cooOBit?: boolean;
  // cooOUserID?: number;
  // cooODate?: string;
  // cooOReason?: string;

  // tariffHeadingOBit?: boolean;
  // tariffHeadingOUserID?: number;
  // tariffHeadingODate?: string;
  // tariffHeadingOReason?: string;

  // hsQuantityOBit?: boolean;
  // hsQuantityOUserID?: number;
  // hsQuantityODate?: string;
  // hsQuantityOReason?: string;

  // foreignInvOBit?: boolean;
  // foreignInvOUserID?: number;
  // foreignInvODate?: string;
  // foreignInvOReason?: string;

  // custValOBit?: boolean;
  // custValOUserID?: number;
  // custValODate?: string;
  // custValOReason?: string;

  // dutyOBit?: boolean;
  // dutyOUserID?: number;
  // dutyODate?: string;
  // dutyOReason?: string;

  // commonFactorOBit?: boolean;
  // commonFactorOUserID?: number;
  // commonFactorODate?: string;
  // commonFactorOReason?: string;

  // invoiceNoOBit?: boolean;
  // invoiceNoOUserID?: number;
  // invooiceNoODate?: string;
  // invoiceNoOReason?: string;

  // prodCodeOBit?: boolean;
  // prodCodeOUserID?: number;
  // prodCodeODate?: string;
  // prodCodeOReason?: string;

  // vatOBit?: boolean;
  // vatOUserID?: number;
  // vatODate?: string;
  // vatOReason?: string;

  // supplyUnitOBit?: boolean;
  // supplyUnitOUserID?: number;
  // supplyUnitODate?: string;
  // supplyUnitOReason?: string;
}
