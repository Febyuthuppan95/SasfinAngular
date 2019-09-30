import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-context-menu-company-add-info-types',
  templateUrl: './context-menu-company-add-info-types.component.html',
  styleUrls: ['./context-menu-company-add-info-types.component.scss']
})
export class ContextMenuCompanyAddInfoTypesComponent implements OnInit {

  constructor() { }

  @Input() x: number;
  @Input() y: number;

  @Input() companyAddInfoID: number;
  @Input() companyAddInfoTypeID: number;
  @Input() companyAddInfoTypeName: string;
  @Input() currentTheme: string;

  @Output() editCompanyAddInfoType = new EventEmitter<string>();
  ngOnInit() {
  }

  edit() {
    this.editCompanyAddInfoType.emit(JSON.stringify({
      companyAdddInfoID: this.companyAddInfoID,
      companyAdddInfoTypeID: this.companyAddInfoTypeID,
      name: this.companyAddInfoTypeName
    }));
  }

}
