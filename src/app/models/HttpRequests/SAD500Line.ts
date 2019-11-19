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
}

export class SAD500LineCreateRequest {
  userID: number;
  sad500ID: number;
  tariffID: number;
  tariff: string;
  customsValue: number;
  lineNo: string;
  unitOfMeasureID: number;
  unitOfMeasure: string;
  productCode: string;
  value: string;
  saved?: boolean;
  failed?: boolean;
  updateSubmit?: boolean;
  duties?: Duty[];
}

export class SAD500LineUpdateModel {
    userID: number;
    sad500ID: number;
    specificSAD500LineID: number;
    tariff: string;
    tariffID: number;
    unitOfMeasure: string;
    unitOfMeasureID: number;
    productCode: string;
    value: string;
    customsValue: number;
    lineNo: string;
    isDeleted: number;
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
  dutyTaxTypeID: number;
}
