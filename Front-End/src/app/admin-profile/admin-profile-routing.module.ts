import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComitesComponent } from './comites/comites.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ValidacionComponent } from './validacion/validacion.component';
import { ReasignacionComiteComponent } from './reasignacion-comite/reasignacion-comite.component';
import { RegistrarComiteComponent } from './comites/registrar-comite/registrar-comite.component';
import { MonitorComponent } from './monitor/monitor.component';
import { SistemaComponent } from './sistema/sistema.component';
import { AsistenciasComitesComponent } from './asistencias-comites/asistencias-comites.component';

const routes: Routes = [
  /* {
    path: '', component: MonitorComponent,
  }, */
  {
    path: 'comites',
    children: [
      {
        path: '', component: ComitesComponent
      },
      { path: 'registrar', component: RegistrarComiteComponent },
      { path: 'editar/:id_comite', component: RegistrarComiteComponent },
    ]
  },
  {
    path: 'reportes', component: ReportesComponent 
  },
  {
    path: 'reasignacion-comite', component: ReasignacionComiteComponent
  },
  {
    path: 'validacion-de-registros', component: ValidacionComponent
  },
  {
    path: 'asistencias-y-comites', component: AsistenciasComitesComponent
  },
  {
    path: 'sistema', component: SistemaComponent
  },
  {
    path: '**', redirectTo: 'validacion-de-registros'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminProfileRoutingModule { }
