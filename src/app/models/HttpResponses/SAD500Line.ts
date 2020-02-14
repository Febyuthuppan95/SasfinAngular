import { Outcome } from './Outcome';

export class SPSAD500LineList {
    rowCount: string;
    lines: SAD500Line[];
    outcome: Outcome;
}

export class SAD500Line {
    rowNum?: number;
    sad500LineID?: number;
    sad500ID: number;
    tariffID: number;
    tariff: string;
    customsValue: number;
    lineNo: string;
    unitOfMeasureID: number;
    unitOfMeasure: string;
    tariffError?: string;
    customsValueError?: number;
    lineNoError?: string;
    unitOfMeasureError?: string;
    isPersist?: boolean;
    quantity: number;
    quantityError?: string;
    previousDeclaration: string;
    previousDeclarationError?: string;
    vat: number;
    supplyUnit: string;
    cooID: number;
}
export class SAD500LineDutyList {
    
}
