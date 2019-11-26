export class AddBackground {
  src: File;
  name: string;
}

export class BackgroundListRequest {
  userID: number;
  specificBackgroundID: number;
  filter: string;
  orderBy: string;
  orderByDirection: string;
  rowStart: number;
  rowEnd: number;
}
