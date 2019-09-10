import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-context-menu-capture-info',
  templateUrl: './context-menu-capture-info.component.html',
  styleUrls: ['./context-menu-capture-info.component.scss']
})
export class ContextMenuCaptureInfoComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() x: number;
  @Input() y: number;
  @Input() captureID: number;
  @Input() captureInfo: string;
  @Input() currentTheme: string;

  @Output() editCaptureInfo = new EventEmitter<string>();

  ngOnInit() {
  }

  editInfo() {
    this.editCaptureInfo.emit(JSON.stringify({ captureInfoID: this.captureID, info: this.captureInfo }));
  }
}
