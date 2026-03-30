import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsociacionCivilComponent } from './asociacion-civil.component';

const routes: Routes = [
  {
    path: '',
    component: AsociacionCivilComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsociacionCivilRoutingModule { }
