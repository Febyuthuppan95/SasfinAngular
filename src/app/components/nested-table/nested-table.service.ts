import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { CompanyService } from 'src/app/services/Company.Service';
import { UserService } from 'src/app/services/user.Service';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material';


@Injectable({
  providedIn: 'root'
})
export class NestedTableService implements OnInit, OnDestroy{

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private snackBar: MatSnackBar
    ) {

     }
    // Observe current claim deets
     curService: number;
     curStoredProcedure: string;
    
    ngOnInit(): void {
      // init subscriptions
      this.curService = 521;
      
    }

    readData() {

    }
    readLines() {
      
    }
    updateLine() {

    }
    updateClaim() {

    }

    ngOnDestroy(): void {
      // unsubscribe all observables
    }
  
}
