import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ApiRestService } from "../services/api-rest.service"

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  resAndroidPermissions;
  androidPermissions;
  constructor(
    private nativeStorage: NativeStorage,
    private apirest: ApiRestService, 
    ) {
      
      this.nativeStorage.getItem('androidPermission').then(data => {
        this.resAndroidPermissions = data;
      }); (error) => {
        console.log(error);
      }
      
    }
    
    ionViewWillEnter() {
      
      this.nativeStorage.getItem('androidPermission').then(data => {
        this.resAndroidPermissions = data;
      }); (error) => {
        console.log(error);
      }
    }
    
    callModalPermisssion() {
      this.apirest.ionPermission().then((value) => {
        this.nativeStorage.setItem('androidPermission', value)
      });
    }
    
    ngOnInit() {
      
    }
    updatePermissions(e){
      this.apirest.ionPermissionInitial().then((value) => {
        this.nativeStorage.setItem('androidPermission', value)
        if (value == false) this.callModalPermisssion();
      }); 
      
    } 
    
  }
  