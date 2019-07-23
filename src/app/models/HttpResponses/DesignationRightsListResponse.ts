import {Outcome} from './Outcome';
import {DesignationRightsList} from '../HttpResponses/DesignationRightsList';

export class DesignationRightsListResponse {
  outcome: Outcome;
  rowCount: number;
  designationRightsList: DesignationRightsList[];
}
