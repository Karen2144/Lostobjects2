import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  constructor(private http: HttpClient, private cookies:CookieService) {}

  nombreUsuario = '';

  conseguirUsuariologuaeado(user: string) {
    this.nombreUsuario = user;
    console.log(this.nombreUsuario);
  }

  APIUrl = 'http://127.0.0.1:8000';
  getData(endpoint: String): Observable<any> {
    console.log(`${this.APIUrl}/${endpoint}`);
    return this.http.get(`${this.APIUrl}/${endpoint}`);
  }

  // addUser(endpoint: String, data: any): Observable<any> {
  //   console.log(`${this.APIUrl} ${endpoint}`);
  //   return this.http.post(`${this.APIUrl} ${endpoint}`, data);
  // }

  addUser(user:any): Observable<any>{
    return this.http.post("http://127.0.0.1:8000/register", user);
  }

  login(user: any): Observable<any> {
    return this.http.post("http://127.0.0.1:8000/login", user);
  }
  setToken(token:string){
    this.cookies.set("token", token);
  }

  getToken(){
    return this.cookies.get("token");
  }
  removeToken() {
    this.cookies.delete('token', '/');
  }

  logout() {
    // Elimina el token de autenticación
    this.removeToken();

    // Elimina otros datos de usuario almacenados en cookies
    this.cookies.delete('loggedInUser', '/');

  }

  actualizar_foto(user : FormData): Observable<any>{
    return this.http.patch("http://127.0.0.1:8000/foto", user);
  }


}