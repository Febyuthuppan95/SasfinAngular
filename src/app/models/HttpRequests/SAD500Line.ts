import { Outcome } from '../HttpResponses/Outcome';

export class SAD500LineListRequest {
  userID: number;
  sad500ID: number;
  specificSAD500LineID?: number;
  filter?: string;
  orderBy?: string;
  orderByDirection?: string;
  rowStart?: number;
  rowEnd?: number;
  transactionID?: number;
}

export class SadTest {
  UserID: number;
  SAD500ID: number;
  TariffID: number;
  UnitOfMeasureID: number;
  OriginalLineID: number;
  COOID: number;
  ReplacedByLineID: number;
  LineNo: string;
  CustomsValue: string;
  PreviousDeclaration: string;
  Quantity: number;
  Duty: number;
  SupplyUnit: number;
  LineNoOBit: boolean;
  LineNoOUserID: number;
  LineNoODate: string;
  LineNoOReason: string;
  CustomsValueOBit: boolean;
  CustomsValueOUserID: number;
  CustomsValueODate: string;
  CustomsValueOReason: string;
  QuantityOBit: boolean;
  QuantityOUserID: number;
  QuantityODate: string;
  QuantityOReason: string;
  PreviousDeclarationOBit: boolean;
  PreviousDeclarationOUserID: number;
  PreviousDeclarationODate: string;
  PreviousDeclarationOReason: string;
  DutyOBit: boolean;
  DutyOUserID: number;
  DutyODate: string;
  DutyOReason: string;
  VATOBit: boolean;
  VATOUserID: number;
  VATODate: string;
  VATOReason: string;
  SupplyUnitOBit: boolean;
  SupplyUnitOUserID: number;
  SupplyUnitODate: string;
  SupllyUnitOReason: string;
}

export class SAD500LineCreateRequest {
  userID: number;
  sad500ID: number;
  tariffID: number;
  unitOfMeasureID: number;
  originalLineID?: number;
  cooID: number;
  replacedByLineID?: number;
  lineNo: string;
  customsValue: string;
  previousDeclaration: string;
  quantity: number;
  duty?: number;
  supplyUnit: number;

  lineNoOBit?: boolean;
  lineNoOUserID?: number;
  lineNoODate: string;
  lineNoOReason: string;

  customsValueOBit?: boolean;
  customsValueOUserID?: number;
  customsValueODate: string;
  customsValueOReason: string;

  quantityOBit?: boolean;
  quantityOUserID?: number;
  quantityODate: string;
  quantityOReason: string;

  previousDeclarationOBit?: boolean;
  previousDeclarationOUserID?: number;
  previousDeclarationODate: string;
  previousDeclarationOReason: string;

  dutyOBit?: boolean;
  dutyOUserID?: number;
  dutyODate: string;
  dutyOReason: string;

  vatOBit?: boolean;
  vatOUserID?: number;
  vatODate: string;
  vatOReason: string;

  supplyUnitOBit?: boolean;
  supplyUnitOUserID?: number;
  supplyUnitODate: string;
  supllyUnitOReason: string;


  saved?: boolean;
  failed?: boolean;
  updateSubmit?: boolean;
  duties?: Duty[];
  sad500LineID?: number;
  rowNum?: number;
  isPersist?: boolean;
  // tariffError?: string;
  // customsValueError?: number;
  // lineNoError?: string;
  // unitOfMeasureError?: string;
  // quantityError?: string;
  // previousDeclarationError?: string;


}

export class SAD500LineUpdateModel {
    userID: number;
    sad500ID: number;
    specificSAD500LineID: number;
    // tariff: string;
    tariffID: number;
    // unitOfMeasure: string;
    unitOfMeasureID: number;
    customsValue: string;
    lineNo: string;
    isDeleted: number;
    quantity: number;
    cooID: number;
    supplyUnit: number;
}

export class DutyListResponse {
  outcome: Outcome;
  rowCount: number;
  duties: Duty[];
}
export class Duty {
  rowNum: number;
  duty: number;
  name: string;
  code?: string;
  value: number;
  dutyTaxTypeID: number;
  sad500Line?: number;
  vocID?: number;
}
