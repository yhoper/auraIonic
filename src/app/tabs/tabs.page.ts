import { Component } from '@angular/core';
import { ApiRestService } from "../services/api-rest.service"

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  
  constructor(
    private apirest: ApiRestService,
    ) {}
    
    refresh(){
      this.apirest.alertAcept('Actualizar', 'Se estará sincronizando su dispositivo, por favor espere.')
    }
    
    exitApp() {
      this.apirest.alertAceptCancel('Atención', '¿Seguró desea salir de la apliación?')
    }
  }
  