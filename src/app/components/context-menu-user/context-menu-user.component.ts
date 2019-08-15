import { Component, OnInit, Input } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';

@Component({
  selector: 'app-context-menu-user',
  templateUrl: './context-menu-user.component.html',
  styleUrls: ['./context-menu-user.component.scss']
})
export class ContextMenuUserComponent implements OnInit {

  constructor(
    ) { }
    // show = false;
  @Input() x = 0;
  @Input() y = 0;
  @Input() userID = 0;
  @Input() currentTheme = '';


  ngOnInit() {
  }
  // popOff() {

  // }

}
