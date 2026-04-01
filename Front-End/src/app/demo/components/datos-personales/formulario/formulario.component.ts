import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from '../../../../shared/validator/validator.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit {

  sexos: SelectItem[] = [];
  accionesAfirmativas: SelectItem[] = [];
  estadosRepublica: SelectItem[] = [];
  edad!: number;
  auxiliarRequerido_B: boolean = false;
  personaDiscapacidad_B: boolean = false;
  afueraCdmx_B: boolean = false;
  paisOrigen_B: boolean = false;
  hijo_B: boolean = false;

  fileCredencialAux!: File;
  fileActaPM!: File;
  fileFoto!: File;
  fileCredencial!: File;
  fileActaNacimiento!: File;
  fileFormatoRegistro!: File;
  fileInformeCapacidadEc!: File;

  regexString_KF: RegExp = this.vs.regexString_KF;

  form: FormGroup = this.fb.group({
    nombres: [ '', [ Validators.required, Validators.pattern(this.vs.regexString), Validators.maxLength(150) ] ],
    apellido_paterno: [ '', [ Validators.required, Validators.pattern(this.vs.regexApellidoPaterno), Validators.maxLength(50) ] ],
    apellido_materno: [ '', [ Validators.required, Validators.pattern(this.vs.regexApellidoMaterno), Validators.maxLength(50) ] ],
    sexo: [ , [ Validators.required ] ],
    accionesAfirmativas: [ , [ Validators.nullValidator, Validators.required ] ],
    ocupacion: [ '', [Validators.required, Validators.pattern(this.vs.regexString), Validators.maxLength(100)] ],
    fechaNacimiento: [ , [ Validators.required ] ],
    edad: [ this.edad, [ Validators.required ] ],
    lugarNacimiento: [ , [ Validators.nullValidator, Validators.required ] ],
    clave_elector: [ , [ Validators.required ] ],
    ocr: [ , [ Validators.required ] ],
    curp: [ , [ Validators.required ] ],
    rfc: [ , [ Validators.required ] ],
    auxiliar: [ , [  ] ],
    auxiliar_nombres: [ , [  ] ],
    fileCredencialAux: [ , [  ] ],
    paisOrigen: [ , [  ] ],
    hijo: [ , [  ] ],
    fileActaPM: [ , [  ] ],

    fileFoto: [ , [ Validators.required ] ],
    fileCredencial: [ , [ Validators.required ] ],
    fileActaNacimiento: [ , [ Validators.required ] ],
    fileFormatoRegistro: [ , [ Validators.required ] ],
    fileInformeCapacidadEc: [ , [ Validators.required ] ]
  });

  constructor( private fb: FormBuilder,
               private vs: ValidatorService ) { }

  ngOnInit(): void {

    this.sexos = [
      {label: 'Masculino', value: '1'},
      {label: 'Femenino', value: '2'}
    ];

    this.accionesAfirmativas = [
      {label: 'Ninguna', value: '1'},
      {label: 'Persona con discapacidad', value: '2'},
      {label: 'Persona de la diversidad sexual', value: '3'},
      {label: 'Persona Afrodescendiente', value: '4'},
      {label: 'Persona perteneciente a pueblos o Barrios Originarios, o de Comunidades indígenas', value: '5'}
    ]; 

    this.estadosRepublica = [
      {label: 'Aguascalientes', value: '1'},
      {label: 'Baja California', value: '2'},
      {label: 'Baja California Sur', value: '3'},
      {label: 'Campeche', value: '4'},
      {label: 'Coahuila', value: '5'},
      {label: 'Colima', value: '6'},
      {label: 'Chiapas', value: '7'},
      {label: 'Chihuahua', value: '8'},
      {label: 'Durango', value: '9'},
      {label: 'Ciudad de México', value: '10'},
      {label: 'Guanajuato', value: '11'},
      {label: 'Guerrero', value: '12'},
      {label: 'Hidalgo', value: '13'},
      {label: 'Jalisco', value: '14'},
      {label: 'Estado de México', value: '15'},
      {label: 'Michoacán', value: '16'},
      {label: 'Morelos', value: '17'},
      {label: 'Nayarit', value: '18'},
      {label: 'Nuevo León', value: '19'},
      {label: 'Oaxaca', value: '20'},
      {label: 'Puebla', value: '21'},
      {label: 'Querétaro', value: '22'},
      {label: 'Quintana Roo', value: '23'},
      {label: 'San Luis Potosí', value: '24'},
      {label: 'Sinaloa', value: '25'},
      {label: 'Sonora', value: '26'},
      {label: 'Tabasco', value: '27'},
      {label: 'Tamaulipas', value: '28'},
      {label: 'Tlaxcala', value: '29'},
      {label: 'Veracruz', value: '30'},
      {label: 'Yucatán', value: '31'},
      {label: 'Zacatecas', value: '32'},
      {label: 'Fuera de la República Mexicana', value: '33'}
    ];
  }

  campoFormulario( campo: string ): AbstractControl<any, any> | null {
    return this.form.get(campo);
  }

  calculaEdad ( event: any ) {
    const nacimiento: Date = event;
    var today = new Date();
    const edad = today.getFullYear() - nacimiento.getFullYear();
    
    this.edad = edad;

    this.campoFormulario('edad')?.patchValue( edad );
  }

  requiereAuxiliar ( event: any ) {
    const respuesta: number = event.value;
    
    if ( respuesta == 1 ) {
      this.auxiliarRequerido_B = true;
      this.campoFormulario('auxiliar_nombres')?.addValidators([Validators.required, Validators.maxLength(200)]);
      this.campoFormulario('fileCredencialAux')?.addValidators([Validators.required]);
    } else {
      this.auxiliarRequerido_B = false;
      this.campoFormulario('auxiliar_nombres')?.clearValidators();
      this.campoFormulario('auxiliar_nombres')?.reset( null );
      this.campoFormulario('fileCredencialAux')?.clearValidators();
      this.campoFormulario('fileCredencialAux')?.reset( null );
    }
  }

  discapacidad ( event: any ) {
    const respuesta: number = event.value;

    if ( respuesta == 2 ) {
      this.personaDiscapacidad_B = true;
      this.campoFormulario('auxiliar')?.addValidators([Validators.required, Validators.nullValidator]);
    } else {
      this.personaDiscapacidad_B = false;
      this.campoFormulario('auxiliar')?.clearValidators();
      this.campoFormulario('auxiliar')?.reset( null );
    }

    this.campoFormulario('auxiliar')?.updateValueAndValidity();

  }

  subirArchivo(nombre: string, event: any) {

    const regexPDF = new RegExp(this.vs.regexPDF);
    const regexIMG = new RegExp(this.vs.regexIMG);

    if (regexPDF.test(event.currentFiles[0].name)) {


      switch (nombre) {
        case 'credencialAux':
          this.fileCredencialAux = event.currentFiles[0];
          this.form.patchValue({ fileCredencialAux: this.fileCredencialAux });
          // console.log(this.campoFormulario('fileCredencialAux')?.value);
          break;

        case 'actaPM':
          this.fileActaPM = event.currentFiles[0];
          this.form.patchValue({ fileActaPM: this.fileActaPM });
          // console.log(this.campoFormulario('fileActaPM')?.value);
          break;

        case 'credencial':
          this.fileCredencial = event.currentFiles[0];
          this.form.patchValue({ fileCredencial: this.fileCredencial });
          // console.log(this.campoFormulario('fileCredencial')?.value);
          break;

        case 'actaNacimiento':
          this.fileActaNacimiento = event.currentFiles[0];
          this.form.patchValue({ fileActaNacimiento: this.fileActaNacimiento });
          // console.log(this.campoFormulario('fileActaNacimiento')?.value);
          break;

        case 'formatoRegistro':
          this.fileFormatoRegistro = event.currentFiles[0];
          this.form.patchValue({ fileFormatoRegistro: this.fileFormatoRegistro });
          // console.log(this.campoFormulario('fileFormatoRegistro')?.value);
          break;

        case 'informeCapacidadEc':
          this.fileInformeCapacidadEc = event.currentFiles[0];
          this.form.patchValue({ fileInformeCapacidadEc: this.fileInformeCapacidadEc });
          // console.log(this.campoFormulario('fileInformeCapacidadEc')?.value);
          break;
      }

    } else {
      if ( regexIMG.test( event.currentFiles[0].name )) {
        this.fileFoto = event.currentFiles[0]; 
        this.form.patchValue({ fileFoto: this.fileFoto }); 
        // console.log(this.campoFormulario('fileFoto')?.value);
      }
    }
  }
    
  afuerasCdmx ( event: any ) {

    const afueraCdmxVal = event.value;

    // CDMX: 10
    if ( afueraCdmxVal != 10 ) {
      this.afueraCdmx_B = true;

      this.campoFormulario('hijo')?.addValidators([Validators.required]);
  
      if ( afueraCdmxVal == 33 ) {
        this.paisOrigen_B = true;
        this.campoFormulario('paisOrigen')?.addValidators([Validators.required, Validators.maxLength(100)]);
      } else {
        this.paisOrigen_B = false;
        this.campoFormulario('paisOrigen')?.clearValidators();
        this.campoFormulario('paisOrigen')?.reset( null );

      }

    } else {
      this.afueraCdmx_B = false;
      this.campoFormulario('hijo')?.clearValidators();
      this.campoFormulario('hijo')?.reset( null ); 
    }
  }
  
  hijoPM ( event: any ) {
    if( event.value != '1' ) {
      this.hijo_B = true;
      this.campoFormulario('fileActaPM')?.addValidators([Validators.required]);
    } else {
      this.hijo_B = false;
      this.campoFormulario('fileActaPM')?.clearValidators();
      this.campoFormulario('fileActaPM')?.reset( null );
    }
    
  }

  submit () {
    // this.fileCredencialAux

  }
}
