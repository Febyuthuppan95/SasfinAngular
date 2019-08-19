import { Outcome } from './Outcome';
import { Region } from './ListRegionsResponse';

export class ListCountriesResponse {
  countriesList: Country[];
  rowCount: number;
  outcome: Outcome;
}

export class Country {
  countryID: number;
  name: string;
  rowNum: number;
  hash?: string;
  regions?: Region[];
}
