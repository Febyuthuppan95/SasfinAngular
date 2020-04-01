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
    customsValue: string;
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
    supplyUnit: number;
    cooID: number;
    originalLineID?: number;
    replacedByLineID?: number;
    duty?: number;

    lineNoOBit?: boolean;
    lineNoOUserID?: number;
    lineNoODate: string;
    lineNoOReason: string;

    customsValueOBit?: boolean;
    customsValueOUserID?: number;
    customsValueODate: string;
    customsValueOReason: string;

    quantityOBit?: boolean;
    quantityOUserID?: number;
    quantityODate: string;
    quantityOReason: string;

    previousDeclarationOBit?: boolean;
    previousDeclarationOUserID?: number;
    previousDeclarationODate: string;
    previousDeclarationOReason: string;

    dutyOBit?: boolean;
    dutyOUserID?: number;
    dutyODate: string;
    dutyOReason: string;

    vatOBit?: boolean;
    vatOUserID?: number;
    vatODate: string;
    vatOReason: string;

    supplyUnitOBit?: boolean;
    supplyUnitOUserID?: number;
    supplyUnitODate: string;
    supllyUnitOReason: string;
}
export class SAD500LineDutyList {
}


export class SADLineCaptureThatSHOULDWorks {
    userID: number;
    sad500ID: number;
    tariffID: number;
    unitOfMeasureID: number;
    quantity: number;
    customsValue: number;
    lineNo: string;
    previousDeclaration: string;
    duty: number;

    supplyUnit: number;
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
