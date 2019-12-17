import { Component, OnInit, Input } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { CheckListService } from 'src/app/services/CheckList.Service';


@Component({
  selector: 'app-view-checking-screen',
  templateUrl: './view-checking-screen.component.html',
  styleUrls: ['./view-checking-screen.component.scss']
})
export class ViewCheckingScreenComponent implements OnInit {

  constructor(
    private themeService: ThemeService,
    private csService: CheckListService
    
    
    ) { }

  @Input() currentTheme: string = 'light';
  
  
  ngOnInit() {

    this.themeService.observeTheme()
  }

  DeleteInvoiceLine(ID: number)
  {
  
   
  }

  CancelDeleteInvoiceLine(ID:Number)
  {


  }


}
