import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';

@Component({
  selector: 'app-view-capture-transaction',
  templateUrl: './view-capture-transaction.component.html',
  styleUrls: ['./view-capture-transaction.component.scss']
})
export class ViewCaptureTransactionComponent implements OnInit {

  constructor(private themeService: ThemeService, private transactionService: TransactionService) { }

  currentTheme: string;
  currentDoctype: string;

  ngOnInit() {
    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.transactionService.observerCurrentAttachment().subscribe((data) => {
      this.currentDoctype = data.docType;
      console.log(data);
    });
  }

}
