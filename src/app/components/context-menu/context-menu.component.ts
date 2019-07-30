import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {

  constructor() { }
  @Input() x = 0;
  @Input() y = 0;
  @Input() designationId = 0;
  @Input() designationName = 0;
  @Input() currentTheme = '';

  ngOnInit() {

  }

}
