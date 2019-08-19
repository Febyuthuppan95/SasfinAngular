export class UpdateLocationRequest {
  userID: number;
  locationType: string;
}

export class UpdateCountryRequest {
  userID: number;
  countryID: number;
  rightName: string;
  name: string;
  isDeleted?: boolean;
}

export class UpdateRegionRequest {
  userID: number;
  regionID: number;
  rightName: string;
  name: string;
  isDeleted?: boolean;
}

export class UpdateCityRequest {
  userID: number;
  cityID: number;
  rightName: string;
  name: string;
  isDeleted?: boolean;
}
