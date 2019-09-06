import { Outcome } from './Outcome';

export class CompanyContactsResponse {
  outcome: Outcome;
  rowCount: number;
  contacts: Contacts[];
}

export class Contacts {
  rowNum: number;
  contactID: number;
  company: string;
  cellNo: string;
  contact: string;
  email: string;
  landNo: string;
  contactTypeID: number;
  contactType: string;
}
