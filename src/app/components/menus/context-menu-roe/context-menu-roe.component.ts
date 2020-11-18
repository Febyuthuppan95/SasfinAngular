import { Route } from '@angular/compiler/src/core';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/Company.Service';
import { UserService } from 'src/app/services/user.Service';

@Component({
  selector: 'app-context-menu-roe',
  templateUrl: './context-menu-roe.component.html',
  styleUrls: ['./context-menu-roe.component.scss']
})
export class ContextMenuRoeComponent implements OnInit {

  constructor(private router: Router, private companyService: CompanyService, private userService: UserService) { }

  @Input() ROEDateID: number;
  @Input() currentTheme: string;
  @Output() RemovingROE =  new EventEmitter<number>();

  currentUser = this.userService.getCurrentUser();

  ngOnInit() {
  }

  ROELines() {
    this.companyService.setROE({ ROEDateID: this.ROEDateID});
    this.router.navigate(['exchangrates', 'roe']);
  }

  RemoveROE() {
    console.log('yes');
    this.RemovingROE.emit(this.ROEDateID);
  }

}
