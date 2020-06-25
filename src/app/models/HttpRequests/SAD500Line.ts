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
  supplyUnit: number;
  LineNoOBit: boolean;
  LineNoOUserID: number;
  LineNoODate: Date;
  LineNoOReason: string;
  CustomsValueOBit: boolean;
  CustomsValueOUserID: number;
  CustomsValueODate: Date;
  CustomsValueOReason: string;
  QuantityOBit: boolean;
  QuantityOUserID: number;
  QuantityODate: Date;
  QuantityOReason: string;
  PreviousDeclarationOBit: boolean;
  PreviousDeclarationOUserID: number;
  PreviousDeclarationODate: Date;
  PreviousDeclarationOReason: string;
  DutyOBit: boolean;
  DutyOUserID: number;
  DutyODate: Date;
  DutyOReason: string;
  VATOBit: boolean;
  VATOUserID: number;
  VATODate: Date;
  VATOReason: string;
  supplyUnitOBit: boolean;
  supplyUnitOUserID: number;
  supplyUnitODate: Date;
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
  lineNoODate: Date;
  lineNoOReason: string;

  customsValueOBit?: boolean;
  customsValueOUserID?: number;
  customsValueODate: Date;
  customsValueOReason: string;

  quantityOBit?: boolean;
  quantityOUserID?: number;
  quantityODate: Date;
  quantityOReason: string;

  previousDeclarationOBit?: boolean;
  previousDeclarationOUserID?: number;
  previousDeclarationODate: Date;
  previousDeclarationOReason: string;

  dutyOBit?: boolean;
  dutyOUserID?: number;
  dutyODate: Date;
  dutyOReason: string;

  vatOBit?: boolean;
  vatOUserID?: number;
  vatODate: Date;
  vatOReason: string;

  supplyUnitOBit?: boolean;
  supplyUnitOUserID?: number;
  supplyUnitODate: Date;
  supllyUnitOReason: string;


  saved?: boolean;
  failed?: boolean;
  updateSubmit?: boolean;
  duties?: Duty[];
  sad500LineID?: number;
  rowNum?: number;
  isPersist?: boolean;


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
