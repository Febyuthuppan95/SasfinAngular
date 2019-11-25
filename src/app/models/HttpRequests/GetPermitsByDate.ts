export class GetPermitsByDate {
  userID: number;
  permitID: number;
  permitDate: Date;
  companyID: number;
  filter: string;
  orderBy: string;
  orderByDirection: string;
  rowStart: number;
  rowEnd: number;
}
