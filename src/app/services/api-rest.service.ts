import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertController, NavController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class ApiRestService {
  urlAuth ='https://auradoc.bcnschool.net/api/auth/';
  categoryUrl ='https://auradoc.bcnschool.net/api/v1/';
  permisos;
  constructor(
    private http: HttpClient, 
    public alertController: AlertController,
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    public navCtrl: NavController,
    private nativeStorage: NativeStorage
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
    
    ionPermissionInitial(): Promise<boolean> {
      return new Promise(resolve => {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
          result => {
            resolve(result.hasPermission);
          },
          err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
          );
        });
      }
      
      ionPermission():Promise<boolean>{
        return new Promise(resolve => {
          this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
          .then(status => {
            if (status.hasPermission) {
              resolve(status.hasPermission);
            }else{
              this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
              .then(status => {
                if (status.hasPermission) {
                  resolve(status.hasPermission);
                } else {
                  resolve(status.hasPermission);
                }
              });
            }
          });
        });
      }
      
      
      
      ionPermissionssss(){
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
          result => {
            this.permisos = result.hasPermission;
          },
          err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
          );
          
          this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
          .then(status => {
            if (status.hasPermission) {
              this.permisos=status.hasPermission;
            }
            else {
              this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
              .then(status => {
                if (status.hasPermission) {
                  this.permisos=status.hasPermission;
                } else {
                  this.permisos=status.hasPermission;
                }
              });
            }
          });
          return this.permisos;
        }
        
        
        
      }
      