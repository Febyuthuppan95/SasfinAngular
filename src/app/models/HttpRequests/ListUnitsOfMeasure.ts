export class ListUnitsOfMeasureRequest {
  userId: number;
  specificUnitOfMeasureId: number;
  rightName: string;
  filter: string;
  orderBy: string;
  orderByDirection: string;
  rowStart: number;
  rowEnd: number;
  rowCount: number;
}
