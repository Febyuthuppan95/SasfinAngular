export interface Country {
  RowNum: number;
  CountryID: number;
  Name: string;
  Code: string;
}

export interface Unit {
  RowNum: number;
  UnitOfMeasureID: number;
  Name: string;
  Description: string;
}

export interface CWSLines {
  rowNum: number;
  customWorksheetID: number;
  customWorksheetLineID: number;
  invoiceNo: string;
  cooID: number;
  tariffID: number;
  hsQuantity: number;
  foreignInv: number;
  custVal: number;
  duty: number;
  commonFactor: number;
  currencyID: number;
  currency: string;
  unitOfMeasureID: number;
  unitOfMeasure?: any;
  prodCode?: any;
  supplyUnit: number;
  cooOBit: boolean;
  cooOReason?: any;
  tariffHeadingOBit: boolean;
  tariffHeadingOReason?: any;
  hsQuantityOBit: boolean;
  hsQuantityOReason?: any;
  foreignInvOBit: boolean;
  foreignInvOReason?: any;
  custValOBit: boolean;
  custValOReason?: any;
  dutyOBit: boolean;
  dutyOReason?: any;
  commonFactorOBit: boolean;
  commonFactorOReason?: any;
  invoiceNoOBit: boolean;
  invoiceNoOReason?: any;
  prodCodeOBit: boolean;
  prodCodeOReason?: any;
  vatOBit: boolean;
  vatOReason?: any;
  supplyUnitOBit: boolean;
  supplyUnitOReason?: any;
  type: string;
  country: Country;
  unit: Unit;
  captureJoinID?: number;
}

export interface InvoiceLines {
  rowNum: number;
  invoiceLineID: number;
  invoiceID: number;
  itemID: number;
  cooID: number;
  invoiceNo: string;
  prodCode: string;
  quantity: number;
  itemValue: number;
  prodCodeError?: any;
  quantityError?: any;
  itemValueError?: any;
  dateCreated: string;
  unitPrice: number;
  unitPriceError?: any;
  totalLineValue: number;
  commonFactor: number;
  totalLineValueError?: any;
  unitOfMeasureID: number;
  unitOfMeasure?: any;
  unitOfMeasureError?: any;
  invoiceNoOBit: boolean;
  invoiceNoOUserID: number;
  invoiceNoDate?: any;
  invoiceNoReason?: any;
  prodCodeOBit: boolean;
  prodCodeOUserID: number;
  prodCodeODate?: any;
  prodCodeOReason?: any;
  quantityOBit: boolean;
  quantityOUserID: number;
  quantityODate?: any;
  quantityOReason?: any;
  itemValueOBit: boolean;
  itemValueOUserID: number;
  itemValueODate?: any;
  itemValueOReason?: any;
  unitPriceOBit: boolean;
  unitPriceOUserID: number;
  unitPriceODate?: any;
  unitPriceOReason?: any;
  totalLineValueOBit: boolean;
  totalLineValueOUserID: number;
  totalLineValueODate?: any;
  totalLineValueOReason?: any;
  captureJoinID?: number;
  type?: string;
}
