import { Component, OnInit  } from '@angular/core';
import { ApiRestService } from "../services/api-rest.service"
import { Observable } from 'rxjs';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Router, ActivatedRoute, NavigationEnd, RouterEvent, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Platform, LoadingController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { Downloader, DownloadRequest } from '@ionic-native/downloader/ngx';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  cateogoriaRaiz: Observable<any>;
  categories: Observable<any>;
  categoriesSqlite: Observable<any>;
  urlAPI ='https://auradoc.bcnschool.net/backend/public/';
  urlDevice = 'file:///storage/emulated/0/Android/data/com.aura.procedimiento/files/Downloads/';
  //declare var require: any
  categoriaSinInternet;
  categoriaRoot;
  createDBsqlite;
  loaderToShow;
  variableGlobal;
  uid;
  inter;
  isConnected;
  categoriaLocal=[];
  categoriaRootLocal=[];
  nuevaCat: Observable<any>;
  nuevaCatRoot: Observable<any>;
  public onlineOffline: boolean = navigator.onLine;
  constructor(
    private apirest: ApiRestService, 
    private sqlite: SQLite,
    private network: Network,
    private router: Router, 
    private platform: Platform,
    private nativeStorage: NativeStorage,
    public loadingController: LoadingController,
    private fileOpener: FileOpener,
    private downloader: Downloader,
    private file: File,
    private route: ActivatedRoute
    ) { 
      this.nativeStorage.getItem('userLogin')
      .then(
        data => {
          console.log(data);
          this.uid = data.id;
        },
        error => console.error(error.exception)
        );
        
        
        
        this.apirest.getNetworkStatus().subscribe((connected: boolean) => {
          this.isConnected = connected;          
        });
        
        
        
        this.actualizarClick()
      }
      
      ngOnInit(): void {
        //alert("ngOnInit");
      }
      
      ionViewWillEnter() {
      } 
      
      
      actualizarClick(){ 
        alert(this.isConnected);
        /*
        this.categoriaLocal=[];
        this.categoriaRootLocal = [];
        this.apirest.getNetworkStatus().subscribe((connected: boolean) => {
          this.isConnected = connected;*/
          
          if (this.isConnected == true) {
            this.apirest.getCategories(this.uid).subscribe((valCategories) => { 
              console.log(`Get Categories ${valCategories}`);
              this.categories = valCategories;
              
              this.apirest.getCategoryRoot(this.uid).subscribe((valCategoriesRoot) => {
                console.log(`Get Categories Rooooooooooot ${valCategoriesRoot}`);
                this.cateogoriaRaiz = valCategoriesRoot;
                this.createDbSqlite(valCategories, valCategoriesRoot )
              })
              
            })
          }else{
            this.QuerySqlite();
          } 
      /*  });
        */
        
      }
      
      solicitarPermisos(){
        this.apirest.ionPermissionInitial().then((value) => {
          this.nativeStorage.setItem('androidPermission', value)
          if (value == false) {
            this.callModalPermisssion();
          }else if(value==true){
            
          }
          console.log("************solicitarPermisos******************")
          console.log("Permisos para descargar archivos "+value)
          console.log("************solicitarPermisos******************")
        });
      }
      
      doRefresh(event) {
        console.log(event);
        setTimeout(() => {
          //this.actualizarClick();
          event.target.complete();
        }, 2000);
      }
      
      callModalPermisssion(){
        this.apirest.ionPermission().then((value) => {
          this.nativeStorage.setItem('androidPermission', value)
        });
      }
      
      
      
      eliminarLocal(){
        console.log("estoy en eliminar local");
        this.variableGlobal = [];
        
        this.sqlite.create({
          name: 'data.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('select * from categorias', []).then(data => {
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                let dat = JSON.parse(data.rows.item(i).documents);
                dat.forEach(element => {
                  this.variableGlobal.push(element);
                });
              }
            }
          }, (error) => {
            console.log(`Error en eliminarLocal ${error}`)
          })
        })
        
        this.sqlite.create({
          name: 'data.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('DELETE FROM categorias ', []).then(() =>
          console.log(`SE HA ELIMINADO LA TABLA CATEGORIA`)
          )
        })
        
        this.sqlite.create({
          name: 'data.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('select * from categoriaroot', []).then(data => {
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                this.variableGlobal.push(data.rows.item(i));
              }
            }
          }, (error) => {
            console.log(`Error en eliminarLocal ${error}`)
          })
        })
        
        this.sqlite.create({
          name: 'data.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('DELETE FROM categoriaroot', []).then(() =>
          console.log(`SE HA ELIMINADO LA TABLA CATEGORIA`)
          )
          console.log(this.variableGlobal);
        })        
        return this.variableGlobal;
      }
      
      createDbSqlite(_categorias, _categoriaraiz) {
        this.eliminarLocal();
        
        /*this.categoriaRootLocal = [];
        this.categoriaLocal = [];*/
        
        return this.sqlite.create({
          name: 'data.db',
          location: 'default'
        })
        .then((db: SQLiteObject) => {
          db.executeSql(`
          CREATE TABLE IF NOT EXISTS 
          categoriaroot(
            id INT(32), 
            user_id INT(32), 
            categorization_id INT(32), 
            directory TEXT,   
            name VARCHAR(100), 
            namenew VARCHAR(100), 
            status TEXT, 
            updated_at TEXT)`, [])
            .then(() => {
              _categoriaraiz.forEach(item => {
                //value.forEach(item => {
                let id = item.id;
                let user_id=item.user_id;
                let categorization_id=item.categorization_id;
                let directory=item.directory;
                let name=item.name;
                let namenew=item.namenew;
                let status=item.status;
                let updated_at=item.updated_at;
                
                db.executeSql('select * from categoriaroot WHERE id =' + `${id}` , []).then(data => {
                  if (data.rows.length > 0) {
                    
                  } else {
                    this.categoriaRootLocal.push({ 'id': id, 'user_id': user_id, 'categorization_id': categorization_id, 'directory': directory, 'name': name, 'namenew': namenew, 'status': status, 'updated_at': updated_at});
                    
                    db.executeSql('INSERT INTO categoriaroot VALUES (?,?,?,?,?,?,?, ?)', [`${id}`, `${user_id}`, `${categorization_id}`, `${directory}`, `${name}`, `${namenew}`, `${status}`, `${updated_at}`]).then(() => 
                    console.log(`INSERT CATEGORIAS ROOT`)
                    )
                  }
                  // this.queryCategoriesRoot();
                })
                //  })
              })
            }) 
            
            db.executeSql('CREATE TABLE IF NOT EXISTS categorias(id INT(32), name VARCHAR(100), description VARCHAR(100), status VARCHAR(100), documents TEXT)', [])
            .then(() => {
              _categorias.forEach(item => {
                let dataArray = item;
                console.log(dataArray); 
                let id = item.id;
                let name = item.name;
                let description = item.description;
                let status = item.status;
                let docs = JSON.stringify(item.documents);              
                db.executeSql('select * from categorias WHERE id =' + `${id}`, []).then(data => {
                  console.log(data.rows.length);
                  if (data.rows.length > 0) {
                    
                  } else {
                    this.categoriaLocal.push({ 'id': id, 'name': name, 'description': description, 'status': status, 'documents': docs});
                    db.executeSql('INSERT INTO categorias VALUES (?,?,?,?,?)', [`${id}`, `${name}`, `${description}`, `${status}`, `${docs}`]).then(() => 
                    console.log(`INSERT CATEGORIAS`)
                    )
                  }
                })
                // })
              })
            })
            
            this.recorrerCategoriaRaiz();
            this.recorrerCategoria();
          })
          .catch(e =>console.log(e));
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
                    user_id: data.rows.item(i).user_id,
                    categorization_id: data.rows.item(i).categorization_id,
                    directory: data.rows.item(i).directory,
                    name: data.rows.item(i).name,
                    namenew: data.rows.item(i).namenew,
                    status: data.rows.item(i).status,
                    updated_at: data.rows.item(i).updated_at,
                  });
                }
              }
            }, (error) => {
              console.log(`Error en queryCategoriesRoot ${error}`)
            })
          })
          return this.categoriaSinInternet;
        }
        
        
        async presentLoading() {
          const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Espere por favor, estamos actualizando los documentos',
            duration: 5000
          });
          await loading.present();
          const { role, data } = await loading.onDidDismiss();
        }
        
        
        async hideLoader() {
          const loader = this.loadingController.getTop();
          (await loader).parentNode.removeChild(await loader);
        }
        
        recorrerCategoriaRaiz() {
          this.platform.ready().then(() => {
            this.presentLoading(); 
            this.cateogoriaRaiz.forEach(element => {
              let url = encodeURI(`${this.urlAPI}${element.directory}`);
              let namenew=element.namenew;
              let id=element.id;
              let datedoc = element.updated_at
              this.downloadFiles(url, namenew, id, datedoc); 
            });
          });
        }
        
        recorrerCategoria() {
          const arrayNewCat=[];
          this.presentLoading();
          let pathDevice = this.urlDevice;
          this.categories.forEach(item => {
            item.forEach(element => {
              let arrDocuments = element.documents;
              arrDocuments.forEach(element => {
                let url = encodeURI(`${this.urlAPI}${element.directory}`);
                arrayNewCat.push({ 'url': url, 'namenew': element.namenew, 'id': element.id, 'datedoc': element.updated_at})
              });
            });
            arrayNewCat.forEach(element => {
              this.downloadFiles(element.url, element.namenew, element.id, element.datedoc)
            });
          });
        }
        
        
        compararDocumentos(id, date) {
          let value=false;
          console.log("estoy en compararDocumentos");
          this.variableGlobal.forEach(element => {
            if (element.id==id){
              if(element.updated_at!=date){
                value= true;
              }
              if (id == 24) {
                console.log(`${element.id} ${element.updated_at}, ${date} ${value} `)
              }
            }
          }); 
          return value;
        }
        
        
        
        
        downloadFiles(url, namenew, id, date) {
          let seEliminara= this.compararDocumentos(id, date);
          
          this.platform.ready().then(() => {
            if (this.platform.is('android')) {
              let path = 'file:///storage/emulated/0/Android/data/com.aura.procedimiento/files/Downloads/';
              
              this.file.checkFile(path, namenew).then(response => {
                
                if(id==24){
                  console.log(seEliminara);
                  console.log(url, namenew, id, date)
                }
                if(seEliminara)
                this.file.removeFile(path, namenew).then(response => {
                  console.log(`Se ha eliminado el PDF ${namenew} ${response}`);
                  this.comparacionDescargar(url, namenew);
                }).catch(err=>{
                  console.log(`Error al eliminar el archivo ${namenew}`)
                })
                
              }).catch(err => {
                
                var request: DownloadRequest = {
                  uri: url,
                  title: `${namenew}`,
                  description: '',
                  mimeType: '',
                  destinationInExternalFilesDir: {
                    dirType: `Downloads`,
                    subPath: `${namenew}`
                  }
                };
                
                this.downloader.download(request)
                .then((location: string) => console.log(`File downloaded at: ${location} de nombre ${namenew}`))
                .catch((error: any) => console.error(error));
              })
            }
          });
        }
        
        
        comparacionDescargar(url, namenew){
          var request: DownloadRequest = {
            uri: url,
            title: `${namenew}`,
            description: '',
            mimeType: '',
            destinationInExternalFilesDir: {
              dirType: `Downloads`,
              subPath: `${namenew}`
            }
          };
          
          this.downloader.download(request)
          .then((location: string) => console.log(`File downloaded at: ${location} de nombre ${namenew}`))
          .catch((error: any) => {
            console.log(`Error en downloadFiles ${error}`)
          });
        }
        
        openPDFLocal(name) {
          let path = this.urlDevice+name;
          if (this.platform.is('android')) {
            this.fileOpener.open(path, 'application/pdf')
            .then(() => console.log('File is opened'))
            .catch(e => console.log('Error opening file', e));
          }
        }
        
        categoryDetail(_nameCategory, _nameId){
          this.router.navigate(['/tabs/tab3', _nameCategory, _nameId]);
        }
        
        
        QuerySqlite(){
          this.categoriaRootLocal=[];
          this.categoriaLocal = [];
          
          this.sqlite.create({
            name: 'data.db',
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('select * from categoriaroot', []).then(data => {
              if (data.rows.length > 0) {
                
                for (var i = 0; i < data.rows.length; i++) {
                  console.log(data.rows.item(i).name);
                  this.categoriaRootLocal.push(data.rows.item(i));
                }
              }
            }, (error) => {
              console.log(`Error en eliminarLocal ${error}`)
            })
            
            db.executeSql('select * from categorias', [])
            .then(data => {
              if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                  console.log(data.rows.item(i).name);
                  this.categoriaLocal.push({
                    id: data.rows.item(i).id,
                    user_id: data.rows.item(i).user_id,
                    categorization_id: data.rows.item(i).categorization_id,
                    directory: data.rows.item(i).directory,
                    name: data.rows.item(i).name,
                    namenew: data.rows.item(i).namenew,
                    status: data.rows.item(i).status,
                    updated_at: data.rows.item(i).updated_at,
                  });
                }
              }
            }, (error) => {
              console.log(`Error en queryCategoriesRoot ${error}`)
            })
          })
          this.categoriaSinInternet;
          console.log("Al finalizar QuerySqlite")
          
        }
      }