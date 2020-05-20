import { ClassMethod } from '@angular/compiler';

export class TableConfig {
  headings: TableHeading[];
  header: TableHeader;
  dataset: object[];
  recordsPerPage: number;
  rowStart?: number;
  rowEnd?: number;
  rowCount?: number;
  orderBy?: string;
  orderByDirection?: string;
  events?: {
    search?: any,
    order?: any,
    pageChange?: any,
    addButton?: any,
    backButton?: any
  };
}

export class TableHeading {
  title: string;
  propertyName: string;
  order: {
    enable: boolean,
    tag?: string,
  };
  styleType?: string;
  style?: {
    posClass?: string,
    negClass?: string,
    neg: string,
    pos: string
  };
  position?: number
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
