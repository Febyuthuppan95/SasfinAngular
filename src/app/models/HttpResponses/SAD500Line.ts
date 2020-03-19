import { Outcome } from './Outcome';
import { AttachmentErrorResponse } from './AttachmentErrorResponse';

export class SPSAD500LineList {
    rowCount: string;
    lines: SAD500Line[];
    outcome: Outcome;
    attachmentErrors: AttachmentErrorResponse;
}

export class SAD500Line {
    rowNum?: number;
    sad500LineID?: number;
    sad500ID: number;
    tariffID: number;
    // tariff: string;
    customsValue: number;
    lineNo: string;
    unitOfMeasureID: number;
    // unitOfMeasure: string;
    tariffError?: string;
    customsValueError?: number;
    lineNoError?: string;
    unitOfMeasureError?: string;
    isPersist?: boolean;
    quantity: number;
    quantityError?: string;
    previousDeclaration: string;
    previousDeclarationError?: string;
    // vat: number;
    supplyUnit: string;
    cooID: number;
    originalLineID: number;
    replacedByLineID: number;
}
export class SAD500LineDutyList {
}
