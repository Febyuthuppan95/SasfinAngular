import {Outcome} from './Outcome';
import {DesignationRightsList} from './DesignationRightsList';

export class DesignationRightsListResponse {
  outcome: Outcome;
  rowCount: number;
  designationRightsList: DesignationRightsList[];
}
