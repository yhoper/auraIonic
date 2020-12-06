import { Component, OnInit } from '@angular/core';
import { ApiRestService } from "../services/api-rest.service"

import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formLogin: FormGroup;
  submitted = false;
  
  constructor(
    public formBuilder: FormBuilder,
    private apirest: ApiRestService,
    private nativeStorage: NativeStorage,
    private router:Router
    ) { }
    
    ngOnInit() {
      
      let checkRemember=this.nativeStorage.getItem('userRemember')
      .then(
        data =>{ 
          if(data==true){
            this.router.navigateByUrl(`tabs/tab1`);
          }},
          error => console.error(error.exception)
          );
          
          this.formLogin = this.formBuilder.group({
            usuario: ['', [Validators.required, Validators.minLength(4)]],
            password: ['', [Validators.required, Validators.minLength(4)]],
            remember: ['false'],
          })
        }
        
        onSubmit() {    
          this.submitted = true;
          if (!this.formLogin.valid) {
            console.log('All fields are required.')
            return false;
          }else{
            this.apirest.login(this.formLogin.value)
            .subscribe(
              (response) => {
                if (this.formLogin.value.remember == true) {
                  console.log(`Estas autorizado para realizar el login, y pidio recordar su usuario y clave. GUARDO LA INFO y llamo a GET USER `)
                  this.getUser(response, true);
                }else{
                  console.log(`Estas autorizado para realizar el login, llamo a GET USER`);
                  this.getUser(response, false);
                }
              },
              error => this.apirest.alertAcept('Atención', 'Verifique sus credenciales e intente nuevamente.'),
              )
            }
          }
          get errorCtr() {
            return this.formLogin.controls;
          }
          
          getUser(data, rememberuser){
            let token = `${data.token_type} ${data.access_token}`;
            this.apirest.getUser(token, data.expires_at)
            .subscribe(
              (response)=>{
                console.log(response)
                
                //recordar data del Usuario Api 
                this.nativeStorage.setItem('userLogin', response)
                .then(
                  () => console.log('Stored guradado'),
                  error => console.error(`Error storing item, ${error}`)
                  );
                  
                  if(rememberuser==true){
                    //recordar data del Usuario
                    this.nativeStorage.setItem('userRemember', true)
                    .then(
                      () => console.log('Stored guradado'),
                      error => console.error(`Error storing item, ${error}`)
                      );
                    }
                    this.router.navigateByUrl(`tabs/tab1`);
                  },
                  error=>(alert(error))
                  );
                }
              }  