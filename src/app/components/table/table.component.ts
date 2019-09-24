import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { TableHeading, SelectedRecord, Order, TableHeader } from 'src/app/models/Table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {
  @Input() headings: TableHeading[];
  @Input() dataset: object[];
  @Input() enableFilters: boolean;
  @Input() recordsPerPage: number;
  @Input() rowStart: number;
  @Input() rowEnd: number;
  @Input() rowCount: number;
  @Input() orderBy: string;
  @Input() orderByDirection: string;
  @Input() tableHeader: TableHeader;

  @Output() selectedRecord = new EventEmitter<SelectedRecord>();
  @Output() orderChange = new EventEmitter<Order>();
  @Output() pageChange = new EventEmitter<string>();

  @Output() addButtonEvent = new EventEmitter<void>();
  @Output() backButtonEvent = new EventEmitter<void>();
  @Output() showingRecordsEvent = new EventEmitter<number>();
  @Output() searchEvent = new EventEmitter<string>();

  displayData: any[] = [];
  currentTheme: string;
  selectedRow: number;
  paginate: boolean;
  orderIndicator: string;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    console.log(this.recordsPerPage);
    console.log(this.rowCount);
    this.loadTable();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loadTable();
  }

  loadTable() {
    this.displayData = [];
    this.selectedRow = -1;
    this.paginate = false;
    let objectKeys: string[];
    let objectValues: string[];
    let field: object = null;
    let record: any[] = [];

    // Iterate through each object in our dataset list
    this.dataset.forEach((obj) => {

      // Obtain object keys and values for each record
      objectKeys = Object.keys(obj);
      objectValues = Object.values(obj);

      // Reset record variable
      record = [];

      // Determine what values need to be displayed
      this.headings.forEach((heading) => {

        // Iterate through object keys of a single record
        objectKeys.forEach((element: string, i: number) => {

          // If property key matches 'heading.propertyName'
          if (element === heading.propertyName) {

            // Create object for new record array
            field = {
              key: element,
              value: objectValues[i]
            };

            // Push object to record array
            record.push(field);
          }
        });
      });

      // Record populated, pushing to displayData
      this.displayData.push(record);
    });

    if (this.rowCount !== undefined) {
      this.paginate = true;
    }

    this.updateSort(this.orderBy);
    this.themeService.observeTheme().subscribe(theme => this.currentTheme = theme);
  }

  recordChangeEvent($event, obj, index) {
    this.selectedRow = index;
    this.selectedRecord.emit({ event: $event, record: obj, index });
  }

  updateSort(orderBy: string) {
    if (this.orderBy === orderBy) {
      if (this.orderByDirection === 'ASC') {
        this.orderByDirection = 'DESC';
      } else {
        this.orderByDirection = 'ASC';
      }
    } else {
      this.orderByDirection = 'ASC';
    }
    this.orderBy = orderBy;
    this.orderIndicator = `${this.orderBy}_${this.orderByDirection}`;
  }

  // Table Events
  pageChangeEvent = ($event) => this.pageChange.emit($event);
  orderChangeEvent = (orderBy: string) => {
    this.updateSort(orderBy);
    this.orderChange.emit({ orderBy, orderByDirection: this.orderByDirection });
  }

  addButton = () => this.addButtonEvent.emit();
  backButton = () => this.backButtonEvent.emit();
  search = ($event) => this.searchEvent.emit($event);
  recordsPerPageChange = ($event) => this.showingRecordsEvent.emit($event);

}
