import { Outcome } from './DoctypeResponse';

export class Currency {
  rowNum: number;
  currencyID: number;
  code: string;
  name: string;
  factor: string;
}

export class CurrencyListResponse {
  currenciesList: Currency[];
  outcome: Outcome;
  rowCount: number;
}
