import {Outcome} from './Outcome';

export class CompanyServiceClaimsListResponse {
  outcome: Outcome;
  serviceClaims: CompanyServiceClaim[];
  rowCount: number;
}

export class CompanyServiceClaim {
  rowNum: number;
  companyServiceClaimNumber: number;
  companyServiceID: number;
  serviceName: string;
  serviceID: number;
}
