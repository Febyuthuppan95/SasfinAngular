import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';

@Component({
  selector: 'app-view-rights-list',
  templateUrl: './view-rights-list.component.html',
  styleUrls: ['./view-rights-list.component.scss']
})
export class ViewRightsListComponent implements OnInit {
  constructor(private themeService: ThemeService) {}

  currentTheme = 'light';

  ngOnInit() {
    const themeObservable = this.themeService.getCurrentTheme();
    themeObservable.subscribe((themeData: string) => {
      this.currentTheme = themeData;
    });
  }
}
