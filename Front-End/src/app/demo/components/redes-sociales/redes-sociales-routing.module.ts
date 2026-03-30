import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedesSocialesComponent } from './redes-sociales.component';

const routes: Routes = [
  {
    path: '',
    component: RedesSocialesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RedesSocialesRoutingModule { }
