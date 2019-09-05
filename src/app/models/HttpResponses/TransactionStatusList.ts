import { Outcome } from './Outcome';

export class TransactionStatusesResponse {
  outcome: Outcome;
  transactionStatuses: TransactionStatus[];
  rowCount: number;
}

export class TransactionStatus {
  transactionStatusID: number;
  rowNum: string;
  name: string;
}
