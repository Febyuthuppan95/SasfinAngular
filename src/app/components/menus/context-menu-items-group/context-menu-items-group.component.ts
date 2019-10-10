import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-context-menu-items-group',
  templateUrl: './context-menu-items-group.component.html',
  styleUrls: ['./context-menu-items-group.component.scss']
})
export class ContextMenuItemsGroupComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() captureID: number;
  @Input() captureInfo: string;
  @Input() currentTheme: string;

  @Output() editCaptureInfo = new EventEmitter<string>();
  @Output() removeCaptureInfo = new EventEmitter<number>();

  ngOnInit() {
  }

  remove() {
    this.removeCaptureInfo.emit(+this.captureID);
  }
}

