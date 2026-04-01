import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ValidatorService } from '../../../../shared/validator/validator.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit {

  ciudades: SelectItem[] = [];
  colonias: SelectItem[] = [];
  
  regexCircunscripcion: string = this.vs.regexCircunscripcion;
  regexMeses: string = this.vs.regexMeses;
  regexNumDir_KF = this.vs.regexNumDir_KF;

  afuerasCdmx: boolean = false;
  documento!: File;

  form: FormGroup = this.fb.group({
    terminos: [ false, [  ] ],
    calle_afuera: [ , [  ] ],
    numero_exterior_afuera: [ , [  ] ],
    numero_interior_afuera: [ , [  ] ],
    codigo_postal_afuera: [ , [  ] ],
    colonia_afuera: [ , [  ] ],
    ciudad_afuera: [ , [  ] ],
    entidad_fed_afuera: [ , [  ] ],
    calle: [ , [ Validators.required, Validators.pattern(this.vs.regexAlphanum), Validators.maxLength(50) ] ],
    numero_exterior: [ , [ Validators.required, Validators.pattern(this.vs.regexAlphanum), Validators.maxLength(100) ] ],
    numero_interior: [ , [ Validators.required, Validators.pattern(this.vs.regexAlphanum), Validators.maxLength(100) ] ],
    ciudad: [ '1' , [ Validators.required, Validators.nullValidator ] ],
    demarcacion_territorial: [ , [ Validators.required, Validators.nullValidator ] ],
    codigo_postal: [ , [ Validators.required ] ],
    colonia: [ , [ Validators.required, Validators.nullValidator ] ],
    seccion_electoral: [ , [ Validators.required ] ],
    circunscripcion: [ , [ Validators.required, Validators.pattern(this.vs.regexCircunscripcion) ] ],
    anios: [ , [ Validators.required ] ],
    meses: [ , [ Validators.required, Validators.pattern(this.vs.regexMeses) ] ],
    fileDoc: [ , [ Validators.required ] ]
  });

  constructor ( private fb: FormBuilder, private vs: ValidatorService ) { }

  ngOnInit(): void {
    this.ciudades = [
      { label: 'Ciudad de Mexico', value: '1' },
      { label: 'Tijuana', value: '2' }
    ];

    this.colonias = [
      { label: 'Desarrollo Urbano Quetzalcoatl', value: '1' },
      { label: 'La Era', value: '2' },
    ];
  }

  campoFormulario( campo: string ): AbstractControl<any, any> | null {
    return this.form.get(campo);
  }

  aceptoTerminos () {
    this.afuerasCdmx = this.campoFormulario('terminos')?.value;

    if ( this.campoFormulario('terminos')?.value == false ) { 
      this.campoFormulario('calle_afuera')?.reset();
      this.campoFormulario('numero_exterior_afuera')?.reset();
      this.campoFormulario('numero_interior_afuera')?.reset();
      this.campoFormulario('codigo_postal_afuera')?.reset();
      this.campoFormulario('colonia_afuera')?.reset();
      this.campoFormulario('ciudad_afuera')?.reset();
      this.campoFormulario('entidad_fed_afuera')?.reset();

      this.campoFormulario('calle_afuera')?.clearValidators();
      this.campoFormulario('numero_exterior_afuera')?.clearValidators();
      this.campoFormulario('numero_interior_afuera')?.clearValidators();
      this.campoFormulario('codigo_postal_afuera')?.clearValidators();
      this.campoFormulario('colonia_afuera')?.clearValidators();
      this.campoFormulario('ciudad_afuera')?.clearValidators();
      this.campoFormulario('entidad_fed_afuera')?.clearValidators();

      this.campoFormulario('calle_afuera')?.updateValueAndValidity();
      this.campoFormulario('numero_exterior_afuera')?.updateValueAndValidity();
      this.campoFormulario('numero_interior_afuera')?.updateValueAndValidity();
      this.campoFormulario('codigo_postal_afuera')?.updateValueAndValidity();
      this.campoFormulario('colonia_afuera')?.updateValueAndValidity();
      this.campoFormulario('ciudad_afuera')?.updateValueAndValidity();
      this.campoFormulario('entidad_fed_afuera')?.updateValueAndValidity();

    } else {

      this.campoFormulario('calle_afuera')?.addValidators([Validators.required, Validators.pattern(this.vs.regexAlphanum), Validators.maxLength(50)]);
      this.campoFormulario('numero_exterior_afuera')?.addValidators([Validators.required, Validators.pattern(this.vs.regexAlphanum), Validators.maxLength(100)]);
      this.campoFormulario('numero_interior_afuera')?.addValidators([Validators.required, Validators.pattern(this.vs.regexAlphanum), Validators.maxLength(100)]);
      this.campoFormulario('codigo_postal_afuera')?.addValidators([Validators.required]);
      this.campoFormulario('colonia_afuera')?.addValidators([Validators.required, Validators.nullValidator]);
      this.campoFormulario('ciudad_afuera')?.addValidators([Validators.required, Validators.nullValidator]);
      this.campoFormulario('entidad_fed_afuera')?.addValidators([Validators.required, Validators.nullValidator]);

    }
  }

  subirArchivo( nombre: string, event: any ) {
    this.documento = event.currentFiles[0];
    this.form.patchValue({ fileDoc: this.documento });
    // console.log( this.form.controls['fileDoc'].value );
  }
}
