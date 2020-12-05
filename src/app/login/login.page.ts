import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formLogin: FormGroup;
  submitted = false;
  
  constructor(public formBuilder: FormBuilder,) { }
  
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
    }
  }

  get errorCtr() {
    return this.formLogin.controls;
  }
  
}
