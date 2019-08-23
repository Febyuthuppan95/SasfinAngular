import { Outcome } from './Outcome';

export class CompaniesListResponse {
  companies: Company[];
  outcome: Outcome;
  rowCount: number;
}

export class Company {
  rowNum: number;
  companyID: number;
  name: string;
  regNo: string;
  regExportNo: string;
  VATNo: string;
}
