import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/Company.Service';

@Component({
  selector: 'app-context-menu-company-items',
  templateUrl: './context-menu-company-items.component.html',
  styleUrls: ['./context-menu-company-items.component.scss']
})
export class ContextMenuCompanyItemsComponent implements OnInit {

  constructor(private router: Router, private companyService: CompanyService) { }

  @Input() x: number;
  @Input() y: number;

  @Input() itemID: number;
  @Input() groupID: string;
  @Input() item: string;
  @Input() currentTheme: string;

  @Output() addtoGroup = new EventEmitter<string>();
  @Output() iteminformation = new EventEmitter<string>();

  ngOnInit() {

  }

  companyItems() {
    this.companyService.setItem({ groupID: this.groupID, itemName: this.item, itemID: this.itemID });
    this.router.navigateByUrl('companies/items/alternates');
}

  AddtoGroup() {
    this.addtoGroup.emit(JSON.stringify({
      itemID: this.itemID
    }));
  }

  ItemValues() {
    this.companyService.setItem({ groupID: this.groupID, itemName: this.item, itemID: this.itemID });
    this.router.navigateByUrl('companies/items/itemvalues');
  }
}



