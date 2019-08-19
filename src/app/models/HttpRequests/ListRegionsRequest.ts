import { ListBase } from './ListBase';

export class ListRegionsRequest extends ListBase {
  specificCountryID: number;
  specificRegionID: number;
}
