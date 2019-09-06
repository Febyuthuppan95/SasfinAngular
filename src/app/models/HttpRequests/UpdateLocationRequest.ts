export class UpdateLocationRequest {
  userID: number;
  locationType: string;
}

export class UpdateCountryRequest {
  userID: number;
  countryID: number;
  name: string;
  isDeleted?: boolean;
}

export class UpdateRegionRequest {
  userID: number;
  regionID: number;
  name: string;
  isDeleted?: boolean;
}

export class UpdateCityRequest {
  userID: number;
  cityID: number;
  name: string;
  isDeleted?: boolean;
}
