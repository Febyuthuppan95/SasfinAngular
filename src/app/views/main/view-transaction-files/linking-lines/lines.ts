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
}
