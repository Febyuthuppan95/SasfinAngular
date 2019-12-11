import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { CompanyService } from 'src/app/services/Company.Service';
import { CompaniesContextMenuComponent } from 'src/app/components/menus/companies-context-menu/companies-context-menu.component';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/HttpResponses/User';
import { Pagination } from 'src/app/models/Pagination';
import { CompaniesListResponse, Company } from 'src/app/models/HttpResponses/CompaniesListResponse';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { CompanyList, AddCompany, UpdateCompany } from 'src/app/models/HttpRequests/Company';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-capture-landing',
  templateUrl: './view-capture-landing.component.html',
  styleUrls: ['./view-capture-landing.component.scss']
})
export class ViewCaptureLandingComponent implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
    private themeService: ThemeService,
  ) {

  }
  @ViewChild(CompaniesContextMenuComponent, {static: true } )
  private contextmenu: CompaniesContextMenuComponent;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;


  defaultProfile =
    `${environment.ApiProfileImages}/default.jpg`;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  displayFilter = false;

  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  CaptureStart() {

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

