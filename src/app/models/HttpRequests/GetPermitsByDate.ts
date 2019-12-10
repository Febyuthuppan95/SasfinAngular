export class GetPermitsByDate {
  userID: number;
  companyID: number;
  permitstartDate: Date;
  permitsendDate: Date;
  filter: string;
  orderBy: string;
  orderByDirection: string;
  rowStart: number;
  rowEnd: number;
}
