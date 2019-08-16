export class ListUnitsOfMeasureRequest {
  userID: number;
  specificUnitOfMeasureID: number;
  rightName: string;
  filter: string;
  orderBy: string;
  orderByDirection: string;
  rowStart: number;
  rowEnd: number;
}
