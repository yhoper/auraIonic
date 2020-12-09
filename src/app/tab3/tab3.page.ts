import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ApiRestService } from "../services/api-rest.service"
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Platform, LoadingController } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  resAndroidPermissions;
  androidPermissions;
  titleCategory;
  documentsPDF;
  documentsPDFResutl;
  storageResponse;
  urlDevice = 'file:///storage/emulated/0/Android/data/com.aura.procedimiento/files/Downloads/';
  constructor(
    private nativeStorage: NativeStorage,
    private apirest: ApiRestService, 
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private location: Location,
    private platform: Platform,
    public loadingController: LoadingController,
    private fileOpener: FileOpener,
    private sqlite: SQLite,
    ) {
      
      /*this.nativeStorage.getItem('androidPermission').then(data => {
        this.resAndroidPermissions = data;
      }); (error) => {
        console.log(error);
      }*/
      
    }
    
    ionViewWillEnter() {
      this.titleCategory = this.activatedRoute.snapshot.paramMap.get('categoryname');
      let id = this.activatedRoute.snapshot.paramMap.get('categoryid');
      
      this.queryCategoriesDetail(id);
    }
    
    
    ngOnInit() {
      this.titleCategory = this.activatedRoute.snapshot.paramMap.get('categoryname');
      let id = this.activatedRoute.snapshot.paramMap.get('categoryid');
      
      this.queryCategoriesDetail(id);
    }
    
    goBack() {
      this.location.back();
    }
    
    openPDFLocal(name) {
      let path = this.urlDevice + name;
      if (this.platform.is('android')) {
        this.fileOpener.open(path, 'application/pdf')
          .then(() => console.log('File is opened openPDFLocal tab 3'))
          .catch(e => console.log('Error opening file openPDFLocal tab 3', e));
      }
    }
    
    
    public queryCategoriesDetail(id) {
      
      return new Promise((resolve, reject) => {
        this.sqlite.create({
          name: 'data.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          
          db.executeSql(`SELECT * from categorias WHERE  id = + ${id}`, []).then((data) => {
            this.documentsPDF = [];
            if (data.rows.length > 0) {
              for(let i=0; i <data.rows.length; i++) {
                this.documentsPDF.push(data.rows.item(i).documents);
              }
            } 
            let docsPDF=this.documentsPDF[0] 
            let obj = JSON.parse(docsPDF);
            this.documentsPDFResutl=obj;
            
            resolve(this.documentsPDF);
          }, (error) => {
            reject(error);
          })
        })
       
      });
    }
    
  }
  