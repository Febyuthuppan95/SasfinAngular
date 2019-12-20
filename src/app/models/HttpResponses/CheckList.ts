import { Outcome } from './Outcome';

export class SP_CheckingScreenList{

  "rowCount" : number;
   "outcome": Outcome;
   "transaction": SC_Transaction;
}


export class SC_Transaction{
    
  "id": number;
  "name": string;
  "typeID": number;
  "typeName": string;
  "companyID": number;
  "companyName": string;
  "saD500s": CS_SAD500[];
}

export class CS_SAD500{

        "id": number;
        "fileID": number;
        "typeID": number;
        "typeName": string;
        "wayBill": string;
        "serialNumber": string;
        "pcc": string;
        "supplierRef": string;
        "totalCustomValue": number;
        "lrn": string;
        "mrn": string;
        "cpc": string;
        "purposeID": number;
        "purposeCode": string;
        "saD500Lines": CS_SAD500Line[];
      }
      


export class CS_SAD500Line{

    "id": number;
    "tarrifID": number;
    "tarrifCode": string;
    "uomid": number;
    "uomName": string;
    "customsValue": number;
    "lineNo": string;
    "quantity": number;
    "invoiceLines": CS_InvoiceLine[];
  }
  


export class CS_Invoice{

        "id": number;
        "invoiceNo": string;
        "fromCompanyID": number;
        "fromCompany": string;
        "toCompanyID": number;
        "toCompany": string;
        "currencyID": number;
        "currencyName": string;
        "currencyCode": string;
      }
      


export class CS_InvoiceLine{

    "invoice": CS_Invoice; // come back here
    "id": number;
    "quantity": number;
    "itemValue": number;
    "saD500LineID": number;
    "prodCode": string;
    "unitPrice": number;
    "totalLineValue": number;
    "itemID": number;
    "itemName": string;
    "uomid": number;
    "uomName": string;
    "showAs": boolean = false; //used for the display
  }

  export class CS_InvoiceLine_Selection
  {
        "i_id": number;
        "i_invoiceNo": string;
        "i_fromCompanyID": number;
        "i_fromCompany": string;
        "i_toCompanyID": number;
        "i_toCompany": string;
        "i_currencyID": number;
        "i_currencyName": string;
        "i_currencyCode": string;

        "il_id": number;
        "il_quantity": number;
        "il_itemValue": number;
        "il_saD500LineID": number;
        "il_prodCode": string;
        "il_unitPrice": number;
        "il_totalLineValue": number;
        "il_itemID": number;
        "il_itemName": string;
        "il_uomid": number;
        "il_uomName": string;
        "il_showAs": boolean;
  }

  export class SP_CheckScreenInvoiceSelection
  {
    "rowCount" : number;
    "outcome": Outcome;
    "invoiceLines": CS_InvoiceLine_Selection[];
  }

export class CS_Paging
{
  id: string;
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
}

export class CS_InvoiceLineAdd
{
  userid: number;
  sad500id: number;
  invoicelines: number[];

}


  