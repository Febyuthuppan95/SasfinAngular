export class UpdateUserRequest {
  userID: number;
  specificUserID: number;
  firstName: string;
  surname: string;
  empNo: string;
  email: string;
  specificDesignationID: number;
  specificStatusID: number;
  profileImage: string;
  extension: string;
}

export class GetUserList {
  rowEnd: number;
  rowStart: number;
  filter: string;
  userID: number;
  specificUserID: number;
  orderBy: string;
  orderDirection: string;
}

export class GetUserBackground {
  userID: number;
  specificUserID: number;
}

export class AddUserRequest {
  userID: number;
  empNo: string;
  firstName: string;
  surname: string;
  email: string;
  password: string;
  specificDesignationID: number;
  profileImage: string;
  extension: string;
}
