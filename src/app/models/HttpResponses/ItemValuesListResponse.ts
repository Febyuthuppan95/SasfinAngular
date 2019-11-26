import {Outcome} from './Outcome';

export class ItemValuesListResponse {
  outcome: Outcome;
  itemValues: ItemValue[];
  rowCount: number;
}

export class ItemValue {
  rowNum: number;
  itemValueID: number;
  itemPrice: string;
  reference: string;
  freeComponent: number;
}
