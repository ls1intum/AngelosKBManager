import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Organisation } from '../data/model/organisation.model';

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {
  constructor(private http: HttpClient) {}

  getOrganisations(): Observable<Organisation[]> {
    return this.http.get<Organisation[]>(`${environment.backendUrl}/organisations`);
  }

  addOrganisation(orgName: string): Observable<Organisation> {
    const url = `${environment.backendUrl}/organisations`;
    const params = {
      name: orgName,
    };
    return this.http.post<Organisation>(url, {}, { params });
  }
}