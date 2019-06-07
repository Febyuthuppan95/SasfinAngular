import { HttpClient } from '@angular/common/http';
import { GetUserList } from './../models/HttpRequests/GetUserList';
import { UserListResponse } from './../models/UserListResponse';

export class UserService {

  /**
   * GetUserList
   */
  public GetUserList(obj: GetUserList) {

    const requestModel = {
      _userID: 3,
      _specificUserID: -1,
      _rightName: obj.rightName,
      _filter: obj.filter,
      _rowStart: obj.rowStart,
      _rowEnd: obj.rowEnd
    };
  }
}
