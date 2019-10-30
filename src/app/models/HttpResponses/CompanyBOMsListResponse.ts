import {Outcome} from './Outcome';

export class CompanyBOMsListResponse {
  outcome: Outcome;
  companyBOMs: CompanyBOM[];
  rowCount: number;
}

export class CompanyBOM {
  itemsrowNum: number;
  itemID: number;
  groupID: number;
  item: string;
  description: string;
  tariff: number;
  vulnerable: string;
}
