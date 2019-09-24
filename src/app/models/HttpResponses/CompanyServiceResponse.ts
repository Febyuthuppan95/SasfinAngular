import { Outcome } from './Outcome';

export class CompanyServiceResponse {
  outcome: Outcome;
  rowCount: number;
  services: Service[];
}


export class Service {
  rowNum: number;
  serviceID: number;
  companyID: string;
  serviceName: string;
  resConsultantID: string;
  resCapturerID: string;
  startDate: string;
  EndtDate: number;
}
