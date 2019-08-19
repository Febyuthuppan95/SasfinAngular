import { Outcome } from './Outcome';
import { BackgroundList } from './BackgroundList';

export class BackgroundListResponse {
  outcome: Outcome;
  backgroundList: BackgroundList[];
  rowCount: number;
}
