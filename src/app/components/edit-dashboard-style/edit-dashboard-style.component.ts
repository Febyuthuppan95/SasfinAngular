import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { BackgroundList } from 'src/app/models/HttpResponses/BackgroundList';
import { BackgroundService } from 'src/app/services/Background.service';
import { BackgroundListRequest } from 'src/app/models/HttpRequests/BackgroundList';
import { BackgroundListResponse } from 'src/app/models/HttpResponses/BackgroundListResponse';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-dashboard-style',
  templateUrl: './edit-dashboard-style.component.html',
  styleUrls: ['./edit-dashboard-style.component.scss']
})
export class EditDashboardStyleComponent implements OnInit {
  constructor(private themeService: ThemeService, private backgroundService: BackgroundService) {}

  @Input() show: boolean;
  @Input() toggleHelpValue: boolean;

  @Output() closeSidebar = new EventEmitter<string>();
  @Output() background = new EventEmitter<string>();
  @Output() help = new EventEmitter<boolean>();

  currentTheme = this.themeService.getTheme();
  imagePath = environment.ApiBackgroundImages;
  backgroundRequestModel: BackgroundListRequest;
  backgrounds: BackgroundList[];

  ngOnInit() {
    this.backgroundRequestModel = {
      userID: 3, // Default User ID for testing
      specificBackgroundID: -1,
      rightName: 'Backgrounds',
      filter: '',
      orderBy: 'Name',
      orderByDirection: 'ASC',
      rowStart: 1,
      rowEnd: 15
    };

    this.loadBackgrounds();
  }

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

  loadBackgrounds() {
    this.backgroundService.getBackgrounds(this.backgroundRequestModel).then(
      (res: BackgroundListResponse) => {
        this.backgrounds = res.backgroundList;
      },
      (msg) => {
        // Catch
      });
  }
}
