import {Outcome} from './Outcome';
import { ItemType } from './ItemType';

export class ItemTypeListResponse {
  outcome: Outcome;
  itemTypeLists: ItemType[];
  rowCount: number;
}
