import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-context-menu-company-add-info-types',
  templateUrl: './context-menu-company-add-info-types.component.html',
  styleUrls: ['./context-menu-company-add-info-types.component.scss']
})
export class ContextMenuCompanyAddInfoTypesComponent implements OnInit, AfterViewInit {

  constructor() { }

  @Input() x: number;
  @Input() y: number;

  @Input() companyAddInfoID: number;
  @Input() companyAddInfoTypeID: number;
  @Input() companyAddInfoTypeName: string;
  @Input() currentTheme: string;

  @Output() editCompanyAddInfoType = new EventEmitter<string>();
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
    this.editCompanyAddInfoType.emit(JSON.stringify({
      companyAdddInfoID: this.companyAddInfoID,
      companyAdddInfoTypeID: this.companyAddInfoTypeID,
      name: this.companyAddInfoTypeName
    }));
  }

}
