import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { CheckListService } from 'src/app/services/CheckList.Service';
import { SC_Transaction, SP_CheckingScreenList, CS_SAD500 } from 'src/app/models/HttpResponses/CheckList';
import { CheckListRequest } from 'src/app/models/HttpRequests/CheckListRequest';
import { element } from 'protractor';
import { UserService } from 'src/app/services/user.Service';


@Component({
  selector: 'app-view-checking-screen',
  templateUrl: './view-checking-screen.component.html',
  styleUrls: ['./view-checking-screen.component.scss']
})
export class ViewCheckingScreenComponent implements OnInit {

  constructor(
    private themeService: ThemeService,
    public csService: CheckListService,
    private userService: UserService,    
    ) { }

  @Input() currentTheme: string = 'light';
  CheckList: SP_CheckingScreenList ;
  CheckListRequest: CheckListRequest;


  @ViewChild('openeditModal', {static: true})
  openeditModal: ElementRef;

  @ViewChild('closeeditModal', {static: true})
  closeeditModal: ElementRef;

  OpenModal()
  {
    this.openeditModal.nativeElement.click();
  }

  CloseModal()
  {
    this.closeeditModal.nativeElement.click();
  }

  Reset()
  {
    this.CheckListRequest = {

      userID: this.userService.getCurrentUser().userID, 
      transactionID:1,
      filter: 'test',
      orderBy: 'Test',
      orderByDirection: 'test',
      rowStart: 0,
      rowEnd: 0
    };
 

  }

  ResetButtons() {

    this.CheckList.transaction.saD500s.forEach((element) => {
      element.saD500Lines.forEach(line => {
        line.invoiceLines.forEach(iline => {
          iline.showAs = true;
        });
      });
    });
  }

LoadList(){

this.Reset();
  

  this.csService.list(this.CheckListRequest).then(
   (res: SP_CheckingScreenList) => {
     if(res.outcome.outcome == "SUCCESS"){
         this.CheckList = null;
       this.CheckList = res;
       var a = 1;
       this.ResetButtons();
     }
     else
     {
       var c = 'Error';
     }
        
   }
  );
  

}
  
  ngOnInit() {

  this.LoadList();
  this.themeService.observeTheme();
  
  }

  ngAfterViewInit(){

  //this.LoadList();
    
  }

  DeleteInvoiceLine(ID: number)
  {

    this.CheckList.transaction.saD500s.forEach((element) => {
      element.saD500Lines.forEach(line => {
        line.invoiceLines.forEach(iline => {
          if(iline.id == ID)
          iline.showAs = false;
        });
      });
    });

  }

DeleteInvoiceLineConfrim(ID: number)
{
  this.CheckList.transaction.saD500s.find(S => S.saD500Lines !=null).saD500Lines.find(SL => SL.invoiceLines !=null).invoiceLines.find(IL => IL.id == ID).showAs = false;

}



  CancelDeleteInvoiceLine(ID:Number)
  {
    this.CheckList.transaction.saD500s.forEach((element) => {
      element.saD500Lines.forEach(line => {
        line.invoiceLines.forEach(iline => {
          if(iline.id == ID)
          iline.showAs = true;
        });
      });
    });

  }


}
