import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { MatTableDataSource, PageEvent } from '@angular/material';
import { TableHeading } from 'src/app/models/Table';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-nested-table',
  templateUrl: './nested-table.component.html',
  styleUrls: ['./nested-table.component.scss']
})
export class NestedTableComponent implements OnInit, OnChanges {

  // Inputs
  columnsToDisplay: string[] =[];
  noData: boolean = false;
  @Input() parents: Object[] = [];
  @Input() action_icon: string;
  @Input() filter?: boolean;
  @Input() paginator: PageEvent;
  @Input() pageSizeOptions: string[] = [];
  @Input() noDataError: string;
  //@Input() config: MatTableConfig;
  
  @Input() headings: TableHeading[];
  @Output() getChildrenEvent = new EventEmitter<number>();
  @Output() rowEvent = new EventEmitter<string>();
  @Output() pageEvent = new EventEmitter<PageEvent>();
  // Initializing
  loading = false;
  displayData: any[] = [];
  parentDataSource =  new MatTableDataSource<Object>(this.parents);
  currentTheme: string;
  
  constructor(private themeService: ThemeService) 
  {
     

  }

  ngOnInit() {
    // console.log(this.config);
    // if (this.config !== null && this.config !== undefined) {
    //   if(this.config.data !== null && this.config.data !== undefined) {
    //     this.parents = this.config.data;
    //   }
    // }
    this.themeService.observeTheme().subscribe(theme => {
      this.currentTheme = theme;
    });
    this.columnsToDisplay = [];
    
    this.initTable();

  }
  ngOnChanges($event: SimpleChanges) {
    
    this.initTable();
  }
  initTable() {
    this.loading = true;
    this.displayData = [];
    this.columnsToDisplay = [];

    if ( this.parents.length > 0) {
      this.headings.forEach(x => {
        if (x.title !== 'IDtop' && x.title !== 'IDbottom'){
          x.propertyName = x.propertyName.toLowerCase();
          this.columnsToDisplay.push(x.propertyName);
        }
      });
   
      this.columnsToDisplay.push('action');
      
      let field: object = null;
      
      let objectKeys: string[];
      let objectValues: string[];
   
      this.headings.forEach(obj => {
        obj.propertyName = obj.propertyName.toLowerCase();
      });
      this.parents.forEach((obj) => { // 8
        objectKeys = Object.keys(obj);
        objectValues = Object.values(obj);
       
        let record: any[] = [];
        // Determine what values need to be displayed
        this.headings.forEach((heading) => { // 7 : 8x7 = 56
          console.log(heading);
          if (objectValues[objectKeys.findIndex(x => x.toLowerCase() === heading.propertyName)] !== null
          && objectValues[objectKeys.findIndex(x => x.toLowerCase() === heading.propertyName)] !== undefined) {
            // Create object for new record array
            field = {
              key: heading,
              value: objectValues[objectKeys.findIndex(x => x.toLowerCase() === heading.propertyName)]
            };
            // Push object to record array
            record.push(field);
          }
        });
        // Record populated, pushing to displayData
        record.push({
          key: "action",
          value: -1
          });
        this.displayData.push(record);
      });
    } else {
      this.noData = true;
    }
   
    this.loading = false;
    
  }
  loadDataAsync() {

  }
  what($event, $event2) {
    console.log($event);
    console.log($event2);
  }
  rowAction($event) {
    console.log($event[6].value);
    this.rowEvent.emit(JSON.stringify({lineA: $event[6].value, lineB: $event[7].value}));
  }
  paginate($event: PageEvent) {
    this.pageEvent.emit($event);
    // this.loadDocuments();
    console.log($event);
  }


}

export class MatTableConfig {
  //data 
  data: any[];
  columns: MatTableColumn[];
  // Action Column
  showAction?: boolean;
  actionIcon: string;
}
export class MatTableColumn {
  name: string;
  isSort: boolean;
  isFilter: boolean;
}
