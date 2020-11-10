import {Outcome} from './Outcome';

export class RateofExchangeListResponse {
  outcome: Outcome;
  RatesofExchangeLists: RateofExchange[];
  rowCount: number;
}

export class RateofExchange {
  itemsrowNum: number;
  itemID: number;
  groupID: number;
  item: string;
  description: string;
  tariffID: number;
  tariff: number;
  tariffName: string;
  type: string;
  typeID: number;
  vulnerable: string;
}

export class ItemGroups {
  rowNum: number;
  itemID: number;
  item: string;
  description: string;
  name: string;
  groupValue: string;
  vulnerable: string;
}

export class ItemError {
  bomID: number;
  rowNumber: number;
  tariffCode: string;
  usageType: string;
  itemType: string;
  itemclass: string;
}
