import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RedesSocialesRoutingModule } from './redes-sociales-routing.module';
import { RedesSocialesComponent } from './redes-sociales.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PrimeNgModule } from '../../../prime-ng.module';



@NgModule({
  declarations: [
    RedesSocialesComponent
  ],
  imports: [
    CommonModule,
    RedesSocialesRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    PrimeNgModule
  ]
})
export class RedesSocialesModule { }
