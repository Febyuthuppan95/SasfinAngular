import { Component, OnInit, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-override',
  templateUrl: './override.component.html',
  styleUrls: ['./override.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OverrideComponent implements OnInit {

  constructor() { }

  @Input() public control: FormControl;
  @Input() public title: string;
  @Input() public tag: string;
  @Input() public reason: string;
  @Input() public hasError: boolean;
  @Input() public error: string;

  @Output() public undoOverride = new Subject<string>();
  @Output() public override = new Subject<{ tag: string; title: string; }>();

  ngOnInit() {}
}
