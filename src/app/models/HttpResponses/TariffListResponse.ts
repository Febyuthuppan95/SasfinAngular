import {Outcome} from './Outcome';

export class TariffListResponse {
  outcome: Outcome;
  tariffList: Tariff[];
  rowCount: number;
}

export class Tariff {
  rowNum: number;
  id: number;
  // tariffID: number;
  // tariffCode: string;
  // tariffName: string;
  Amount: number;
  Description: string;
  Duty: number;
  hsUnit: string;
  // quality538: string;
}
