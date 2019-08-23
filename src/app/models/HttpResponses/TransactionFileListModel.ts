import { Outcome } from './Outcome';

export class TransactionFileListResponse {
  outcome: Outcome;
  files: TransactionFile[];
  rowCount: number;
}

export class TransactionFile {
  fileID: number;
  rowNum: number;
  // TODO
}
