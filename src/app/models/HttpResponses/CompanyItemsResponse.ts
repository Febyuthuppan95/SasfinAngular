import { Outcome } from './Outcome';

export class CompanyItemsResponse {
  outcome: Outcome;
  rowCount: number;
  items: Item[];
}

export class Item {
  rowNum: number;
  itemID: number;
  companyID: number;
  groupID: string;
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
