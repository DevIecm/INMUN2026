import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ValidatorService } from '../../../../shared/validator/validator.service';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.component.html',
  styleUrls: ['./informacion.component.scss']
})
export class InformacionComponent implements OnInit {

  @Output() formEstado = new EventEmitter<boolean>();

  regexEmail_KF: RegExp = this.vs.regexEmail_KF;

  form: FormGroup = this.fb.group({
    telefono_casa: [ , [  ] ],
    telefono_oficina: [ , [  ] ],
    extension: [ , [  ] ],
    telefono_celular: [ , [ Validators.required, Validators.pattern(this.vs.regexTelefono)] ],
    correo_electronico: [ , [ Validators.required, Validators.pattern(this.vs.emailPattern), Validators.maxLength(50) ] ],

  }, {
    validators: [ this.vs.compararTelefonos('telefono_casa', 'telefono_oficina', 'telefono_celular') ]
  });

  constructor( private fb: FormBuilder,
               private vs: ValidatorService ) { }

  ngOnInit(): void {

    // this.form.valueChanges.subscribe(() => {
    //   console.log(this.form.controls);
    // });


  }

  campoFormulario( campo: string ): AbstractControl<any, any> | null {
    return this.form.get(campo);
  }

  submit() {

    if ( this.form.valid ) {
      const estado = true;
      this.formEstado.emit( estado );
    }

    // if ( this.campoFormulario('telefono_casa')?.value == this.campoFormulario('telefono_oficina')?.value ||
    //      this.campoFormulario('telefono_oficina')?.value == this.campoFormulario('telefono_celular')?.value ) {
    //   this.form.invalid;
    //   return;
    // }

  }

}
