import { Outcome } from './Outcome';
import { AttachmentErrorResponse } from './AttachmentErrorResponse';

export class SPSAD500LineList {
    rowCount: string;
    lines: SAD500Line[];
    outcome: Outcome;
    attachmentErrors: AttachmentErrorResponse;
}

export class SAD500Line {
    userID?: number;
    rowNum?: number;
    sad500LineID?: number;
    sad500ID: number;
    tariffID: number;
    customsValue: number;
    lineNo: string;
    unitOfMeasureID: number;
    tariffError?: string;
    customsValueError?: number;
    lineNoError?: string;
    unitOfMeasureError?: string;
    isPersist?: boolean;
    quantity: number;
    quantityError?: string;
    previousDeclaration: string;
    previousDeclarationError?: string;
    supplyUnit: string;
    cooID: number;
    originalLineID?: number;
    replacedByLineID?: number;

    lineNoOBit: boolean;
    lineNoOUserID: number;
    lineNoODate: Date;
    lineNoOReason: string;

    customsValueOBit: boolean;
    customsValueOUserID: number;
    customsValueODate: Date;
    customsValueOReason: string;

    quantityOBit: boolean;
    quantityOUserID: number;
    quantityODate: Date;
    quantityOReason: string;

    previousDeclarationOBit: boolean;
    previousDeclarationOUserID: number;
    previousDeclarationODate: Date;
    previousDeclarationOReason: string;

    dutyOBit: boolean;
    dutyOUserID: number;
    dutyODate: Date;
    dutyOReason: string;

    vatOBit: boolean;
    vatOUserID: number;
    vatODate: Date;
    vatOReason: string;

    supplyUnitOBit: boolean;
    supplyUnitOUserID: number;
    supplyUnitODate: Date;
    supllyUnitOReason: string;
}
export class SAD500LineDutyList {
}
