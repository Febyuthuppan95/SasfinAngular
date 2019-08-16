import { Outcome } from './Outcome';

export class ListCitiesResponse {
  citiesLists: City[];
  rowCount: number;
  outcome: Outcome;
}

export class City {
  cityID: number;
  regionID: number;
  countryID: number;
  rowNum: number;
  name: string;
  region: string;
  country: string;
}
