import {Outcome} from './Outcome';

export class AlternateItemsListResponse {
  outcome: Outcome;
  alternateitems: AlternateItems[];
  rowCount: number;
}

export class AlternateItems {
  rowNum: number;
  alternateID: number;
  itemID: number;
  item: string;
  description: string;
  tariff: number;
  type: string;
  usage: string;
  mIDP: string;
  pI: string;
  vulnerable: string;
  n521: string;
  n536: string;
  n31761: string;
  n31762: string;
  n31702: string;
}
