import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-escalation-reason',
  templateUrl: './dialog-escalation-reason.component.html',
  styleUrls: ['./dialog-escalation-reason.component.scss']
})
export class DialogEscalationReasonComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: string) { }

  public message: string;

  ngOnInit() {
    this.message = this.data;
  }

}
