import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/Company.Service';

@Component({
  selector: 'app-context-menu-company-items',
  templateUrl: './context-menu-company-items.component.html',
  styleUrls: ['./context-menu-company-items.component.scss']
})
export class ContextMenuCompanyItemsComponent implements OnInit, AfterViewInit {

  constructor(private router: Router, private companyService: CompanyService) { }

  @Input() x: number;
  @Input() y: number;

  @Input() itemID: number;
  @Input() groupID: string;
  @Input() item: string;
  @Input() currentTheme: string;

  @Output() addtoGroup = new EventEmitter<string>();
  @Output() addtoParent = new EventEmitter<string>();
  @Output() edit = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();
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
    if (window.innerWidth < 169 + this.x){
      this.x = window.innerWidth - 169;
    }
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

  ItemParents() {
    this.companyService.setItem({ groupID: this.groupID, itemName: this.item, itemID: this.itemID });
    this.router.navigateByUrl('companies/items/itemparents');
  }
  AddtoParent() {
    this.addtoParent.emit(JSON.stringify({
      itemID: this.itemID
    }));
  }
  editCompanyItem() {
    this.edit.emit(this.itemID);
  }
  removeCompanyItem(){
    this.remove.emit(this.itemID)
  }
}



