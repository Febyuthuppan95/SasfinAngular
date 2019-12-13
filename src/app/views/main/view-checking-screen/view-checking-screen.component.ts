import { Component, OnInit, Input } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';


@Component({
  selector: 'app-view-checking-screen',
  templateUrl: './view-checking-screen.component.html',
  styleUrls: ['./view-checking-screen.component.scss']
})
export class ViewCheckingScreenComponent implements OnInit {

  constructor(private themeService: ThemeService) { }
  @Input() currentTheme: string = 'light';
  
  ngOnInit() {

    this.themeService.observeTheme()
  }

  DeleteInvoiceLine()
  {
    var line = <HTMLInputElement>document.getElementById('inl1');
    var parentOfButton = line.parentElement;
   
    var otherbutton = <HTMLInputElement>document.getElementById('IL_Unassign-Button-Delete');
    var parent2 = otherbutton.parentElement; 
    line.remove();
    parentOfButton.insertAdjacentHTML('beforeend', parent2.innerHTML);
   
  }

  CancelDeleteInvoiceLine()
  {
    //var CancelledButton = 
  }

}
