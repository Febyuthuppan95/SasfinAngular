import {Outcome} from './Outcome';
import {DesignationRightsList} from '../HttpResponses/DesignationRightsList';

export class DesignationRightsListResponse {
  Outcome: Outcome;
  RowCount: number;
  designationRightsList: DesignationRightsList[];
}
