import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatosPersonalesRoutingModule } from './datos-personales-routing.module';
import { DatosPersonalesComponent } from './datos-personales.component';
import { SharedModule } from '../shared/shared.module';
import { FormularioComponent } from './formulario/formulario.component';
import { PrimeNgModule } from '../../../prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ 
    DatosPersonalesComponent, FormularioComponent,
  ],
  imports: [
    CommonModule,
    DatosPersonalesRoutingModule,
    SharedModule,
    PrimeNgModule,
    ReactiveFormsModule
  ]
})
export class DatosPersonalesModule { }
