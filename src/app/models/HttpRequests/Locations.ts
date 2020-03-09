import { Outcome } from './../HttpResponses/DoctypeResponse';
import { ListBase } from './ListBase';

export class ListCitiesRequest extends ListBase {
  specificCountryID: number;
  specificRegionID: number;
  specificCityyID: number;
}

export class CitiesList {
  userID: number;
  specificCityID: number;
  specificRegionID: number;
  specificCountryID: number;
  filter: string;
  rowStart: number;
  rowEnd: number;
  orderBy: string;
  orderByDirection: string;
}

export class ListCountriesRequest extends ListBase {
  specificCountryID: number;
}
export class CountriesListResponse {
  outcome: Outcome;
  countriesList: CountryItem[];
}

export class CountryItem {
  rowNum: number;
  countryID: number;
  name: string;
  code: string;
}
