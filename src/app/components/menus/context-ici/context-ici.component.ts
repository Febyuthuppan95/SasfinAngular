import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-context-ici',
  templateUrl: './context-ici.component.html',
  styleUrls: ['./context-ici.component.scss']
})
export class ContextICIComponent implements OnInit {

  constructor() { }

  @Output() edit = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  ngOnInit() {
  }

}
