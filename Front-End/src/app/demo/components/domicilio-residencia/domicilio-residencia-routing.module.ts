import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DomicilioResidenciaComponent } from './domicilio-residencia.component';

const routes: Routes = [
  {
    path: '',
    component: DomicilioResidenciaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DomicilioResidenciaRoutingModule { }
