import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';

@Component({
  selector: 'app-edit-dashboard-style',
  templateUrl: './edit-dashboard-style.component.html',
  styleUrls: ['./edit-dashboard-style.component.scss']
})
export class EditDashboardStyleComponent implements OnInit {

  constructor(private designService: ThemeService) { }

  @Input() show = false;

  @Output() closeSidebar = new EventEmitter<string>();

  currentTheme = 'light';

  ngOnInit() {
  }

  public clickEvent() {
    this.closeSidebar.emit('closeSidebar');
  }

  updateTheme(theme: string) {
    this.currentTheme = theme;
    this.designService.setTheme(theme);
  }
}
