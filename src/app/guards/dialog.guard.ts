import { CanActivateChild, CanActivate } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogGuard implements CanActivateChild, CanActivate {
  constructor(private readonly dialog: MatDialog) {}

  canActivate() {
    if (this.dialog.openDialogs.length > 0) {
      this.dialog.closeAll();
  }

    return true;
  }

  canActivateChild(): boolean {
      if (this.dialog.openDialogs.length > 0) {
          this.dialog.closeAll();
      }

      return true;
  }
}
