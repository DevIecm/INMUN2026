import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepsRoutingModule } from './steps-routing.module';
import { StepsComponent } from './steps.component';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { FormDatosComponent } from './form-datos/form-datos.component';
import { FormSeleccionComiteComponent } from './form-seleccion-comite/form-seleccion-comite.component';
import { FormPermisosComponent } from './form-permisos/form-permisos.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StepsComponent,
    FormDatosComponent,
    FormSeleccionComiteComponent,
    FormPermisosComponent
  ],
  imports: [
    CommonModule,
    StepsRoutingModule,
    PrimeNgModule,
    ReactiveFormsModule
  ]
})
export class StepsModule { }
