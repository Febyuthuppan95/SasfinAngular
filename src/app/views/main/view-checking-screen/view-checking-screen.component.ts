import { Component, OnInit, Input } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';


@Component({
  selector: 'app-view-checking-screen',
  templateUrl: './view-checking-screen.component.html',
  styleUrls: ['./view-checking-screen.component.scss']
})
export class ViewCheckingScreenComponent implements OnInit {

  constructor(private themeService: ThemeService) { }
  @Input() currentTheme: string = 'light';
  
  ngOnInit() {

    this.themeService.observeTheme()
  }

}
