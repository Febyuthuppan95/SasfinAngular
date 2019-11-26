export class AddCompanyInfo {
  userID: number;
  companyID: number;
  companyInfo: string;
  infoType: number;
}

export class AddCompany {
  userID: number;
  RegNo: string;
  ExportRegNo: string;
  VATNo: string;
  Name: string;
}

export class AddCompanyAddress {
  userID: number;
  companyID: number;
  address1: string;
  address2: string;
  POBox: string;
  cityID: number;
  addressTypeID: number;
}

export class CompanyList {
  userID: number;
  specificCompanyID: number;
  filter: string;
  rowStart: number;
  rowEnd: number;
  orderBy: string;
  orderByDirection: string;
}

export class UpdateCompany {
  userID: number;
  SpesificCopmanyID: number;
  RegNo: string;
  ExportRegNo: string;
  VATNo: string;
  Name: string;
}

export class UpdateCompanyAddress {
  userID: number;
  spesificAddressID: number;
  address1: string;
  address2: string;
  POBox: string;
  addressTypeID: number;
  cityID: number;
}

export class UpdateCompanyInfo {
  userID: number;
  specificCompanyInfoID: number;
  companyInfo: string;
  type: number;
}
