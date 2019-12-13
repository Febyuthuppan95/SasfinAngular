import { Outcome } from './Outcome';

export class CaptureAttachmentResponse {
  outcome: Outcome;
  captureattachment: CaptureAttachment;
}

export class CaptureAttachment {
  transactionID: number;
  transactiondate: string;
  attachmentID: number;
  attachmentdate: string;
  companyID: number;
  companyName: string;
  filetypeID: number;
  filetype: string;
  filename: string;
  filepath: string;
}
