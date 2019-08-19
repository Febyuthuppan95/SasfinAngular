import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {

  constructor(
    ) { }
  @Input() x = 0;
  @Input() y = 0;
  @Input() designationId = 0;
  @Input() designationName = 0;
  @Input() currentTheme = '';

  @Output() editDesignation = new EventEmitter<string>();

  ngOnInit() {
  }

  // edit() {
  //   this.editDesignation.emit(JSON.stringify({
  //     designationID:this.designationId
  //   }));
  // }
}
