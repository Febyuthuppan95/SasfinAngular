import { Outcome } from './Outcome';
import { AddressType } from './AddressType';

export class AddressTypesListResponse {
  outcome: Outcome;
  AddressTypesList: AddressType[];
  rowCount: number;
}
