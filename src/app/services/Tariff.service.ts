import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TariffService {
  constructor(private apiService: ApiService) {}

  list = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/tariffs/list`, requestModel);
}
