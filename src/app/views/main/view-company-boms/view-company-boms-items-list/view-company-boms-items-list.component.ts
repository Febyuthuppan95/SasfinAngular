import { Component, OnInit } from '@angular/core';
import {CompanyService, SelectedBOM} from '../../../../services/Company.Service';
import {UserService} from '../../../../services/User.Service';
import {ThemeService} from '../../../../services/Theme.Service';
import {MenuService} from '../../../../services/Menu.Service';
import {Router} from '@angular/router';
import {HelpSnackbar} from '../../../../services/HelpSnackbar.service';
import {DocumentService} from '../../../../services/Document.Service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-view-company-boms-items-list',
  templateUrl: './view-company-boms-items-list.component.html',
  styleUrls: ['./view-company-boms-items-list.component.scss']
})
export class ViewCompanyBomsItemsListComponent implements OnInit {

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private themeService: ThemeService,
    private IMenuService: MenuService,
    private router: Router,
    private snackbarService: HelpSnackbar,
    private IDocumentService: DocumentService,
  ) { }

  private unsubscribe$ = new Subject<void>();
  bomid = -1;
  bomstatus = '';
  currentTheme: string;

  ngOnInit() {
    this.themeService
      .observeTheme()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((theme) => {
        this.currentTheme = theme;
      });

    this.companyService
      .observeBOM()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((obj: SelectedBOM) => {
        if (obj !== undefined) {
          this.bomid = obj.bomid;
          this.bomstatus = obj.status;
        }
      });
  }


}
