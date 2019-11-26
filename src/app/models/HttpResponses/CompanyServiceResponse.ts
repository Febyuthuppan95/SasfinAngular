import { Outcome } from './Outcome';

export class CompanyServiceResponse {
  outcome: Outcome;
  rowCount: number;
  services: CompService[];
}

export class CompService {
  rowNum: number;
  componyServiceID: number;
  serviceID: number;
  companyID: string;
  serviceName: string;
  resConsultantID: string;
  consultantName: string;
  resCapturerID: string;
  capturerName: string;
  startDate: string;
  endDate: string;
}
