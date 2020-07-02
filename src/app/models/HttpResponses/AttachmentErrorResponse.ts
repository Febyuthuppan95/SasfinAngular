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
  attachmentErrorID: number;
  transactionID: number;
  attachmentID: number;
  FileTypeID: number;
  FileType: string;
  fieldName: string;
  errorDescription: string;
}

export class AttachmentError {
  rowNum: number;
  errorID: number;
  attachmentFieldNameID: number;
  attachmentErrorID: number;
  transactionID: number;
  attachmentID: number;
  FileTypeID: number;
  FileType: string;
  fieldName: string;
  errorDescription: string;
}
