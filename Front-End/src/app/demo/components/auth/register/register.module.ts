import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { RegisterRoutingModule } from './register-routing.module';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';
// import { RecaptchaModule } from 'angular-google-recaptcha';



@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    PrimeNgModule,
    ReactiveFormsModule,
    /* RecaptchaModule.forRoot({
      siteKey: '6LdZIP8kAAAAAGHn2VyA5wt4hbzt-4v5S9FuFiH2'
  }) */
  ]
})
export class RegisterModule { }
