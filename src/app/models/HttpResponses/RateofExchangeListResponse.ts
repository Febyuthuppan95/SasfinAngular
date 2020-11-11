import {Outcome} from './Outcome';

export class RateofExchangeListResponse {
  outcome: Outcome;
  RatesofExchangeLists: RateofExchange[];
  rowCount: number;
}

export class RateofExchange {
  RowNum: number;
  RateOfExchangeInput: string;
  RateOfExchangeDateID: number;
  MonthID: number;
  YearID: string;
}

