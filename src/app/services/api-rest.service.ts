import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiRestService {
  urlAuth ='https://auradoc.bcnschool.net/api/auth/';
  constructor(private http: HttpClient) { }

  login(data: any): Observable<any> {

    let headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');

    const requestOptions = ({ headers: headers });
    return this.http.post(`${this.urlAuth}login`, data, requestOptions);
  }

  getUser(authorization, expires_at): Observable<any> {
    return this.http.get(`${this.urlAuth}user`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': authorization })
    });
  }

  logout(): Observable<any> {
    return this.http.get(`${this.urlAuth}+logout`);
  }

  getCategories(userid):Observable<any>{
    return this.http.get(`${this.urlAuth}showdocuments`)
  }


}
