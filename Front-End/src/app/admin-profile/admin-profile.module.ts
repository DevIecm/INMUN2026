import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminProfileRoutingModule } from './admin-profile-routing.module';
import { ValidacionComponent } from './validacion/validacion.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ReasignacionComiteComponent } from './reasignacion-comite/reasignacion-comite.component';
import { ComitesModule } from './comites/comites.module';
import { PrimeNgModule } from '../prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MonitorComponent } from './monitor/monitor.component';
import { SistemaComponent } from './sistema/sistema.component';
import { AsistenciasComitesComponent } from './asistencias-comites/asistencias-comites.component';


@NgModule({
  declarations: [
    ValidacionComponent,
    ReportesComponent,
    ReasignacionComiteComponent,
    MonitorComponent,
    SistemaComponent,
    AsistenciasComitesComponent,
  ],
  imports: [
    CommonModule,
    AdminProfileRoutingModule,
    ComitesModule,
    ReactiveFormsModule,
    PrimeNgModule,
  ],
  exports: [
  ]
})
export class AdminProfileModule { }
