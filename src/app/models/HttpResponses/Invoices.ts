import { Outcome } from './Outcome';
import { AttachmentErrorResponse } from './AttachmentErrorResponse';

export class InvoiceGetResponse {
  outcome: Outcome;
  rowCount: number;
  invoices: Invoice[];
  attachmentErrors: AttachmentErrorResponse;
}

export class Invoice {
  rowNum: number;
  invoiceID: number;
  invoiceDate: string;
  fileID: number;
  transactionID: number;
  cooID: number;
  companyID: number;
  invoiceNo: string;
  currencyID: number;
  incoID: number;

  invoiceNoOBit: boolean;
  invoiceNoOUserID: number;
  invoiceNoODate: string;
  invoiceNoOReason: string;
}

export class InvoiceLinesResponse {
  outcome: Outcome;
  rowCount: number;
  lines: InvoiceLine[];
  attachmentErrors: AttachmentErrorResponse;
}

export class InvoiceLine {
  rowNum?: number;
  invoiceLineID?: number;
  invoiceID?: number;
  invoiceNo?: string;
  prodCode: string;
  quantity: number;
  itemValue: number;
  cooID?: number;
  itemID?: number;
  userID?: number;
  isPersist?: boolean;
  unitOfMeasureID: number;
  totalLineValue: number;
  unitPrice: number;
  guid?: string;
  isDeleted?: boolean;
}
