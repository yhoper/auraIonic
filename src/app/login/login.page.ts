import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { ApiRestService } from "../services/api-rest.service"

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
    ) { }
    
    ngOnInit() {
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
              this.getUser(response);
            }else{
              console.log(`Estas autorizado para realizar el login, llamo a GET USER`);
              this.getUser(response);
            }
          },
          error => alert(`Debo llamar un modal con el error ${error.error.message}`),
          )
        }
      }
      get errorCtr() {
        return this.formLogin.controls;
      }

      getUser(data){
        let token = `${data.token_type} ${data.access_token}`;
        this.apirest.getUser(token, data.expires_at)
        .subscribe(
          (response)=>{console.log(response)},
          error=>(alert(error))
        );
      }
    }  