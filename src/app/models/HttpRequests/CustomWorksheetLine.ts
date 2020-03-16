export class CustomWorksheetLineReq {
  customWorksheetID?: number;
  customWorksheetLineID?: number;
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
  cooODate: string;
  cooOReason: string;

  tariffHeadingOBit: boolean;
  tariffHeadingOUserID: number;
  tariffHeadingODate: string;
  tariffHeadingOReason: string;

  hsQuantityOBit: boolean;
  hsQuantityOUserID: number;
  hsQuantityODate: string;
  hsQuantityOReason: string;

  foreignInvOBit: boolean;
  foreignInvOUserID: number;
  foreignInvODate: string;
  foreignInvOReason: string;

  custValOBit: boolean;
  custValOUserID: number;
  custValODate: string;
  custValOReason: string;

  dutyOBit: boolean;
  dutyOUserID: number;
  dutyODate: string;
  dutyOReason: string;

  commonFactorOBit: boolean;
  commonFactorOUserID: number;
  commonFactorODate: string;
  commonFactorOReason: string;

  invoiceNoOBit: boolean;
  invoiceNoOUserID: number;
  invooiceNoODate: string;
  invoiceNoOReason: string;

  prodCodeOBit: boolean;
  prodCodeOUserID: number;
  prodCodeODate: string;
  prodCodeOReason: string;

  vatOBit: boolean;
  vatOUserID: number;
  vatODate: string;
  vatOReason: string;

  supplyUnitOBit: boolean;
  supplyUnitOUserID: number;
  supplyUnitODate: string;
  supplyUnitOReason: string;
}
