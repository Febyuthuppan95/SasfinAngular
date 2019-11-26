import { Outcome } from './Outcome';
import { ContactType } from './ContactType';

export class ContactTypesListResponse {
  outcome: Outcome;
  ContactTypesList: ContactType[];
  rowCount: number;
}
