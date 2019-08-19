import { Outcome } from './Outcome';
import { City } from './ListCitiesResponse';

export class ListRegionsResponse {
  regionsList: Region[];
  rowCount: number;
  outcome: Outcome;
}

export class Region {
  regionID: number;
  countryID: number;
  name: string;
  description: string;
  rowNum: number;
  hash?: string;
  cities?: City[];
}
