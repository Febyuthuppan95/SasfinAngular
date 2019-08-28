import { Outcome } from './Outcome';

export class CompanyInfoResponse {
  outcome: Outcome;
  rowCount: number;
  companyInfo: CompanyInfo[];
}

export class CompanyInfo {
  rowNum: number;
  companyInfoID: number;
  company: string;
  companyInfo: string;
  companyInfoType: string;
}
