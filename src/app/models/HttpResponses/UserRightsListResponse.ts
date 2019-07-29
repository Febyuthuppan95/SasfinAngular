import {Outcome} from './Outcome';
import {UserRightsList} from './UserRightsList';

export class DesignationRightsListResponse {
  outcome: Outcome;
  rowCount: number;
  userRightsList: UserRightsList[];
}
