import {Outcome} from './Outcome';

export class ItemServiceListResponse {
  outcome: Outcome;
  itemservice: ItemService[];
  rowCount: number;
}

export class ItemService {
  rowNum: number;
  serviceID: number;
  serviceName: string;
  itemName: string;
  itemID: number;
}
