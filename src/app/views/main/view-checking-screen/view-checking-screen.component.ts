import { Component, OnInit, Input } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { Variable } from '@angular/compiler/src/render3/r3_ast';


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

  DeleteInvoiceLine(event: Event)
  {
    var ClickedButtonName = Object(event.currentTarget)["id"];
    var line = <HTMLInputElement>document.getElementById(ClickedButtonName);
    var parentOfButton = line.parentElement;
    var otherbutton = <HTMLInputElement>document.getElementById('IL_Unassign-Button-Delete');
    var parent2 = otherbutton.parentElement; 
    line.remove();
    parentOfButton.insertAdjacentHTML('beforeend', parent2.innerHTML.replace('IL_Unassign-Button-Cancel', '4321'));
    var newElemenet = <HTMLInputElement>document.getElementById('4321');
    newElemenet.addEventListener('click', this.CancelDeleteInvoiceLine, true  )
   
  }

  CancelDeleteInvoiceLine(event: Event)
  {
    //Remove the buttons from the column
    var ClickedButtonName = Object(event.currentTarget)["id"];
    var ClickedButton = <HTMLInputElement>document.getElementById(ClickedButtonName);
    var ClickedButtonParent = ClickedButton.parentElement;
    ClickedButtonParent.innerHTML = '';

    //Add in the standard button
    var line = <HTMLInputElement>document.getElementById('IL_Unassign-Button');
    ClickedButtonParent.insertAdjacentHTML('beforeend', line.parentElement.innerHTML.replace('IL_Unassign-Button', ClickedButtonName))
    var newline = <HTMLInputElement>document.getElementById(ClickedButtonName);
    newline.addEventListener('click', this.DeleteInvoiceLine, true);


  }


}
