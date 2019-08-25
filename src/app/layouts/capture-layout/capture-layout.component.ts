import { Component, OnInit, HostListener } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/HttpResponses/User';
import { UserService } from 'src/app/services/user.Service';
import { Router } from '@angular/router';
import { MatBottomSheetRef, MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-capture-layout',
  templateUrl: './capture-layout.component.html',
  styleUrls: ['./capture-layout.component.scss']
})
export class CaptureLayoutComponent implements OnInit {

  constructor(private themeService: ThemeService, private userService: UserService, private router: Router,
              private bottomSheet: MatBottomSheet) { }

  currentBackground: string;
  currentTheme: string;
  currentUser: User;

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    this.themeService.observeBackground().subscribe((result: string) => {
      if (result !== undefined) {
        this.currentBackground = `${environment.ApiBackgroundImages}/${result}`;
      }
    });
    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  goBack() {
    this.router.navigate(['transaction', 'attachments', 2]);
  }

  openBottomSheet(): void {
    this.bottomSheet.open(CompanySheetComponent);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key) {

    }
  }
}

@Component({
  selector: 'app-company-sheet',
  templateUrl: 'company-bottom-sheet.html',
})
export class CompanySheetComponent {
  constructor(private bottomSheet: MatBottomSheetRef<CompanySheetComponent>) {}

  openLink(event: MouseEvent): void {
    this.bottomSheet.dismiss();
    event.preventDefault();
  }
}
