export class GetDesignationList {
  rowEnd: number;
  rowStart: number;
  filter: string;
  userID: number;
  specificDesignationID: number;
  orderByDirection: string;
  orderBy: string;
}

export class GetDesignationRightsList {
  userID: number;
  specificRightID: number;
  specificDesignationID: number;
  filter: string;
  orderBy: string;
  orderByDirection: string;
  rowStart: number;
  rowEnd: number;
}

export class AddDesignationRight {
  userID: number;
  designationID: number;
  rightID: number;
}

export class UpdateDesignationRight {
  userID: number;
  designationRightID: number;
}
