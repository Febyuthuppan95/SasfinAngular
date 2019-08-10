import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  constructor(private snackbarService: HelpSnackbar) {}

  @Input() currentTheme = 'light';
  @Input() collapse = true;
  @Input() offcanvas = true;
  @Input() helpContext = false;
  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  @Output() snackBar = new EventEmitter<string>();

  ngOnInit() {}

  updateHelpContext(title: string, content: string) {
    const newContext: SnackbarModel = {
      display: true,
      title,
      content,
    };

    this.snackbarService.setHelpContext(newContext);
  }

}
