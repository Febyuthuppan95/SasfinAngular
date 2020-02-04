import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-redirect',
  templateUrl: './chat-redirect.component.html',
  styleUrls: ['./chat-redirect.component.scss']
})
export class ChatRedirectComponent implements OnInit {

  constructor(private router: Router) {
   }

  ngOnInit() {
    this.router.navigate(['capture', 'transaction', 'attachment']);
  }

}
