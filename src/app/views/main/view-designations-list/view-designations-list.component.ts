import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';

@Component({
  selector: 'app-view-designations-list',
  templateUrl: './view-designations-list.component.html',
  styleUrls: ['./view-designations-list.component.scss']
})
export class ViewDesignationsListComponent implements OnInit {
  constructor(private themeService: ThemeService) {}

  currentTheme = 'light';

  ngOnInit() {
    const themeObservable = this.themeService.getCurrentTheme();
    themeObservable.subscribe((themeData: string) => {
      this.currentTheme = themeData;
    });
  }
}
