import {Outcome} from './Outcome';
import {UserList} from './UserList';

export class UserListResponse {
  outcome: Outcome;
  userList: UserList[];
  rowCount: number;
}
