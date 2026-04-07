import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepsRoutingModule } from './steps-routing.module';
import { StepsComponent } from './steps.component';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { FormDatosComponent } from './form-datos/form-datos.component';
import { FormSeleccionComiteComponent } from './form-seleccion-comite/form-seleccion-comite.component';
import { FormPermisosComponent } from './form-permisos/form-permisos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormEvaluacionesComponent } from './form-evaluaciones/form-evaluaciones.component';
import { AccordionModule } from "primeng/accordion";


@NgModule({
  declarations: [
    StepsComponent,
    FormDatosComponent,
    FormSeleccionComiteComponent,
    FormPermisosComponent,
  ],
  imports: [
    CommonModule,
    StepsRoutingModule,
    PrimeNgModule,
    ReactiveFormsModule,
    AccordionModule,
    FormEvaluacionesComponent
  ]
})
export class StepsModule { }
