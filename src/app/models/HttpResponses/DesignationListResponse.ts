import {Outcome} from './Outcome';
import {DesignationList} from './DesignationList';

export class DesignationListResponse {
  outcome: Outcome;
  designationList: DesignationList[];
  rowCount: number;
}
