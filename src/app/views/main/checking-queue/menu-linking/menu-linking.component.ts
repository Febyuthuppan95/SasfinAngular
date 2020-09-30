import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/services/Transaction.Service';

@Component({
  selector: 'app-menu-linking',
  templateUrl: './menu-linking.component.html',
  styleUrls: ['./menu-linking.component.scss']
})
export class MenuLinkingComponent implements OnInit {
  constructor(private router: Router, private transactionService: TransactionService) { }

  @Input() transactionID: number;
  @Input() currentTheme: string;
  @Input() transactionName: string;
  @Input() transactionType: string;

  ngOnInit() {}

  viewLinking() {
    this.transactionService.setCurrentAttachment({
      transactionID: this.transactionID,
      attachmentID: -1, docType: '',
      transactionType: this.transactionType,
      transactionName: this.transactionName });

    this.router.navigate(['transaction', 'linking']);
  }
}
