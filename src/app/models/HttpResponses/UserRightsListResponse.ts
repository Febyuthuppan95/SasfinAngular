import {Outcome} from './Outcome';
import {UserRightsList} from './UserRightsList';

export class UserRightsListResponse {
  outcome: Outcome;
  rowCount: number;
  userRightsList: UserRightsList[];
}
