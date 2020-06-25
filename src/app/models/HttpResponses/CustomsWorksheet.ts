import { Outcome } from './Outcome';
import { AttachmentErrorResponse } from './AttachmentErrorResponse';

export class CustomsWorksheetListResponse {
  outcome: Outcome;
  rowCount: number;
  customsWorksheets: CustomsWorksheet[];
  attachmentErrors: AttachmentErrorResponse;
}

export class CustomsWorksheet {
  rowNum: number;
  lrn: number;
  capturerID: number;
  fileID: number;
  fileRef: number;
  customWorksheetID: number;
  transactonID: number;
  lrnError: string;
  fileRefError: string;
  waybillNo: string;
  waybillNoError: string;
  dateCreated: string;
  attachmentStatusID: number;

  waybillNoOBit: boolean;
  waybillNoOUserID: number;
  waybillNoODate: Date;
  waybillNoOReason: string;

  fileRefOBit: boolean;
  fileRefOUserID: number;
  fileRefODate: Date;
  fileRefOReason: string;

  lrnOBit: boolean;
  lrnOUserID: number;
  lrnODate: Date;
  lrnOReason: string;

}
