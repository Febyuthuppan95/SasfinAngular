export class TableConfig {
  headings: TableHeading[];
  header: TableHeader;
}

export class TableHeading {
  title: string;
  propertyName: string;
  order: {
    enable: boolean,
    tag?: string,
  };
  style?: {
    posClass?: string,
    negClass?: string,
    neg: string,
    pos: string
  };
}

export class SelectedRecord {
  event: any;
  record: any | object;
  index: number;
}

export class Order {
  orderBy: string;
  orderByDirection: string;
}

export class TableHeader {
  title: string;
  addButton: {
    enable: boolean
  };
  backButton: {
    enable: boolean;
  };
  filters: {
    search: boolean,
    selectRowCount: boolean,
  };
}
