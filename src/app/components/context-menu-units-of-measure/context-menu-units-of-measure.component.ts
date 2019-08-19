import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-context-menu-units-of-measure',
  templateUrl: './context-menu-units-of-measure.component.html',
  styleUrls: ['./context-menu-units-of-measure.component.scss']
})
export class ContextMenuUnitsOfMeasureComponent implements OnInit {

  constructor() { }

  @Input() x: number;
  @Input() y: number;
  @Input() unitId: number;
  @Input() unitName: string;
  @Input() unitDescription: string;
  @Input() currentTheme: string;

  @Output() editUnit = new EventEmitter<string>();
  ngOnInit() {
  }

  edit() {
    this.editUnit.emit(JSON.stringify({
      unitOfMeasureID: this.unitId,
      name: this.unitName,
      description: this.unitDescription
    }));
  }

}
