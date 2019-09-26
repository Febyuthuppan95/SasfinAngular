import {Outcome} from './Outcome';

export class TariffListResponse {
  outcome: Outcome;
  tariffsLists: Tariff[];
  rowCount: number;
}

export class Tariff {
  rowNum: number;
  tariffID: number;
  tariffCode: string;
  tariffName: string;
  Duty: number;
  hSUnit: string;
  quality538: string;
}
