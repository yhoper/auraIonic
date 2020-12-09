import { Component } from '@angular/core';
import { ApiRestService } from "../services/api-rest.service"
import { Router } from '@angular/router';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  
  constructor(
    private apirest: ApiRestService,
    private router: Router,
    private androidPermissions: AndroidPermissions,
    private nativeStorage: NativeStorage,
    private platform: Platform,
    
    ) { }
    
    ionViewWillEnter() {

      
      this.router.navigated = false;
      this.router.navigate([this.router.url]);
      
      
    }
    
    ngOnInit(){
      
    }
    
    refresh(){
      this.ionViewWillEnter();
    }
    
    exitApp() {
      this.apirest.alertAceptCancel('Atención', '¿Seguró desea salir de la apliación?')
    }
    
  ionViewDidEnter() {
     this.platform.backButton.observers.pop();
  }

  ionViewWillLeave() {
    this.platform.backButton.observers.push();
  }
  }
  