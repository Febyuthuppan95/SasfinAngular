import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { TableHeading, SelectedRecord, Order, TableHeader, TableConfig } from 'src/app/models/Table';
import { MatDialog } from '@angular/material';
import { ImagePreviewDialogComponent } from './image-preview-dialog/image-preview-dialog.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() config: TableConfig;
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
  @Input() selectedRecordIndex?: number;

  @Output() selectedRecord = new EventEmitter<SelectedRecord>();
  @Output() orderChange = new EventEmitter<Order>();
  @Output() pageChange = new EventEmitter<string>();
  @Output() addButtonEvent = new EventEmitter<void>();
  @Output() backButtonEvent = new EventEmitter<void>();
  @Output() showingRecordsEvent = new EventEmitter<number>();
  @Output() searchEvent = new EventEmitter<string>();

  currentTheme: string;
  toggleFilter = true;
  searchQuery: string;
  displayData: any[] = [];
  selectedRow: number;
  paginate: boolean;
  orderIndicator: string;
  count = 0;

  private unsubscribe$ = new Subject<void>();
  constructor(private themeService: ThemeService, private dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.config !== null && this.config !== undefined) {
      if (this.config.dataset !== null && this.config.dataset !== undefined) {
        this.dataset = this.config.dataset;
      }
    }
    if (this.recordsPerPage === 0) {
      this.recordsPerPage = 15;
    }
    this.loadTable();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loadTable();
    if (this.selectedRecordIndex !== undefined) {
      this.selectedRow = this.selectedRecordIndex;
    }
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

    console.log(this.rowCount);

    if (this.rowCount !== undefined) {
      this.paginate = true;
    }

    this.updateSort(this.orderBy);
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(theme => this.currentTheme = theme);
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
      this.orderByDirection = 'DESC';
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
  search = () => this.searchEvent.emit(this.searchQuery);
  recordsPerPageChange = ($event) => this.showingRecordsEvent.emit($event);
  toggleFilters = () => this.toggleFilter = !this.toggleFilter;

  // Extra
  previewImage(src: string) {
    this.dialog.open(ImagePreviewDialogComponent, {
      data: {
        src
      },
      width: '256px',
      height: '256px'
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
