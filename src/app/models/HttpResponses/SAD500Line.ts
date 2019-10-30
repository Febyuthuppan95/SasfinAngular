import { Outcome } from './Outcome';

export class SPSAD500LineList {
    rowCount: string;
    lines: SAD500Line[];
    outcome: Outcome;
}

export class SAD500Line {
    rowNum: number;
    sad500LineID: number;
    sad500ID: number;
    cpc: string;
    tariffID: number;
    tariff: string;
    customsValue: number;
    lineNo: string;
    unitOfMeasureID: number;
    unitOfMeasure: string;
    productCode: string;
    value: string;
    cpcError?: string;
    tariffError?: string;
    customsValueError?: number;
    lineNoError?: string;
    unitOfMeasureError?: string;
    productCodeError?: string;
    valueError?: string;
}
