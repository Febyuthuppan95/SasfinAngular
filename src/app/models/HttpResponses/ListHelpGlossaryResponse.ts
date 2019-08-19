import { Outcome } from './Outcome';

export class ListHelpGlossaryItem {
  rowNum: number;
  helpGlossaryID: number;
  name: string;
  description: string;
}

export class ListHelpGlossaryResponse {
  helpGlossaryList: ListHelpGlossaryItem[];
  outcome: Outcome;
  rowCount: number;
}
