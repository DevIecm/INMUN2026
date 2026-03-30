import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComitesComponent } from './comites.component';
import { ListadoComitesComponent } from './listado-comites/listado-comites.component';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { RegistrarComiteComponent } from './registrar-comite/registrar-comite.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ComitesComponent,
    ListadoComitesComponent,
    RegistrarComiteComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule
  ]
})
export class ComitesModule { }
