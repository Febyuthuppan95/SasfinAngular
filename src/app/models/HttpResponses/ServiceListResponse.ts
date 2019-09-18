import {Outcome} from './Outcome';
import { Service } from './Service';

export class ServiceListResponse {
  outcome: Outcome;
  ServiceList: Service[];
  rowCount: number;
}
