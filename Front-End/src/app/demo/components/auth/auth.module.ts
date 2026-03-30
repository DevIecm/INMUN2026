import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { RecuperarContrasenaComponent } from './recuperar-contrasena/recuperar-contrasena.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { FormRecuperarContrasenaComponent } from './form-recuperar-contrasena/form-recuperar-contrasena.component';

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule,
        ReactiveFormsModule,
        PrimeNgModule
    ],
    declarations: [
      
    
    RecuperarContrasenaComponent,
                  FormRecuperarContrasenaComponent
  ]
})
export class AuthModule { }
