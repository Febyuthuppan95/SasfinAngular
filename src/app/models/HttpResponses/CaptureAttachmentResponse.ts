import { Outcome } from './Outcome';

export class CaptureAttachmentResponse {
  outcome: Outcome;
  captureattachment: CaptureAttachment;
}

export class CaptureAttachment {
  transactionID: number;
  transactiondate: string;
  transactionType: string;
  attachmentID: number;
  attachmentdate: string;
  companyID: number;
  companyName: string;
  fileTypeID: number;
  filetype: string;
  filename: string;
  filepath: string;
  issueID?: number;
  reason?: string;
}
