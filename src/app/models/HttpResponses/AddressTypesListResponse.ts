import {Outcome} from './Outcome';
import {AddressTypesList} from './AddressTypesList';

export class AddressTypesListResponse {
  outcome: Outcome;
  addressTypesList: AddressTypesList[];
  rowCount: number;
  }