import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentosRoutingModule } from './documentos-routing.module';
import { DocumentosComponent } from './documentos.component';
import { DocumentoComponent } from './documento/documento.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    DocumentosComponent,
    DocumentoComponent
  ],
  imports: [
    CommonModule,
    DocumentosRoutingModule,
    SharedModule
  ]
})
export class DocumentosModule { }
