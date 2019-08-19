import { Outcome } from './Outcome';

export class LocationsList {
  outcome: Outcome;
  rowCount: number;
  locations: LocationItems[];
}

export class LocationItems {
  rowNum: number;
  countryID: number;
  name: string;
  regionID?: number;
  region?: string;
  cityID?: number;
  city?: string;
  hash?: string;
  regions?: Regions[];
}

export class Regions {
    id: number;
    name: string;
    hash?: string;
    cities?: Cities[];
}

export class Cities {
    id: number;
    name: string;
    hash?: string;
}
