import {Outcome} from './Outcome';

export class CompanyBOMsListResponse {
  outcome: Outcome;
  companyBoms: CompanyBOM[];
  rowCount: number;
}

export class CompanyBOM {
  rowNum: number;
  bomInput: number;
  status: string;
  bomid: number;
}
