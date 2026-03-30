import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsociacionCivilRoutingModule } from './asociacion-civil-routing.module';
import { AsociacionCivilComponent } from './asociacion-civil.component';


@NgModule({
  declarations: [
    AsociacionCivilComponent
  ],
  imports: [
    CommonModule,
    AsociacionCivilRoutingModule
  ]
})
export class AsociacionCivilModule { }
