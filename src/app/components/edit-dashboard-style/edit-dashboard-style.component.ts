import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';

@Component({
  selector: 'app-edit-dashboard-style',
  templateUrl: './edit-dashboard-style.component.html',
  styleUrls: ['./edit-dashboard-style.component.scss']
})
export class EditDashboardStyleComponent implements OnInit {
  constructor(private themeService: ThemeService) {}

  @Input() show: boolean;
  @Input() toggleHelpValue: boolean;

  @Output() closeSidebar = new EventEmitter<string>();
  @Output() background = new EventEmitter<string>();
  @Output() help = new EventEmitter<boolean>();

  currentTheme = this.themeService.getTheme();

  ngOnInit() {}

  public clickEvent() {
    this.closeSidebar.emit('closeSidebar');
  }

  updateTheme(theme: string) {
    this.currentTheme = theme;
    this.themeService.setTheme(theme);
  }

  public helpCheckbox() {
    this.help.emit(this.toggleHelpValue);
  }

  updateBackground(background: string) {
    this.background.emit(background);
  }
}
