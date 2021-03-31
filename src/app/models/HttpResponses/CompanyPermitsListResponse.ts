import {Outcome} from './Outcome';

export class CompanyPermitsListResponse {
  outcome: Outcome;
  permits: Permit[];
  rowCount: number;
}

export class CompanyPRCCsListResponse {
  outcome: Outcome;
  prccs: PRCC[];
  rowCount: number;
}

export class CompanyEPCsListResponse {
  outcome: Outcome;
  epcs: EPC[];
  rowCount: number;
}

export class Permit {
  rowNum: number;
  permitID: number;
  permitCode: string;
  permitReference: string;
  dateStart: string;
  dateEnd: string;
  importdateStart: string;
  importdateEnd: string;
  exportdateStart: string;
  exportdateEnd: string;
  filepath: string;
}

export class PRCC {
  rowNum: number;
  prccID: number;
  prccNumber: string;
  customValue: string;
  regNo: string;
  fileNo: string;
  startDate: string;
  endDate: string;
  importStartDate: string;
  importEndDate: string;
  filepath: string;
}

export class EPC {
  rowNum: number;
  epcID: number;
  epcCode: string;
  filepath: string;
}

export class ClaimPermit {
  RowNum: number;
  PermitID: number;
  PermitCode: string;
  CompanyServiceClaimPermitID: number;
}
