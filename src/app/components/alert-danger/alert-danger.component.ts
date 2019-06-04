import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-danger',
  templateUrl: './alert-danger.component.html',
  styleUrls: ['./alert-danger.component.scss']
})
export class AlertDangerComponent implements OnInit{
  title = 'Failure';
  message = 'Email or Password is incorrect!';

  constructor() {

  }

  ngOnInit() {

  }
}
