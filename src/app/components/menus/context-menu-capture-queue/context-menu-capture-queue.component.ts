import { Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';

@Component({
  selector: 'app-context-menu-capture-queue',
  templateUrl: './context-menu-capture-queue.component.html',
  styleUrls: ['./context-menu-capture-queue.component.scss']
})
export class ContextMenuCaptureQueueComponent implements OnInit {

  constructor(private router: Router) { }
  @Input() x: number;
  @Input() y: number;
  @Input() currentTheme: string;
  @Input() companyID: number;

  @Output() promoteCompany = new EventEmitter<number>();
  ngOnInit() {
  }

  setPriority() {
    this.promoteCompany.emit(this.companyID);
  }
}
