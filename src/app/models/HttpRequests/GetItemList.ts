export class GetItemList {
  userID: number;
  specificItemID: number;
  filter: string;
  orderBy: string;
  orderByDirection: string;
  rowStart: number;
  rowEnd: number;
  isParent?: boolean;
}
