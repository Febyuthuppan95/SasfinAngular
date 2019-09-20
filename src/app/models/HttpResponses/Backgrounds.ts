import { Outcome } from './Outcome';

export class BackgroundsAdd {
  outcome: Outcome;
}

export class BackgroundList {
  rowNum: number;
  backgroundID: number;
  name: string;
  image: string;
}


export class BackgroundListResponse {
  outcome: Outcome;
  backgroundList: BackgroundList[];
  rowCount: number;
}
