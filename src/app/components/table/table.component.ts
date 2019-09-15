import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { TableHeading, SelectedRecord } from 'src/app/models/Table';

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

  @Output() selectedRecord = new EventEmitter<SelectedRecord>();
  @Output() pageChange = new EventEmitter<string>();

  displayData: any[] = [];
  currentTheme: string;
  selectedRow: number;
  paginate: boolean;
  orderIndicator: string;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
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

    this.paginate = true;
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

  pageChangeEvent = ($event) => this.pageChange.emit($event);
}
