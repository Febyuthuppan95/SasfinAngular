import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  constructor() {}

  @Input() currentTheme = 'light';
  @Input() collapse = true;
  @Input() offcanvas = true;
  @Input() helpContext = false;
  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  @Output() snackBar = new EventEmitter<string>();

  ngOnInit() {}

  showSnackBar(title: string, content: string) {
    if (this.helpContext) {
      const options = {
        title,
        content
      };
      this.snackBar.emit(JSON.stringify(options));
      // console.log(options);
    }
  }

}
