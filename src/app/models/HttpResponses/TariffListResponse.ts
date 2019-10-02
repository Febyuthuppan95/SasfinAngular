import {Outcome} from './Outcome';

export class TariffListResponse {
  outcome: Outcome;
  tariffList: Tariff[];
  rowCount: number;
}

export class Tariff {
  // rowNum: number;
  // tariffID: number;
  // tariffCode: string;
  // tariffName: string;
  Amount: number;
  Description: string;
  Duty: number;
  Unit: string;
  // quality538: string;
}
