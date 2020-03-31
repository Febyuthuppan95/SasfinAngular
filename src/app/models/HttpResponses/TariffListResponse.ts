import {Outcome} from './Outcome';

export class TariffListResponse {
  outcome: Outcome;
  tariffList: Tariff[];
  rowCount: number;
}

export class Tariff {
  rowNum: number;
  id: number;
  itemNumber: string;
  heading: string;
  tariffCode: string;
  subHeading: string;
  checkDigit: string;
  name: string;
  duty: string;
  hsUnit: string;
}
