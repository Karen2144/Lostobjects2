import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MensajesService {
  constructor(private http: HttpClient) {}

  ApiUrl = 'http://localhost:8000';

  getChats(): Observable<any> {
    return this.http.get(`${this.ApiUrl}/chats/`);
  }

  // Obtener mensajes de un chat específico
  getMessages(chatId: number): Observable<any> {
    return this.http.get(`${this.ApiUrl}/chats/${chatId}/messages/`);
  }

  sendMessage(formData: FormData): Observable<any> {
    return this.http.post(`${this.ApiUrl}/messages/`, formData);
  }
  
}