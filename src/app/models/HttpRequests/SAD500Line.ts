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
  cpc: string;
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
}

export class SAD500LineUpdateModel {
    userID: number;
    sad500ID: number;
    specificSAD500LineID: number;
    tariff: string;
    tariffID: number;
    unitOfMeasure: string;
    unitOfMeasureID: number;
    cpc: string;
    productCode: string;
    value: string;
    customsValue: number;
    lineNo: string;
    isDeleted: number;
}
