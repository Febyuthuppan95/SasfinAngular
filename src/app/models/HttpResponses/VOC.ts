import { Outcome } from './Outcome';

export class VOCListResponse {
  outcome: Outcome;
  rowCount: number;
  vocs: VOC[];
}

export class VOC {
  rowNum: number;
  sad500LineID: number;
  vocID: number;
  tariffID: number;
  tariff: string;
  customsValue: number;
  lineNo: string;
  unitOfMeasure: string;
  unitOfMeasureID: number;
  tariffError: string;
  customsValueError: string;
  lineNoError: string;
  unitOfMeasureError: string;
  quantity: number;
  quantityError: string;
}
