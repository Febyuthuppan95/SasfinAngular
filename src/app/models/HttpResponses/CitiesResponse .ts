import { Outcome } from './Outcome';

export class CitiesResponse  {
  outcome: Outcome;
  rowCount: number;
  citiesLists: Cities[];
}

export class Cities {
  RowNum: number;  
  Name: string;
  CityID: number;
  RegionID: number;
  CountryID: number;
  Region: string;
  poBox: string;
  Country: string;
  
}
