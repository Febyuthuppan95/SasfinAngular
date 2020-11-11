export class GetCompanyBOMs {
  userID: number;
  companyID: number;
  filter: string;
  orderBy: string;
  orderByDirection: string;
  rowStart: number;
  rowEnd: number;
}

export class UpdateCompanyBOMs {
  userID: number;
  BOMID: number;
}
