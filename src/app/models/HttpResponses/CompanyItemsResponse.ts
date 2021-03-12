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
  vulnerable: string;
  itemType: string;
  itemTypeID: number;
  usageType: string;
  usageTypeID: number;
  itemClass: string;
  itemClassID: number;
  qualify521: boolean;
  qualify536: boolean;
  qualifyPI: boolean;
  // parentID: number;
  // mIDP: string;
  // pI: string;
  // n521: string;
  // n536: string;
  // n31761: string;
  // n31762: string;
  // n31702: string;
}
