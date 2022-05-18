import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { OnlyNumber } from '../onlynumber.directive';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    
  ],
  declarations: [LoginComponent, SignupComponent, OnlyNumber]
})
export class AuthModule { }
