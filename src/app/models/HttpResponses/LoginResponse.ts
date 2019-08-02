import { Outcome } from './Outcome';

export class LoginResponse {
  authenticated: boolean;
  userID: number;
  empNo: string;
  firstName: string;
  surname: string;
  email: string;
  profileImage?: any;
  backroundID?: number;
  backgroundColour: string;
  designation: string;
  extension?: any;
  outcome: Outcome;
}
