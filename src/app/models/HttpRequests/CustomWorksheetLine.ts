export class CustomWorksheetLineReq {
  customWorksheetID?: number;
  customWorksheetLineID?: number;
  invoiceID?: number;
  coo: string;
  tariffHeading: string;
  hsQuantity: number;
  foreignInv: number;
  custVal: number;
  duty: number;
  commonFactor: string;
  cooError?: string;
  tariffHeadingError?: string;
  hsQuantityError?: string;
  foreignInvError?: string;
  custValError?: string;
  dutyError?: string;
  commonFactorError?: string;
  isPersistant?: boolean;
  userID?: number;
}