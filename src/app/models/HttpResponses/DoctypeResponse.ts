export class Doctype {
  rowNum: number;
  doctypeID: number;
  name: string;
}

export class Outcome {
  outcome: string;
  outcomeMessage: string;
}

export class DoctypeListResponse {
  rowCount: number;
  doctypes: Doctype[];
  outcome: Outcome;
}
