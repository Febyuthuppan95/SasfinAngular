
export class SC_Transaction{
    
  "id": number;
  "name": string;
  "typeID": number;
  "typeName": string;
  "companyID": number;
  "companyName": string;
  "sad500s": CS_SAD500[];
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
        "sad500Lines": CS_SAD500Line[];
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
  }


  