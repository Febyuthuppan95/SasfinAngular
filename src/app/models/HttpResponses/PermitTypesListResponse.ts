import {Outcome} from './Outcome';

export class PermitTypesListResponse {
  outcome: Outcome;
  permitTypes: PermitType[];
  rowCount: number;
}

export class PermitType {
  rowNum: number;
  permitTypeID: number;
  permitName: string;
}

