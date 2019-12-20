import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { CheckListService } from 'src/app/services/CheckList.Service';
import { SC_Transaction, SP_CheckingScreenList, CS_SAD500, SP_CheckScreenInvoiceSelection, CS_Paging, CS_InvoiceLineAdd } from 'src/app/models/HttpResponses/CheckList';
import { CheckListRequest } from 'src/app/models/HttpRequests/CheckListRequest';
import { element } from 'protractor';
import { UserService } from 'src/app/services/user.Service';
import { first } from 'rxjs/operators';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { NotificationComponent } from 'src/app/components/notification/notification.component';


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
  CheckList: SP_CheckingScreenList = null;
  CheckListInvoice: SP_CheckScreenInvoiceSelection = null;
  CheckListRequest: CheckListRequest = null;
  CheckListRequestInvoice: CheckListRequest = null;
  FirstLoad: boolean = true;
  noResult: boolean;
  SADnoResult: boolean = false;
  InvoicePaging: CS_Paging = null;
  SelectedSADLine = null;
  InvoiceLineAdd: CS_InvoiceLineAdd = {
    userid: 0,
    sad500id: 0,
    invoicelines: null
  };

  selected = '1';
  pageLoadComplete = false;


  @ViewChild('openeditModal', { static: true })
  openeditModal: ElementRef;

  @ViewChild('closeeditModal', { static: true })
  closeeditModal: ElementRef;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;


  OpenModal(ID: Number) {
    this.LoadInvoiceLines(false);
    this.SelectedSADLine = ID;

  }

  CloseModal() {
    this.closeeditModal.nativeElement.click();
  }



  Reset() {
    this.CheckListRequest = {

      userID: this.userService.getCurrentUser().userID,
      transactionID: 2,
      filter: 'test',
      orderBy: 'Test',
      orderByDirection: 'test',
      rowStart: 0,
      rowEnd: 0
    };


  }

  ResetInvoice() {



    this.CheckListRequestInvoice = {

      userID: this.userService.getCurrentUser().userID,
      transactionID: 2,
      filter: '',
      orderBy: '',
      orderByDirection: '',
      rowStart: 1,
      rowEnd: 10
    };

    this.InvoicePaging = {
      id: "INVL",
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0
    };

  }

  pageChanged($event) {

    if ($event != 0)
      this.InvoicePaging.currentPage = $event;
    else
      this.InvoicePaging.currentPage = 1;

    this.CheckListRequestInvoice.rowStart = Number(this.selected) * (this.InvoicePaging.currentPage - 1) + 1;
    this.CheckListRequestInvoice.rowEnd = Number(this.selected) * (this.InvoicePaging.currentPage);
    this.InvoicePaging.itemsPerPage = Number(this.selected);




    this.LoadInvoiceLines(true);

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

  ResetButtonsInvoice() {
    this.CheckListInvoice.invoiceLines.forEach((element) => { element.il_showAs = true; });
  }

  InvoiceAssgin(ID: number) {
    this.CheckListInvoice.invoiceLines.find(x => x.il_id == ID).il_showAs = false;
  }

  InvoiceUnassign(ID: Number) {
    this.CheckListInvoice.invoiceLines.find(x => x.il_id == ID).il_showAs = true;
  }

  LoadList() {

    this.Reset();


    this.csService.list(this.CheckListRequest).then(
      (res: SP_CheckingScreenList) => {
        if (res.outcome.outcome == "SUCCESS") {
          this.CheckList = null;
          this.CheckList = res;
          this.ResetButtons();
          this.SADnoResult = false;
        }
        else if(res.outcome.outcomeMessage == "0 Links found") {
          //Add error message here
          this.CheckList = null;
          this.CheckList = res;
          this.SADnoResult = true;
          this.notify.toastrwarning('Warning', 'No Records Found');

        }

      }
    );


  }

  ngOnInit() {



    this.FirstLoad = true;
    this.ResetInvoice();
    this.LoadList();
    this.LoadInvoiceLines(false);
    this.themeService.observeTheme();
    this.CheckListInvoice.rowCount

  }

  ngDoCheck()
  {
    this.pageLoadComplete = true;
    //this.notify.toastrwarning('Warning', 'Please enter all fields when updating a help glossary item.');
  }

  DeleteInvoiceLine(ID: number) {

    this.CheckList.transaction.saD500s.forEach((element) => {
      element.saD500Lines.forEach(line => {
        line.invoiceLines.forEach(iline => {
          if (iline.id == ID)
            iline.showAs = false;
        });
      });
    });

  }

  DeleteInvoiceLineConfrim(invoiceID: number, sadlineID: number) {

    this.InvoiceLineAdd.sad500id = null; //set to null because we want to assign the value
    this.InvoiceLineAdd.userid = this.userService.getCurrentUser().userID;
    this.InvoiceLineAdd.invoicelines = null; //clear out old data
    this.InvoiceLineAdd.invoicelines = new Array();
    this.InvoiceLineAdd.invoicelines.push(invoiceID);

    //Send the data to the api
    this.csService.listInvoiceLinesAssign(this.InvoiceLineAdd).then(
      (res: Outcome) => {
        if (res.outcome == "SUCCESS") {

          this.LoadList();
          this.notify.successmsg('Success', 'Invoice Line Unassigned');
        }
        else {

          this.notify.errorsmsg('Error', 'Unable to unassign invoice line');

        }

      }
    );


  }


  LoadInvoiceLines(keyup: boolean) {



    this.csService.listInvoiceLines(this.CheckListRequestInvoice).then(
      (res: SP_CheckScreenInvoiceSelection) => {
        if (res.outcome.outcome == "SUCCESS") {
          this.CheckListInvoice = null;
          this.CheckListInvoice = res;
          this.noResult = false;
          this.InvoicePaging.totalItems = res.rowCount;
          this.ResetButtonsInvoice();

          if (this.FirstLoad == true)
            this.FirstLoad = false;
          else
            if (keyup == false)
              this.openeditModal.nativeElement.click();
        }
        else if (res.outcome.outcomeMessage == "0 Links found") {
          this.CheckListInvoice = null;
          this.noResult = true;
          if (keyup == false)
          this.openeditModal.nativeElement.click();
          this.notify.infotoastr('Notification', 'No Avialable Invoice Lines');

        }

      }
    );
  }



  CancelDeleteInvoiceLine(ID: Number) {
    this.CheckList.transaction.saD500s.forEach((element) => {
      element.saD500Lines.forEach(line => {
        line.invoiceLines.forEach(iline => {
          if (iline.id == ID)
            iline.showAs = true;
        });
      });
    });

  }

  InvoiceLineAssign() {

    var selected = this.CheckListInvoice.invoiceLines.find(x => x.il_showAs == false);


    if (selected != undefined) // Only run the code if something is actually selected.
    {
      this.InvoiceLineAdd.sad500id = this.SelectedSADLine;
      this.InvoiceLineAdd.userid = this.userService.getCurrentUser().userID;
      this.InvoiceLineAdd.invoicelines = null; //clear out old data
      this.InvoiceLineAdd.invoicelines = new Array();
      this.CheckListInvoice.invoiceLines.forEach((element) => {
        if (element.il_showAs == false) //meaning that the invoiceline is selected
        {
          var a = element.il_id;
          this.InvoiceLineAdd.invoicelines.push(element.il_id); //add to the array to be added
        }

      });



      //Send the data to the api
      this.csService.listInvoiceLinesAssign(this.InvoiceLineAdd).then(
        (res: Outcome) => {
          if (res.outcome == "SUCCESS") {
            this.LoadList();
            this.notify.successmsg('Success', 'Invoice Line(s) Assgined to SAD 500 Line');


          }
          else {

            this.notify.errorsmsg('Error', 'Unable to Assign Invoice Lines');

          }

        }
      );


    }

  }


}
