import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatosContactoRoutingModule } from './datos-contacto-routing.module';
import { DatosContactoComponent } from './datos-contacto.component';
import { PrimeNgModule } from '../../../prime-ng.module';
import { SharedModule } from '../shared/shared.module';
import { InformacionComponent } from './informacion/informacion.component';
import { CargaDocumentosComponent } from './carga-documentos/carga-documentos.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DatosContactoComponent,
    InformacionComponent,
    CargaDocumentosComponent
  ],
  imports: [
    CommonModule,
    DatosContactoRoutingModule,
    PrimeNgModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class DatosContactoModule { }
