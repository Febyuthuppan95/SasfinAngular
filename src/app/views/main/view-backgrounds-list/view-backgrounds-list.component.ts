import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';

@Component({
  selector: 'app-view-backgrounds-list',
  templateUrl: './view-backgrounds-list.component.html',
  styleUrls: ['./view-backgrounds-list.component.scss']
})
export class ViewBackgroundsListComponent implements OnInit {
  constructor(private themeService: ThemeService) {}

  currentTheme = 'light';

  ngOnInit() {
    const themeObservable = this.themeService.getCurrentTheme();
    themeObservable.subscribe((themeData: string) => {
      this.currentTheme = themeData;
    });
  }
}
