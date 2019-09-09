import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
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

  constructor(private themeService: ThemeService,
              private userService: UserService,
              private router: Router,
              private bottomSheet: MatBottomSheet) { }

  @ViewChild('openModal', { static: true })
  openModal: ElementRef;

  @ViewChild('closeModal', { static: true })
  closeModal: ElementRef;

  currentBackground: string;
  currentTheme: string;
  currentUser: User;
  translateY: '120px';
  companyShowToggle: boolean;
  currentShortcutLabel: string = null;
  currentShortcutSequence: string[] = [];

  ngOnInit() {
    this.companyShowToggle = false;
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

  showHelp() {
    this.openModal.nativeElement.click();
  }

  /* Key Handler Directive Outputs */
  exitCaptureScreen() {
    this.router.navigate(['transaction', 'attachments', 2]);
  }
  companyInfo() {
    this.companyShowToggle = !this.companyShowToggle;
  }
  PDFScrollDown() {
  }
  PDFScrollUp() {
  }
  currentShortcut($event: string) {
    if ($event === null || undefined) {
      this.flushCurrentShortcut();
    } else {
      if ($event === 'Control') {
          this.currentShortcutLabel = $event;
      } else if ($event === 'Alt') {
          this.currentShortcutLabel += ` + ${$event}`;
      } else if ($event === 'l') {
        this.currentShortcutLabel += ` + ${$event.toLocaleUpperCase()}`;
      }
    }
  }

  flushCurrentShortcut() {
    setTimeout(() => this.currentShortcutLabel = null, 2000);
  }
}
