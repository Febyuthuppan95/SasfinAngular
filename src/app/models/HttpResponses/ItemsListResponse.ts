import {Outcome} from './Outcome';

export class ItemsListResponse {
  outcome: Outcome;
  itemsLists: Items[];
  rowCount: number;
}

export class Items {
  rowNum: number;
  itemID: number;
  groupID: number;
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
