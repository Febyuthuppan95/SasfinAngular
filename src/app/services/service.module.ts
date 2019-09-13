import { NgModule } from '@angular/core';

import { AnonGuard } from '../guards/anon.guard';
import { AuthenticationGuard } from '../guards/authentication.guard';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../helpers/auth.interceptor';

import { DesignationService } from './Designation.service';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './user.Service';
import { ThemeService } from './theme.Service';
import { MenuService } from './Menu.service';
import { BackgroundService } from './Background.service';
import { AuthenticationService } from './Authentication.service';
import { RightService } from './Right.Service';
import { UserRightService } from './UserRight.service';
import { HelpGlossaryService } from './HelpGlossary.Service';
import { HelpSnackbar } from './HelpSnackbar.service';
import { PlaceService } from './Place.Service';
import { DocumentService } from './Document.Service';
import { TransactionService } from './Transaction.Service';
import { CompanyService } from './Company.Service';
import { AddressTypesService } from './AddressTypes.Service';

@NgModule({
  providers: [
    CookieService,
    AuthenticationGuard,
    UserService,
    AnonGuard,
    ThemeService,
    AddressTypesService,
    DesignationService,
    RightService,
    MenuService,
    BackgroundService,
    UserRightService,
    HelpGlossaryService,
    PlaceService,
    TransactionService,
    HelpSnackbar,
    DocumentService,
    AuthenticationService,
    CompanyService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ]
})
export class AppModule { }
