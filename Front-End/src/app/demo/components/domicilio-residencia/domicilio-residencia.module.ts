import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DomicilioResidenciaRoutingModule } from './domicilio-residencia-routing.module';
import { DomicilioResidenciaComponent } from './domicilio-residencia.component';
import { PrimeNgModule } from '../../../prime-ng.module';
import { SharedModule } from '../shared/shared.module';
import { FormularioComponent } from './formulario/formulario.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DomicilioResidenciaComponent,
    FormularioComponent
  ],
  imports: [
    CommonModule,
    DomicilioResidenciaRoutingModule,
    PrimeNgModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class DomicilioResidenciaModule { }
