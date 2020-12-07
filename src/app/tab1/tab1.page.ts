import { Component, OnInit  } from '@angular/core';
import { ApiRestService } from "../services/api-rest.service"
import { Observable } from 'rxjs';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Router, ActivatedRoute, NavigationEnd, RouterEvent, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  cateogoriaRaiz: Observable<any>;
  categories: Observable<any>;
  categoriesSqlite: Observable<any>;
  categoriaSinInternet;
  categoriaRoot;
  createDBsqlite;
  
  constructor(
    private apirest: ApiRestService, 
    private sqlite: SQLite,
    private router: Router, 
    private platform: Platform,
    private nativeStorage: NativeStorage
    ) { 
      
      
      
      
    }
    
    doRefresh(event) {
      setTimeout(() => {
        this.refreshPage()
        event.target.complete();
      }, 2000);
    }
    
    ionViewWillEnter() {
      //this.callModalPermisssion()
      this.apirest.ionPermissionInitial().then((value) => {
        this.nativeStorage.setItem('androidPermission', value)
        if (value == false)  this.callModalPermisssion();
      });
      this.refreshPage()
    } 
    
    refreshPage(){
      this.platform.ready().then(() => {
        this.categories = this.apirest.getCategories(2);
        this.cateogoriaRaiz = this.apirest.getCategoryRoot(2);
        this.createDbSqlite(this.categories, this.cateogoriaRaiz);
        //this.apirest.ionPermission();        
      });
    }
    
    callModalPermisssion(){
      this.apirest.ionPermission().then((value) => {
        this.nativeStorage.setItem('androidPermission', value)
      });
    }
    
    ngOnInit(): void {
      
      this.router.events.pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        ).subscribe((data) => {
          if (data.url ==='/tabs/tab1'){
            this.ionViewWillEnter();
          }
        });
      }
      
      
      createDbSqlite(_categorias, _categoriaraiz) {
        return this.sqlite.create({
          name: 'data.db',
          location: 'default'
        })
        .then((db: SQLiteObject) => {
          db.executeSql('CREATE TABLE IF NOT EXISTS categoriaroot(id INT(32), directory TEXT, name VARCHAR(100), namenew VARCHAR(100), categoryname VARCHAR(100), created_at TEXT, updated_at TEXT)', [])
          .then(() => {
            _categoriaraiz.forEach(value => {
              value.forEach(item => {
                let id = item.id;
                let directory = item.directory;
                let name = item.name;
                let namenew = item.namenew;
                let categoryname = item.categoryname;
                let created_at = item.created_at;
                let updated_at = item.updated_at;
                console.log(`Data: ${id}, ${directory}, ${name}, ${namenew}, ${categoryname}, ${created_at}, ${updated_at}`)
                
                db.executeSql('select * from categoriaroot WHERE id =' + `${id}` , []).then(data => {
                  if (data.rows.length > 0) {
                    this.updateCategoriesrRoot(id, directory, name, namenew, categoryname, created_at, updated_at);
                  } else {
                    db.executeSql('INSERT INTO categoriaroot VALUES (?,?,?,?,?,?,?)', [`${id}`, `${directory}`, `${name}`, `${namenew}`, `${categoryname}`, `${created_at}`, `${updated_at}`]).then(() => console.log(`INSERT CATEGORIAS ROOT el id ${id}, de nombre ${name}, y docuemtnos: ${updated_at}`))
                  }
                  this.queryCategoriesRoot();
                })
              })
            })
          })
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
                  if (data.rows.length > 0) {
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
        .catch(e =>console.log(e));
      }
      
      updateCategories(id, name, description, status, docs) {
        this.sqlite.create({
          name: 'data.db',
          location: 'default'
        })
        .then((db: SQLiteObject) => {
          db.transaction(function (tx) {
            var query = `UPDATE categorias SET name=?, description=?, status=? WHERE id=?`;          
            tx.executeSql(query, [name, description, status, id], function (tx, res) {
            })
          })
        })
      }
      
      updateCategoriesrRoot(id, directory, name, namenew, categoryname, created_at, updated_at){
        this.sqlite.create({
          name: 'data.db',
          location: 'default'
        })
        .then((db: SQLiteObject) => {
          db.transaction(function (tx) {
            var query = `UPDATE categoriaroot SET directory=?, name=?, namenew=?, categoryname=?,   created_at=?,  updated_at=? WHERE id=?`;
            tx.executeSql(query, [directory, name, namenew, categoryname, created_at, updated_at, id], function (tx, res) {
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
              }
            }
          }, (error) => {
          })
        })
        return this.categoriaSinInternet;
      }
      
      queryCategoriesRoot() {
        this.sqlite.create({
          name: 'data.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          
          db.executeSql('select * from categoriaroot', []).then(data => {
            this.categoriaRoot = [];
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                this.categoriaRoot.push({
                  id: data.rows.item(i).id,
                  directory: data.rows.item(i).directory,
                  name: data.rows.item(i).name,
                  namenew: data.rows.item(i).namenew,
                  categoryname: data.rows.item(i).categoryname,
                });
              }
            }
          }, (error) => {
          })
        })
        return this.categoriaSinInternet;
      }
    }    