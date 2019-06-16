import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-datatable",
  templateUrl: "./datatable.component.html",
  styleUrls: ["./datatable.component.scss"]
})
export class DatatableComponent implements OnInit {
  constructor() {}

  @Input() headings: string[];
  @Input() rows: any[];
  @Input() rowCount: number;

  @Output() nextPage = new EventEmitter<string>();

  public pageNumbers: number[];
  public activePageNumber: number;

  ngOnInit() {}

  public nextPageEvent() {
    this.nextPage.emit(this.pageNumbers[+this.activePageNumber - 1].toString());
  }
}
