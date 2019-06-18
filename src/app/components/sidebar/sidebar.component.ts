import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  constructor() { }

  @Input() currentTheme = 'light';
  @Input() collapse = false;

  @Output() snackBar = new EventEmitter<string>();

  ngOnInit() { }

  showSnackBar(content: string) {
    this.snackBar.emit(content);
  }
}
