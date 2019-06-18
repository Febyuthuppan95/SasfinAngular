import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit {
  constructor() {}

  @Input() display: boolean;
  @Input() title: string;
  @Input() content: string;

  ngOnInit() {}

  close() {
    this.display = false;
  }
}
