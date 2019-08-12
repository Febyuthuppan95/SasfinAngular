import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { BackgroundList } from 'src/app/models/HttpResponses/BackgroundList';
import { BackgroundService } from 'src/app/services/Background.service';
import { BackgroundListRequest } from 'src/app/models/HttpRequests/BackgroundList';
import { BackgroundListResponse } from 'src/app/models/HttpResponses/BackgroundListResponse';
import { environment } from 'src/environments/environment';
import { ObjectHelpService } from 'src/app/services/ObjectHelp.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-edit-dashboard-style',
  templateUrl: './edit-dashboard-style.component.html',
  styleUrls: ['./edit-dashboard-style.component.scss']
})
export class EditDashboardStyleComponent implements OnInit {
  constructor(private themeService: ThemeService, private backgroundService: BackgroundService,
              private objectHelpService: ObjectHelpService, private cookieService: CookieService) {}

  @Input() show: boolean;
  toggleHelpValue: boolean;

  @Output() closeSidebar = new EventEmitter<string>();
  @Output() background = new EventEmitter<string>();
  @Output() help = new EventEmitter<boolean>();

  currentTheme: string;
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

    this.objectHelpService.observeAllow().subscribe((allow: boolean) => {
      this.toggleHelpValue = allow;
    });

    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  public clickEvent() {
    this.closeSidebar.emit('closeSidebar');
  }

  updateTheme(theme: string) {
    this.currentTheme = theme;
    this.themeService.setTheme(theme);
  }

  public helpCheckbox() {
    this.objectHelpService.toggleHelp(this.toggleHelpValue);
  }

  updateBackground(background: BackgroundList) {
      this.themeService.setBackground(background).then(
        (res) => {},
        (msg) => {}
      );
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
