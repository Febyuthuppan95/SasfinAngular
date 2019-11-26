import {Outcome} from './Outcome';

export class PermitImportTariffResponse {
  outcome: Outcome;
  permitImportTariffs: PermitImportTariff[];
  rowCount: number;
}

export class PermitImportTariff {
  rowNum: number;
  permitTariffID: number;
  tariffCode: string;
  quantity: string;
  uom: string;
  price: string;
}
