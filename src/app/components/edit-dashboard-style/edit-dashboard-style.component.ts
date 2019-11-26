import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { BackgroundService } from 'src/app/services/Background.service';
import { environment } from 'src/environments/environment';
import { ObjectHelpService } from 'src/app/services/ObjectHelp.service';
import { CookieService } from 'ngx-cookie-service';
import { BackgroundListRequest } from 'src/app/models/HttpRequests/Backgrounds';
import { BackgroundList, BackgroundListResponse } from 'src/app/models/HttpResponses/Backgrounds';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-edit-dashboard-style',
  templateUrl: './edit-dashboard-style.component.html',
  styleUrls: ['./edit-dashboard-style.component.scss']
})
export class EditDashboardStyleComponent implements OnInit, OnDestroy {
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

  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.backgroundRequestModel = {
      userID: 3, // Default User ID for testing
      specificBackgroundID: -1,
      filter: '',
      orderBy: 'Name',
      orderByDirection: 'ASC',
      rowStart: 1,
      rowEnd: 15
    };

    this.loadBackgrounds();

    this.objectHelpService.observeAllow()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((allow: boolean) => {
      this.toggleHelpValue = allow;
    });

    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
