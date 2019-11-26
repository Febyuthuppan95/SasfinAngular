import { Outcome } from './Outcome';
import { CompanyAddInfoType } from './CompanyAddInfoType';

export class CompanyAddInfoTypesListResponse {
  outcome: Outcome;
  CompanyAddInfoTypesList: CompanyAddInfoType[];
  rowCount: number;
}
