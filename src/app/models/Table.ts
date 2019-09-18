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
