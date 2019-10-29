import {Outcome} from './Outcome';

export class ItemServiceListResponse {
  outcome: Outcome;
  itemServices: ItemService[];
  rowCount: number;
}

export class ItemService {
  rowNum: number;
  serviceID: number;
  serviceName: string;
  itemName: string;
  itemID: number;
  itemServiceID: number;
}
