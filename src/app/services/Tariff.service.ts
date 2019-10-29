import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TariffService {
  constructor(private apiService: ApiService) {}

  list = () => this.apiService.get(`${environment.ApiEndpoint}/tariffs/list`);
}
