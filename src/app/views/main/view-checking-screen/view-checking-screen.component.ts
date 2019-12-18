import { Component, OnInit, Input } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { CheckListService } from 'src/app/services/CheckList.Service';
import { SC_Transaction, SP_CheckingScreenList } from 'src/app/models/HttpResponses/CheckList';
import { CheckListRequest } from 'src/app/models/HttpRequests/CheckListRequest';


@Component({
  selector: 'app-view-checking-screen',
  templateUrl: './view-checking-screen.component.html',
  styleUrls: ['./view-checking-screen.component.scss']
})
export class ViewCheckingScreenComponent implements OnInit {

  constructor(
    private themeService: ThemeService,
    public csService: CheckListService


    
    
    ) { }

  @Input() currentTheme: string = 'light';
  CheckList: SP_CheckingScreenList ;
  CheckListRequest: CheckListRequest;

LoadList(){

  this.CheckListRequest = {

    userID: 1, 
    transactionID:1,
    filter: 'test',
    orderBy: 'Test',
    orderByDirection: 'test',
    rowStart: 0,
    rowEnd: 0

  };

  this.csService.list(this.CheckListRequest).then(
   (res: SP_CheckingScreenList) => {
     if(res.outcome.outcome == "SUCCESS"){
       this.CheckList.transaction = res.transaction;
     }
     else
     {
       var a = 'Error';
     }
        
   }
  );
  

}
  
  ngOnInit() {

    this.themeService.observeTheme()
    this.LoadList();
  }

  DeleteInvoiceLine(ID: number)
  {
  
   
  }


  CancelDeleteInvoiceLine(ID:Number)
  {


  }


}
