import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';

import { MessageService, SelectItem } from 'primeng/api';
import { RegistroResponse } from 'src/app/interfaces/registro-response';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ValidatorService } from '../../../../shared/validator/validator.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SystemService } from '../../../../services/system.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    public estado_sistema!: number;


    public version: string = environment.version;

    sexos: SelectItem[] = [];
    candidaturas: SelectItem[] = [];
    diputacionSelect: boolean = false;
    alcaldiaSelect: boolean = false;


    catalogoDistritos: SelectItem[] = [];
    catalogoAlcaldias: SelectItem[] = [];

    seleccionado!: any;

    regexString_KF: RegExp = this.vs.regexString_KF;
    regexEmail_KF: RegExp = this.vs.regexEmail_KF;

    // minDate: Date = new Date("01/01/1994");
    minDate: Date = new Date(2000, 0, 1);
    maxDate: Date = new Date(2013, 11, 31);
    // maxDate: Date = new Date("2011-12-31");

    blockSpecial: RegExp = /^[^\s<>*!ñÑóÓ]+$/

    formRegister: FormGroup = this.fb.group({
        nombres: ['', [Validators.required, Validators.maxLength(100)]],
        primer_apellido: ['', [Validators.required, Validators.maxLength(100)]],
        segundo_apellido: ['', [Validators.required, Validators.maxLength(100)]],
        fecha_nacimiento: ['', [Validators.required]],
        edad: ['', [Validators.required]],
        genero: ['', [Validators.required]],
        usuario: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(8)]],
        correo_electronico: ['', [Validators.required, Validators.email]],
        correo_electronico_repetir: ['', [Validators.required, Validators.email]],
        contrasena: ['', [Validators.required, Validators.minLength(8)]],
        contrasena_repetir: ['', [Validators.required, Validators.minLength(8)]],
        curp: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18)]],
        curp_repetir: [, [Validators.required, Validators.minLength(18), Validators.maxLength(18)]],
        // captcha: [false, [Validators.required, Validators.requiredTrue]]
    }, {
        validators: [
            this.vs.camposIguales('correo_electronico', 'correo_electronico_repetir'),
            this.vs.camposIguales('contrasena', 'contrasena_repetir'),
            this.vs.camposIguales('curp', 'curp_repetir')
        ]
    });

    loading: boolean = false;
    blockSpace: RegExp = /[^\s]/;

    public selGenero: any[] = [
        { genero: 1, descripcion_genero: 'Mujer' },
        { genero: 2, descripcion_genero: 'Hombre' },
        { genero: 3, descripcion_genero: 'Prefiero no decirlo' }
    ];


    constructor(private fb: FormBuilder,
        private vs: ValidatorService,
        private usuarioService: UsuarioService,
        private router: Router,
        private systermService: SystemService) { }

    ngOnInit(): void {
        // console.log(this.minDate);
        // console.log(this.maxDate);
        this.cargarEstadoSistema();

    }

    calculaEdad(fecha: any) {

        fecha = new Date(fecha);

        const fecha_limite = new Date(2025, 11, 31);
        let timeDiff = Math.abs(fecha_limite.getTime() - fecha.getTime());
        let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        console.log(age);
        this.formRegister.controls['edad'].setValue(age);

        const minDate = new Date(2000, 0, 1); // Enero 1, 2000
        const maxDate = new Date(2013, 11, 31); // Diciembre 31, 2013

        if (fecha < minDate || fecha > maxDate) {
            this.formRegister.controls['edad'].setValue('');
            this.formRegister.controls['fecha_nacimiento'].setValue('');
            Swal.fire('Ups', 'La base primera de la convocatoria señala: Podrán participar jóvenes que tengan entre 12 y 25 años cumplidos al 31 de diciembre del 2025.', 'info');
        }
    }

    transformUpper(value: string) {
        return value.toUpperCase();
    }

    submit() {

        this.loading = true;

        if (!this.formRegister.valid) {
            return Swal.fire('Ups!', 'Debes completar el formulario', 'info');
        }

        const { correo_electronico_repetir, contrasena_repetir, curp_repetir, ...data } = this.formRegister.value;

        data.curp = data.curp.toUpperCase();

        return this.usuarioService.crearUsuario(data)
            .subscribe((resp: RegistroResponse) => {

                this.loading = false;
                // this.messageService.add({ severity: 'success', summary: 'Success', detail: resp.msg });
                Swal.fire({
                    title: 'Bien',
                    text: resp.msg,
                    icon: 'success',
                    // confirmButtonText: '',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.router.navigateByUrl('/auth/login');
                    }
                });
                console.log(resp);

            }, (err: any) => {
                console.log(err);
                this.loading = false;
                if (!err.ok) {
                    // this.messageService.add({ severity: 'success', summary: 'Success', detail: err.msg });
                    let msg = 'Ocurrió un error, hable con el adminisrtador';
                    if (err.error.msg) {
                        msg = err.error.msg
                    }
                    Swal.fire({
                        title: 'Error',
                        text: msg,
                        icon: 'error',
                        // confirmButtonText: '',
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });
                }

            })


        // console.log(this.formRegister.value);
    }

    onScriptLoad() {
        console.log('Google reCAPTCHA loaded and is ready for use!')
    }

    onScriptError() {
        console.log('Something went long when loading the Google reCAPTCHA')
    }

    changeeed(event: any) {
        console.log(event);
    }

    campoNoValido(campo: string): boolean {
        if (this.formRegister.get(campo)?.invalid && this.formRegister.get(campo)?.touched) {
            return true;
        } else {
            return false
        }
    }

    cargarEstadoSistema() {
        this.systermService.getEstadoSystem()
            .subscribe(({ getEstadoSistemaDB }) => {
                // console.log(getEstadoSistemaDB);
                this.estado_sistema = getEstadoSistemaDB.estado;

            }, err => {

                // Problemas con el servidor
                this.estado_sistema = 4;
                console.log(err);
            })
    }

}
