import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-context-menu-units-of-measure',
  templateUrl: './context-menu-units-of-measure.component.html',
  styleUrls: ['./context-menu-units-of-measure.component.scss']
})
export class ContextMenuUnitsOfMeasureComponent implements OnInit, AfterViewInit {

  constructor() { }

  @Input() x: number;
  @Input() y: number;
  @Input() unitId: number;
  @Input() unitName: string;
  @Input() unitDescription: string;
  @Input() currentTheme: string;

  @Output() editUnit = new EventEmitter<string>();
  @ViewChild('popCont', {static: false}) elementView: ElementRef;
  contentHeight: number;
  contentWidth: number;
  ngOnInit() {
  }

  ngAfterViewInit(){
    this.contentHeight = this.elementView.nativeElement.offsetHeight;
    this.contentWidth = this.elementView.nativeElement.offsetWidth;
    if (window.innerHeight < this.contentHeight + this.y)
    {
      this.y = window.innerHeight - this.contentHeight;
    }
    if (window.innerWidth < 63 + this.x){
      this.x = window.innerWidth - 63;
    }
  }

  edit() {
    this.editUnit.emit(JSON.stringify({
      unitOfMeasureID: this.unitId,
      name: this.unitName,
      description: this.unitDescription
    }));
  }

}
