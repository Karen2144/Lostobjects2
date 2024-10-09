import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PublicationsService {
  constructor(private http: HttpClient) {}

  APIUrl = 'http://127.0.0.1:8000';

  getData(endpoint: String): Observable<any> {
    return this.http.get(`${this.APIUrl}/${endpoint}`);
  }

  // servicio para aplicar el filtro
  getAllData(): Observable<any> {
    return this.http.get(`${this.APIUrl}/publication`);
  }

  postData(endpoint: string, data : FormData): Observable<any>{
    return this.http.post(`${this.APIUrl}/${endpoint}`,data);
  }
}