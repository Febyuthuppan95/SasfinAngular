import { Outcome } from './Outcome';

export class CompanyAddressResponse {
  outcome: Outcome;
  rowCount: number;
  addresses: Address[];
}

export class Address {
  rowNum: number;
  addressID: number;
  company: string;
  address1: string;
  address2: string;
  address3: string;
  poBox: string;
  addressType: string;
  addressTypeID: number;
  city: string;
  cityID: number;
}
