import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit, AfterViewInit {

  constructor(
    ) { }
  @Input() x = 0;
  @Input() y = 0;
  @Input() designationId = 0;
  @Input() designationName = 0;
  @Input() currentTheme = '';

  @Output() editDesignation = new EventEmitter<string>();

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
    if (window.innerWidth < 81 + this.x){
      this.x = window.innerWidth - 81;
    }
  }


  // edit() {
  //   this.editDesignation.emit(JSON.stringify({
  //     designationID:this.designationId
  //   }));
  // }
}
