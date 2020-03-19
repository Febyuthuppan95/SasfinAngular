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
  fileID: number;
  transactionID: number;
  fromCompanyID: number;
  fromCompany: string;
  toCompany: string;
  invoiceNo: string;
  currencyID: number;
  invoiceNoError: string;
  toCompanyError: string;
  fromCompanyError: string;
  currencyError: string;

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
  prodCode: string;
  quantity: number;
  itemValue: number;
  prodCodeError?: string;
  quantityError?: string;
  itemValueError?: string;
  userID?: number;
  isPersist?: boolean;
  unitOfMeasureID: number;
  // unitOfMeasure: string;
  unitOfMeasureError?: string;
  totalLineValue: number;
  totalLineValueError?: string;
  unitPrice: number;
  unitPriceError?: number;
  guid?: string;
}
