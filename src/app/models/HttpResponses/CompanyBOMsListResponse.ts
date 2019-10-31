import {Outcome} from './Outcome';

export class CompanyBOMsListResponse {
  outcome: Outcome;
  companyBOMs: CompanyBOM[];
  rowCount: number;
}

export class CompanyBOM {
  rowNum: number;
  BOMCode: number;
  status: string;
  BOMID: number;
}
