import {Outcome} from './Outcome';

export class GetObjectHelpResponse {
  name: string;
  description: string;
  objectHelpID: number;
  slug: string;
  viewSelector: string;
}

export interface GetObjectHelpListResponse {
  objectHelpList: GetObjectHelpResponse[];
  outcome: Outcome;
}

