import {Outcome} from './Outcome';

export class ItemsListResponse {
  outcome: Outcome;
  itemsLists: Items[];
  rowCount: number;
}

export class Items {
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

export class ItemError {
  bomID: number;
  rowNumber: number;
  tariffCode: string;
  usageType: string;
  itemType: string;
  itemclass: string;
}
