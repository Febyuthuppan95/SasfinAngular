import { Outcome } from './Outcome';

export class CitiesResponse  {
  outcome: Outcome;
  rowCount: number;
  citiesLists: Cities[];
}

export class Cities {
  rowNum: number;  
  name: string;
  cityID: number;
  regionID: number;
  countryID: number;
  region: string;
  poBox: string;
  country: string;
  
}
