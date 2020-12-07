import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertController, NavController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class ApiRestService {
  urlAuth ='https://auradoc.bcnschool.net/api/auth/';
  categoryUrl ='http://auradoc.bcnschool.net/api/v1/';
  constructor(
    private http: HttpClient, 
    public alertController: AlertController,
    public navCtrl: NavController
    ) { }
    
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
    
    getCategories(userid): Observable<any> {
      return this.http.get(`${this.categoryUrl}categoriesuser/${userid}`);
    }
    
    getCategoryRoot(userid): Observable<any> { 
      return this.http.get(`${this.categoryUrl}categoryroot/${userid}`);
    }
    
    
    alertAcept(_title, _message) { 
      return this.alertController.create({
        header: _title,
        message: _message,
        buttons: [
          {
            text: 'Aceptar',
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
        return alertEl.onDidDismiss();
      });
    }
    
    alertAceptCancel(_title, _message) {
      return this.alertController.create({
        header: _title,
        message: _message,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancelar',
            handler: (response) => {
              console.log(`Confirm cancelar: ${response}`);
            }
          },
          {
            text: 'Aceptar',
            role: 'aceptar',
            handler: (response) => {
              navigator['app'].exitApp();
            }
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
        return alertEl.onDidDismiss();
      });
    }
    
    
    
    
    
  }
  