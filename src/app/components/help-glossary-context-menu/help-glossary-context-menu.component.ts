import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

  ngOnInit() {
  }

  edit() {
    this.editHelpItem.emit(JSON.stringify({
      helpGlossaryId: this.helpId,
      name: this.helpName,
      description: this.helpDescription
    }));
  }

}
