import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ValidatorService } from '../../../../shared/validator/validator.service';
import { SystemService } from '../../../../services/system.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
    .img-iecm-login {
        width: 100%;
    }
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }

        .bg-iecm {
            background: #8C65AA;
        }

    `]
})
export class LoginComponent implements OnInit {

    public estado_sistema!: number;

    public version: string = environment.version;


    public formLogin: FormGroup = this.fb.group({
        usuario: ['', [Validators.required, Validators.minLength(8)]],
        // correo_electronico: ['', [Validators.required, Validators.minLength(5)]],
        contrasena: ['', [Validators.required, Validators.minLength(8)]]
    });

    valCheck: string[] = ['remember'];

    password!: string;
    loading: boolean = false;

    blockSpace: RegExp = /[^\s]/;

    constructor(public layoutService: LayoutService,
        private fb: FormBuilder,
        private usuarioService: UsuarioService,
        private router: Router,
        private activatedroute: ActivatedRoute,
        private systermService: SystemService) { }

    ngOnInit(): void {
        this.clearLS();
        this.activatedroute.params.subscribe((params: any) => {
            const { correo_electronico, token_mail, uuid } = params;
            if (correo_electronico && token_mail && uuid) {
                this.activarCuenta(correo_electronico, token_mail, uuid)
            }
        });
        this.cargarEstadoSistema();
    }

    login() {
        if (!this.formLogin.valid) {
            return;
        }


        // const correo_electronico = this.formLogin.controls['correo_electronico'].value;
        const usuario = this.formLogin.controls['usuario'].value;
        const contrasena = this.formLogin.controls['contrasena'].value;
        this.loading = true;


        if (!usuario || !contrasena) {
            Swal.fire('Ups', 'Ingresa un usuario y contraseña', 'warning');
            this.loading = false;
            return;
        }

        this.usuarioService.login(this.formLogin.value)
            .subscribe((resp: any) => {

                Swal.fire('Login correcto', '', 'success');

                this.router.navigateByUrl('/main');

            }, (err: any) => {
                this.loading = false;
                console.log(err);
                Swal.fire('Error', err.error.msg, 'error');
            })
        // console.log(this.formLogin.value);

    }


    activarCuenta(correo_electronico: string, token_mail: string, uuid: string) {
        this.usuarioService.activarCuenta(correo_electronico, token_mail, uuid)
            .subscribe((res: any) => {
                Swal.fire({
                    title: `${res.msg}`,
                    icon: 'success',
                    //   timer: 2500,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: true,
                    confirmButtonText: 'Ok'
                });
                this.router.navigate(['auth/login']);

            }, (err: any) => {
                console.log(err);
                if (!err.error.ok) {
                    // this.messageService.add({ severity: 'error', summary: 'Ups', detail: err.error.msg, life: 3000 });
                    Swal.fire('Ups', err.error.msg, 'info');
                } else {
                    console.log('NEl!!!!');
                    Swal.fire('Ups', 'Ocurrió un error CODE[]', 'error');
                }
                this.router.navigate(['auth/login']);

            });
    }

    clearLS() {
        localStorage.clear();
    }

    cargarEstadoSistema() {
        this.systermService.getEstadoSystem()
            .subscribe(({ getEstadoSistemaDB }) => {

                this.estado_sistema = getEstadoSistemaDB.estado;

            }, err => {

                // Problemas con el servidor
                this.estado_sistema = 4;

                console.log(err);


            })
    }
}
