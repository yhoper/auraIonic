import { Component } from '@angular/core';
import { ApiRestService } from "../services/api-rest.service"
import { Observable } from 'rxjs';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  categories: Observable<any>;
  cateogoriaRaiz: Observable<any>;
  constructor(
    private apirest: ApiRestService,
    
    ) {

    this.categories = this.apirest.getCategories(2);
    this.cateogoriaRaiz = this.apirest.getCategoryRoot(2);
  }

  ngOnInit() {

  }

}
