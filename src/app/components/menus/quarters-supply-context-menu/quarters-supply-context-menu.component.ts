import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-quarters-supply-context-menu',
  templateUrl: './quarters-supply-context-menu.component.html',
  styleUrls: ['./quarters-supply-context-menu.component.scss']
})
export class QuartersSupplyContextMenuComponent implements OnInit {

  constructor() { }
  @Input() currentTheme: string;
  @Input() companyOEMID: number;
  @Input() companyOEMName: string;
  @Input() companyOEMRefNum: string;
  @Input() quarterID: number;
  @Input() supplyID: number;

  @Input() x: number;
  @Input() y: number;

  @Output() EditQuarterSupply = new EventEmitter<string>();

  ngOnInit() {
  }
  Edit() {
    this.EditQuarterSupply.emit(JSON.stringify({
      companyOEMID: this.companyOEMID,
      companyOEMName: this.companyOEMName,
      quarterID: this.quarterID,
      supplyID: this.supplyID
    }));
  }

}
