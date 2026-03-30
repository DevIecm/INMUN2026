import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioRoutingModule } from './inicio-routing.module';
import { InicioComponent } from './inicio.component';
import { PrimeNgModule } from '../../../prime-ng.module';
import { AvanceRegistroComponent } from './avance-registro/avance-registro.component';


@NgModule({
  declarations: [
    InicioComponent,
    AvanceRegistroComponent,
  ],
  imports: [
    CommonModule,
    InicioRoutingModule,
    PrimeNgModule
  ]
})
export class InicioModule { }
