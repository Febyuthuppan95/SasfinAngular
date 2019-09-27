import { Outcome } from './Outcome';

export class CompanyServiceResponse {
  outcome: Outcome;
  rowCount: number;
  services: CompService[];
}

export class CompService {
  rowNum: number;
  serviceID: number;
  companyID: string;
  serviceName: string;
  resConsultantID: string;
  resCapturerID: string;
  startDate: string;
  EndtDate: number;
}
