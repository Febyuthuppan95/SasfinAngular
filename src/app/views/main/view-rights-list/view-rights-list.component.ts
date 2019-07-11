import { RightService } from './../../../services/Right.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DesignationListResponse } from '../../../models/HttpResponses/DesignationListResponse';
import { DesignationList } from '../../../models/HttpResponses/DesignationList';
import { Pagination } from '../../../models/Pagination';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { ImageModalComponent } from './../../../components/image-modal/image-modal.component';
import { UserService } from '../../../services/user.Service';
import { User } from '../../../models/HttpResponses/User';
import { ThemeService } from 'src/app/services/theme.Service.js';

@Component({
  selector: 'app-view-rights-list',
  templateUrl: './view-rights-list.component.html',
  styleUrls: ['./view-rights-list.component.scss']
})
export class ViewRightsListComponent implements OnInit {
  constructor(
    private themeService: ThemeService,
    private userService: UserService,
    private RightService: RightService
  ) {
    this.rowStart = 1;
    this.rowCountPerPage = 15;
    this.rightName = 'Designations';
    this.activePage = +1;
    this.prevPageState = true;
    this.nextPageState = false;
    this.prevPage = +this.activePage - 1;
    this.nextPage = +this.activePage + 1;
    this.filter = '';
    this.orderBy = '';
    this.orderDirection = 'ASC';
    this.totalShowing = 0;
    this.loadDesignations();
  }

  currentTheme = 'light';

  ngOnInit() {
    const themeObservable = this.themeService.getCurrentTheme();
    themeObservable.subscribe((themeData: string) => {
      this.currentTheme = themeData;
    });
  }
}
