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
  // cpc: string;
  // productCode: string;
  // value: number;
  lineNo: string;
  unitOfMeasureID: number;
  unitOfMeasure: string;
  saved?: boolean;
  failed?: boolean;
  updateSubmit?: boolean;
  duties?: Duty[];
  sad500LineID?: number;
  rowNum?: number;
  isPersist?: boolean;
  quantity: number;
}

export class SAD500LineUpdateModel {
    userID: number;
    sad500ID: number;
    specificSAD500LineID: number;
    tariff: string;
    tariffID: number;
    unitOfMeasure: string;
    unitOfMeasureID: number;
    customsValue: number;
    lineNo: string;
    isDeleted: number;
    quantity: number;
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
  dutyTaxTypeID: number;
  sad500Line?: number;
}
