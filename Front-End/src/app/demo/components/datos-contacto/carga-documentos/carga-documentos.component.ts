import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorService } from '../../../../shared/validator/validator.service';

@Component({
  selector: 'app-carga-documentos',
  templateUrl: './carga-documentos.component.html',
  styleUrls: ['./carga-documentos.component.scss']
})
export class CargaDocumentosComponent implements OnInit {

  formatoValNot!: File;

  form: FormGroup = this.fb.group({
    formatoValNot: [ , [  ] ]
  });

  constructor( private fb: FormBuilder,
               private vs: ValidatorService ) { }

  ngOnInit(): void {
  }

  subirArchivo( nombre: string, event: any ) {

    this.formatoValNot = event.currentFiles[0];
    this.form.patchValue({ formatoValNot: this.formatoValNot });
    console.log( this.form.controls['formatoValNot'].value );
    
  }

}
