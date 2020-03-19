import { Outcome } from './Outcome';

export class AttachmentErrorResponse {
  outcome: Outcome;
  rowCount: number;
  attachmentErrors: Error[];
}

export class Error {
  rowNum: number;
  errorID: number;
  attachmentFieldNameID: number;
  attachmentErrorID: string;
  transactionID: string;
  attachmentID: string;
  FileTypeID: string;
  FileType: string;
  fieldName: string;
  errorDescription: number;
}
