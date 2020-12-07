import { Component, OnInit  } from '@angular/core';
import { ApiRestService } from "../services/api-rest.service"
import { Observable } from 'rxjs';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Router, ActivatedRoute, NavigationEnd, RouterEvent, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  categories: Observable<any>;
  cateogoriaRaiz: Observable<any>;
  categoriesSqlite: Observable<any>;
  categoriaSinInternet;
  
  
  createDBsqlite;
  
  constructor(
    private apirest: ApiRestService, 
    private sqlite: SQLite,
    //private router: Router
    private router: Router, 
    private activatedRoute: ActivatedRoute
    
    ) { 
      
      
    }
    

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.refreshPage()
      
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

    ionViewWillEnter() {
      this.refreshPage()
    } 

    refreshPage(){
      //alert("Refrescando")
      //1) Llamar las categorias API REST
      this.categories = this.apirest.getCategories(2);
      //2) Llamar las categorias Raiz API REST
      this.cateogoriaRaiz = this.apirest.getCategoryRoot(2);
      //3) Crear la BD
      this.createDbSqlite(this.categories, this.cateogoriaRaiz)
    }
    
    
    
    ngOnInit(): void {
      
      this.router.events.pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        ).subscribe((data) => {
          console.log("******algo******");
          console.log(data.url);
          if (data.url ==='/tabs/tab1'){
            this.ionViewWillEnter();
          }
          console.log("algo");
        });
        
        
        
      }
      
      /*ngOnInit() {
      }*/
      
      createDbSqlite(_categorias, _categoriaraiz) {
        return this.sqlite.create({
          name: 'data.db',
          location: 'default'
        })
        .then((db: SQLiteObject) => {
          db.executeSql('CREATE TABLE IF NOT EXISTS categoriaroot(id INT(32), directory VARCHAR(100), name VARCHAR(100), namenew VARCHAR(100), categoryname VARCHAR(100))', [])
          .then(() => console.log('Se ha creado la BD para Categoria Root'))
          /*CRAMOS LA TABLA E INSERTAMOS LA DATA */
          db.executeSql('CREATE TABLE IF NOT EXISTS categorias(id INT(32), name VARCHAR(100), description VARCHAR(100), status VARCHAR(100), documents TEXT)', [])
          .then(() => {
            _categorias.forEach(values => {
              values.forEach(item => {
                let id = item.id;
                let name = item.name;
                let description = item.description;
                let status = item.status;
                let docs = JSON.stringify(item.documents);              
                db.executeSql('select * from categorias WHERE id =' + `${id}`, []).then(data => {
                  //alert(data.rows.length);
                  if (data.rows.length > 0) {
                    console.log("Existe un registro con ese id MANDO A ACTUALIZAR EL REGISTRO");
                    this.updateCategories(id, name, description, status, docs);
                  } else {
                    db.executeSql('INSERT INTO categorias VALUES (?,?,?,?,?)', [`${id}`, `${name}`, `${description}`, `${status}`, `${docs}`]).then(() => console.log(`INSERT CATEGORIAS el id ${id}, de nombre ${name}, y docuemtnos: ${docs}`))
                  }
                  this.queryCategories();
                })
              })
            })
          })
        })
        .catch(e => console.log(e));

       
        
      }
      
      updateCategories(id, name, description, status, docs) {
        // UPDATE Cars SET Name='Skoda Octavia' WHERE Id=3;
        this.sqlite.create({
          name: 'data.db',
          location: 'default'
        })
        .then((db: SQLiteObject) => {
          db.transaction(function (tx) {
            console.log(tx);
            console.log("updateCategories");
            var query = `UPDATE categorias SET name=?, description=?, status=? WHERE id=?`;          
            tx.executeSql(query, [name, description, status, id], function (tx, res) {
              console.log("088888888888888800000000000");
              console.log("res: " + res);
              console.log(res);
              console.log("insertId: " + res.insertId);
              console.log(res.insertId);
              console.log("rowsAffected: " + res.rowsAffected);
              console.log(res.rowsAffected);
              console.log("vvvvvvvvvvvvvvvvvvv");
              console.log(res);
              console.log("aaaaaaaaaaaaaaa");
              console.log(tx);
            })
          })
        })
      }
      
      queryCategories() {
        this.sqlite.create({
          name: 'data.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          
          db.executeSql('select * from categorias', []).then(data => {
            this.categoriaSinInternet = [];
            
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                this.categoriaSinInternet.push({ id: data.rows.item(i).id, name: data.rows.item(i).name });
                //  console.log(data.rows.item(i).id, data.rows.item(i).name);
              }
            }
            
          }, (error) => {
            console.log("ERROR categories: " + JSON.stringify(error));
          })
        })
        return this.categoriaSinInternet;
      }
    }
    