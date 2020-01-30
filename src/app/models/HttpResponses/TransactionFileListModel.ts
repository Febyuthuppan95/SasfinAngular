import { Outcome } from './Outcome';

export class TransactionFileListResponse {
  outcome: Outcome;
  attachments: TransactionFile[];
  rowCount: number;
}

export class TransactionFile {
  attachmentID: number;
  rowNum: number;
  transactionID: number;
  file: string;
  fileType: string;
  name: string;
  status: string;
  statusID: number;
  tooltip?: string;
  current?: boolean;
  issueID?: number;
  resolved?: boolean;
}
