export class TableConfig {
  headings: TableHeading[];
}

export class TableHeading {
  title: string;
  propertyName: string;
  order: {
    enable: boolean,
    tag?: string,
  };
  styles?: {
    positive: string,
    negative: string,
  };
}

export class SelectedRecord {
  event: any;
  record: object;
  index: number;
}

export class Order {
  orderBy: string;
  orderByDirection: string;
}
