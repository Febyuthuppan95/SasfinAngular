import { Outcome } from './Outcome';

export class CaptureAttachmentResponse {
  outcome: Outcome;
  captureattachment: CaptureAttachment;
}

export class CaptureAttachment {
  captureID: number;
  transactionID: number;
  attachmentID: number;
  filetypeID: number;
  filetype: string;
  filename: string;
  filepath: string;
}
