export class SAD500Line {
  userID: number;
  sad500LineID: number;
  specificSAD500LineID: number = this.sad500LineID;
  sad500ID: number;
  tariffID: number;
  unitOfMeasureID: number;
  originalLineID: number;
  cooID: number;
  replacedByLineID: number;
  lineNo: string;
  customsValue: number;
  previousDeclaration: string;
  quantity: number;
  duty: number;
  supplyUnit: number;
  isDeleted: number;
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

  // UI Variables
  isLocal?: boolean;
  uniqueIdentifier?: string;
}

export class SADLineDuty {
  userID: number;
  dutyID: number;
  sad500LineID: number;
  value: number;
}
