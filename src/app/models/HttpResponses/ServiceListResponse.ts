import {Outcome} from './Outcome';
import { Service } from './service';

export class ServiceListResponse {
  outcome: Outcome;
  serviceses: Service[];
  rowCount: number;
}
