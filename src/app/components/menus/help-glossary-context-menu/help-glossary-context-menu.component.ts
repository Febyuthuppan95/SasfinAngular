import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-help-glossary-context-menu',
  templateUrl: './help-glossary-context-menu.component.html',
  styleUrls: ['./help-glossary-context-menu.component.scss']
})
export class HelpGlossaryContextMenuComponent implements OnInit {

  constructor() { }

  @Input() x: number;
  @Input() y: number;
  @Input() helpId: number;
  @Input() helpName: string;
  @Input() helpDescription: string;
  @Input() currentTheme: string;

  @Output() editHelpItem = new EventEmitter<string>();
  @Output() deleteHelpItem = new EventEmitter<string>();
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

  edit() {
    this.editHelpItem.emit(JSON.stringify({
      helpGlossaryId: this.helpId,
      name: this.helpName,
      description: this.helpDescription
    }));
  }

  delete() {
    this.deleteHelpItem.emit(JSON.stringify({
      helpGlossaryId: this.helpId,
      name: this.helpName,
      description: this.helpDescription
    }));
  }

}
