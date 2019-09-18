export class UpdateUserRight {
  userID: number;
  userRightID: number;
  }

export class GetUserRightsList {
  userID: number;
  specificRightID: number;
  specificUserID: number;
  filter: string;
  orderBy: string;
  orderByDirection: string;
  rowStart: number;
  rowEnd: number;
}

export class AddUserRight {
  userID: number;
  addedUserID: number;
  rightID: number;
}
