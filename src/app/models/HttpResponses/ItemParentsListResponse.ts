import {Outcome} from './Outcome';

export class ItemParentsListResponse {
  outcome: Outcome;
  itemParents: ItemParent[];
  rowCount: number;
}

export class ItemParent {
  rowNum: number;
  itemParentID: number;
  parentID: number;
  parentName: string;
  itemID: number;
  itemName: string;
  quantity: number;
  unitsOfMeasureID: number;
  unitsOfMeasureName: string;
  startDate: Date;
  endDate: Date;
  startDateText?: string;
  endDateText?: string;
}
