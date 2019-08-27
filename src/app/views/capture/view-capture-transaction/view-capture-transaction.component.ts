import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';

@Component({
  selector: 'app-view-capture-transaction',
  templateUrl: './view-capture-transaction.component.html',
  styleUrls: ['./view-capture-transaction.component.scss']
})
export class ViewCaptureTransactionComponent implements OnInit {

  constructor(private themeService: ThemeService) { }

  currentTheme: string;

  ngOnInit() {
    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

}
