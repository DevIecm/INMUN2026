import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { Alcaldias } from 'src/app/interfaces/alcaldias';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlcaldiasService } from '../../../../services/alcaldias.service';
import { tap } from 'rxjs';
import Swal from 'sweetalert2';
import { EstadosRepublicaService } from '../../../../services/estados-republica.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-form-datos',
    templateUrl: './form-datos.component.html',
    styles: [
    ]
})
export class FormDatosComponent implements OnInit {

    public convocatoria = environment.convocatoria;
    public aviso_privacidad = environment.aviso_privacidad;

    @Output() cierraModal = new EventEmitter<boolean>();

    public formDatos: FormGroup = this.fb.group({
        nombres: ['', [Validators.required, Validators.maxLength(50)]],
        primer_apellido: ['', [Validators.required, Validators.maxLength(50)]],
        segundo_apellido: ['', [Validators.maxLength(50)]],
        genero: ['', [Validators.required]],
        edad: ['', [Validators.required]],
        curp: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18)]],
        telefono_celular: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]],
        telefono_casa: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]],
        demarcacion_territorial: ['', [Validators.required]],
        entidad_federativa: ['',],
        como_te_enteraste: ['', [Validators.required]],
        necesito_justificante: [, []],
        persona_dirigido: [],
        cargo_persona: [],
        institucion_persona: []
        // Agregados el 20/03/2025
    });

    public stateOptions = [{ label: 'No', value: 0 }, { label: 'Sí', value: 1 }];


    public entera: SelectItem[] = [
        { value: 1, label: 'Página de internet del IECM' },
        { value: 2, label: 'Redes sociales' },
        { value: 3, label: 'Escuela' },
        { value: 4, label: 'Amigos/Familiar' },
    ];

    public selAlcaldias: Alcaldias[] = [
        { id_alcaldia: 1, nombre_alcaldia: 'Fuera de la Ciudad de México' }
    ];

    public selEstados: any[] = [];

    public selGenero: any[] = [
        { genero: 1, descripcion_genero: 'Mujer' },
        { genero: 2, descripcion_genero: 'Hombre' },
        { genero: 3, descripcion_genero: 'Prefiero no decirlo' }
    ];

    public usuario!: Usuario;
    public id_comite!: number;

    public blocked: boolean = false;
    public complemento_info: boolean = false;

    constructor(private fb: FormBuilder, private usuarioService: UsuarioService,
        private alcaldiasService: AlcaldiasService,
        private estadosRepublicaService: EstadosRepublicaService) { }

    ngOnInit(): void {

        this.cargarAlcaldias();
        this.cargaInfo();
        this.cargarEdosRepublica();

    }

    cargaInfo() {
        this.blocked = true;
        this.usuario = this.usuarioService.usuario;
        console.log(this.usuario);
        /* const { uuid,
          estado,
          perfil,
          folio, nombres, primer_apellido, segundo_apellido, genero, edad, curp, telefono_casa, telefono_celular, demarcacion_territorial} = this.usuario; */

        const { nombres, primer_apellido, segundo_apellido, genero, edad, curp, telefono_casa, telefono_celular, demarcacion_territorial, entidad_federativa, como_te_enteraste, id_comite,
            necesito_justificante, persona_dirigido, cargo_persona, institucion_persona
            // discapacidad: valor_discapacidad,
            // cual_discapacidad
        } = this.usuario;

        console.log(this.usuario);
        /* let discapacidad = null;
        if(necesito_justificante){
          discapacidad = 1;
        }
        if(!valor_discapacidad && valor_discapacidad != null){
          discapacidad = 0;
        } */


        setTimeout(() => {
            this.blocked = false;
        }, 500);
        console.log(this.formDatos)
        
        this.formDatos.setValue({ 
            nombres, 
            primer_apellido, 
            segundo_apellido, 
            genero, 
            edad, 
            curp, 
            telefono_casa, 
            telefono_celular, 
            demarcacion_territorial, 
            entidad_federativa, 
            como_te_enteraste, 
            necesito_justificante: necesito_justificante ?? false, 
            persona_dirigido: persona_dirigido ?? '', 
            cargo_persona: cargo_persona ?? '', 
            institucion_persona: institucion_persona ?? ''
        });

        this.id_comite = id_comite;

        if (this.usuario.estado >= 2) {
            this.complemento_info = true;
        }

    }

    submit() {
        console.log(this.formDatos.value);

        if (!this.formDatos.valid) {
            return;
        }

        const { nombres,
            primer_apellido,
            segundo_apellido,
            genero,
            edad,
            curp,
            ...resto } = this.formDatos.value;

        this.usuarioService.complementoInformacion(resto)
            .subscribe((resp: any) => {

                Swal.fire({
                    title: resp.msg,
                    icon: 'success',
                    allowEscapeKey: false,
                    allowOutsideClick: false
                });
                // this.router.navigate(['auth/login']);
                this.cierraModal.emit(true);
                this.usuarioService.validarToken()
                    .pipe(tap((estaAutenticado: boolean) => {
                        // Efecto secundario

                    }))

                console.log(resp);

            })

    }


    cargarAlcaldias() {
        this.alcaldiasService.obtenerAlcaldias()
            .subscribe((alcaldias: any) => {

                console.log(alcaldias);

                // this.demarcacion_territorial = alcaldias;
                // this.selAlcaldias.push();
                alcaldias.forEach((alcaldia: Alcaldias) => {
                    this.selAlcaldias.push(alcaldia);
                });
                // console.log(this.selAlcaldias);

            })
    }

    cargarEdosRepublica() {
        this.estadosRepublicaService.obtenerEstadoRepublica()
            .subscribe((edos: any) => {

                console.log(edos);

                // this.demarcacion_territorial = alcaldias;
                // this.selAlcaldias.push();
                edos.forEach((edo: any) => {
                    this.selEstados.push(edo);
                });
                // console.log(this.selAlcaldias);

            })
    }

    seleccionaEntidad(id_alcaldia: number) {

        console.log(id_alcaldia);
        if (id_alcaldia != 1) {
            this.formDatos.controls['entidad_federativa'].setValue('');
            this.formDatos.controls['entidad_federativa'].removeValidators([Validators.required]);
        } else {
            this.formDatos.controls['entidad_federativa'].setValidators([Validators.required]);
        }

        // this.formPermisos.controls[campo].setValidators(Validators.required);
        this.formDatos.controls['entidad_federativa'].updateValueAndValidity();

    }

    inputsJustificante(valor: any) {
        console.log({ valor });
        /* persona_dirigido
        cargo_persona
        institucion_persona */

        this.formDatos.get('persona_dirigido')?.removeValidators([Validators.required, Validators.maxLength(100)]);
        this.formDatos.get('cargo_persona')?.removeValidators([Validators.required, Validators.maxLength(100)]);
        this.formDatos.get('institucion_persona')?.removeValidators([Validators.required, Validators.maxLength(100)]);
        this.formDatos.get('persona_dirigido')?.setValue('');
        this.formDatos.get('cargo_persona')?.setValue('');
        this.formDatos.get('institucion_persona')?.setValue('');
        if (valor) {

            this.formDatos.get('persona_dirigido')?.addValidators([Validators.required, Validators.maxLength(100)]);
            this.formDatos.get('cargo_persona')?.addValidators([Validators.required, Validators.maxLength(100)]);
            this.formDatos.get('institucion_persona')?.addValidators([Validators.required, Validators.maxLength(100)]);

        }

        this.formDatos.get('persona_dirigido')?.setValue('');
        this.formDatos.get('cargo_persona')?.setValue('');
        this.formDatos.get('institucion_persona')?.setValue('');

    }

}
