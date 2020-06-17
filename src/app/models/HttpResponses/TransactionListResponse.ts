import { Outcome } from './Outcome';

export class TransactionListResponse {
  transactions: Transaction[];
  outcome: Outcome;
  rowCount: number;
}

export class Transaction {
  rowNum: number;
  transactionID: number;
  name: string;
  type: string;
  status: string;
  sendAll: boolean;
}
