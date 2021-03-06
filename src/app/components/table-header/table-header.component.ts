import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TableHeader } from 'src/app/models/Table';
import { ThemeService } from 'src/app/services/theme.Service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss']
})
export class TableHeaderComponent implements OnInit, OnDestroy {

  @Input() tableHeader: TableHeader;

  @Output() addButtonEvent = new EventEmitter<void>();
  @Output() backButtonEvent = new EventEmitter<void>();
  @Output() showingRecordsEvent = new EventEmitter<number>();
  @Output() searchEvent = new EventEmitter<string>();

  currentTheme: string;
  toggleFilter = true;
  recordsPerPage = 15;
  searchQuery: string;

  private unsubscribe$ = new Subject<void>();

  constructor(private themeService: ThemeService) { }

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(value => this.currentTheme = value);
  }

  toggleFilters = () => this.toggleFilter = !this.toggleFilter;

  addButton = () => this.addButtonEvent.emit();
  backButton = () => this.backButtonEvent.emit();
  search = () => this.searchEvent.emit(this.searchQuery);
  recordsPerPageChange = (recordNum: number) => this.showingRecordsEvent.emit(recordNum);

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
