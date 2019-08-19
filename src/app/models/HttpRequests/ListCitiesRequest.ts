import { ListBase } from './ListBase';

export class ListCitiesRequest extends ListBase {
  specificCountryID: number;
  specificRegionID: number;
  specificCityyID: number;
}
