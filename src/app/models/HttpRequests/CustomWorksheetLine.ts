export class CustomWorksheetLineReq {
  customWorksheetID?: number;
  customWorksheetLineID?: number;
  hsQuantity: number;
  foreignInv: number;
  custVal: number;
  duty: number;
  commonFactor: string;
  cooError?: string;
  hsQuantityError?: string;
  foreignInvError?: string;
  custValError?: string;
  dutyError?: string;
  commonFactorError?: string;
  isPersistant?: boolean;
  userID?: number;
  unitOfMeasureID: number;
  cooID: number;
  invoiceNo: number;
  prodCode: number;
  tariffID: number;
  supplyUnit: number;
  currencyID: number;
}
