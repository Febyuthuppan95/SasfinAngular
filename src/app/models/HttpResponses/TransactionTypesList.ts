import { Outcome } from './Outcome';

export class TransactionTypesResponse {
  outcome: Outcome;
  transactionTypes: TransactionTypes[];
  rowCount: number;
}

export class TransactionTypes {
  transactionTypeID: number;
  rowNum: string;
  name: string;
}
