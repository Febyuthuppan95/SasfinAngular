import { Outcome } from './Outcome';

export class WaybillListResponse {
  outcome: Outcome;
  rowCount: number;
  waybills: Waybill[];
}

export class Waybill {
  rowNum: number;
  waybillID: number;
  waybillNo: string;
  waybillError: string;
  status: string;
  statusID: number;
}
