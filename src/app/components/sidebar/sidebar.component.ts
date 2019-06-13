import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/Theme.Service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  constructor(private themeService: ThemeService) {
  }

  currentTheme = 'light';

  ngOnInit() {
    const studentsObservable = this.themeService.getCurrentTheme();
    studentsObservable.subscribe((themeData: string) => {
        this.currentTheme = themeData;
    });
  }
}
