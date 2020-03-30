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

export class SAD500LineCreateRequest {
  userID: number;
  sad500ID: number;
  tariffID: number;
  customsValue: number;
  lineNo: string;
  unitOfMeasureID: number;
  saved?: boolean;
  failed?: boolean;
  updateSubmit?: boolean;
  duties?: Duty[];
  sad500LineID?: number;
  rowNum?: number;
  isPersist?: boolean;
  quantity: number;
  previousDeclaration: string;
  supplyUnit: string;
  cooID: number;
  tariffError?: string;
  customsValueError?: number;
  lineNoError?: string;
  unitOfMeasureError?: string;
  quantityError?: string;
  previousDeclarationError?: string;
  originalLineID?: number;
  replacedByLineID?: number;

  lineNoOBit: boolean;
  lineNoOUserID: number;
  lineNoODate: Date;
  lineNoOReason: string;

  customsValueOBit: boolean;
  customsValueOUserID: number;
  customsValueODate: Date;
  customsValueOReason: string;

  quantityOBit: boolean;
  quantityOUserID: number;
  quantityODate: Date;
  quantityOReason: string;

  previousDeclarationOBit: boolean;
  previousDeclarationOUserID: number;
  previousDeclarationODate: Date;
  previousDeclarationOReason: string;

  dutyOBit: boolean;
  dutyOUserID: number;
  dutyODate: Date;
  dutyOReason: string;

  vatOBit: boolean;
  vatOUserID: number;
  vatODate: Date;
  vatOReason: string;

  supplyUnitOBit: boolean;
  supplyUnitOUserID: number;
  supplyUnitODate: Date;
  supllyUnitOReason: string;
}

export class SAD500LineUpdateModel {
    userID: number;
    sad500ID: number;
    specificSAD500LineID: number;
    // tariff: string;
    tariffID: number;
    // unitOfMeasure: string;
    unitOfMeasureID: number;
    customsValue: number;
    lineNo: string;
    isDeleted: number;
    quantity: number;
    cooID: number;
    supplyUnit: string;
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
