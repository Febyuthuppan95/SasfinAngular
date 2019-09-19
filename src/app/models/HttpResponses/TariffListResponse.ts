import {Outcome} from './Outcome';

export class TariffListResponse {
  outcome: Outcome;
  tariffs: Tariffs[];
  rowCount: number;
}

export class Tariffs {
  rowNum: number;
  tariffID: number;
  tariffCode: string;
  tariffName: string;
  Duty: number;
  hSUnit: string;
  quality538: string;
}
