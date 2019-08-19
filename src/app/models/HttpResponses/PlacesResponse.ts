import { Country } from './ListCountriesResponse';
import { ListBase } from '../HttpRequests/ListBase';

export class PlacesResponse {
  countries: Country[];
}

export class PlacesParameters extends ListBase {
  specificCountryID: number;
  specificRegionID: number;
  specificCityID: number;
}
