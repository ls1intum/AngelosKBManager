import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { OrganisationDTO } from '../data/dto/organisation.dto';

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {
  constructor(private http: HttpClient) {}

  getAllOrganisations(): Observable<OrganisationDTO[]> {
    return this.http.get<OrganisationDTO[]>(`${environment.backendUrl}/api/organisations`);
  }
}