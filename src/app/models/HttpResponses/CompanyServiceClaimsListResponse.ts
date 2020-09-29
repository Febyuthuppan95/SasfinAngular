import {Outcome} from './Outcome';

export class CompanyServiceClaimsListResponse {
  outcome: Outcome;
  serviceClaims: CompanyServiceClaim[];
  rowCount: number;
}

export class CompanyServiceClaim {
  rowNum: number;
  companyServiceClaimNumber: number;
  userClaimNumber: string;
  companyServiceID: number;
  serviceName: string;
  exportStartDate: Date | string;
  exportEndDate: Date | string;
  claimDate: Date | string;
  extensionDays: number;
  lookBackDays: number;
  serviceID: number;
  permitCount: number;
  status: string;
}
