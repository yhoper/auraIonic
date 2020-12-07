import { Component } from '@angular/core';
import { ApiRestService } from "../services/api-rest.service"
import { Router } from '@angular/router';



@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  
  constructor(
    private apirest: ApiRestService,
    private router: Router,
    
    ) { }
    
  ionViewWillEnter() {
      this.router.navigated = false;
      this.router.navigate([this.router.url]);
  }
 
    refresh(){
      //this.apirest.alertAcept('Actualizar', 'Se estará sincronizando su dispositivo, por favor espere.')
      this.ionViewWillEnter();
    }
    
    exitApp() {
      this.apirest.alertAceptCancel('Atención', '¿Seguró desea salir de la apliación?')
    }
  }
  