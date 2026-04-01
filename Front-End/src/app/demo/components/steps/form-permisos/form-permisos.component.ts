import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { PermisosService } from 'src/app/services/permisos-menores.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { tap } from 'rxjs';
import { PermisosAutorizaciones } from 'src/app/models/permisos-menores.model';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-form-permisos',
    templateUrl: './form-permisos.component.html',
    styles: [
        `
    .field:hover{
      background-color: #9400d30d;
    }
    :host ::ng-deep .p-inplace {
    /* margin-top: 40px; */
}

:host ::ng-deep .p-inplace-display {
    /* padding: 20px;
    border: 5px solid red; */
    padding: 0;
    border-radius: 6px;
    transition: none;
}

:host ::ng-deep .p-inplace-content {
    /* padding: 20px; */
    /* border: 5px solid green; */
    /* border-radius: 10px; */
}

:host ::ng-deep .dark-panel.p-panel {
    .p-panel-header {
        background: #212121;
    }
}

.field{
  text-align: justify;
}
    `
    ]
})
export class FormPermisosComponent implements OnInit {

    public convocatoria = environment.convocatoria;
    public aviso_privacidad = environment.aviso_privacidad;

    public habilita_o_no_input_text: boolean = false;
    public active_input: boolean = false;
    public cierra_registro: boolean = false;

    public con_informacion_capturada: boolean = false;
    public loading: boolean = false;
    public submited: boolean = false;

    public mayor_edad: boolean = false;

    public formPermisos: FormGroup = this.fb.group({
        conoce_acepta_terminos_convocatoria: ['', [Validators.required, Validators.requiredTrue]],
        ha_leido_aviso_privacidad: ['', [Validators.required, Validators.requiredTrue]],
        autoriza_uso_imagen: ['', [Validators.required, Validators.requiredTrue]]
    });

    public regexElector: string = "^[a-zA-Z]{6}[0-9]{8}((h|H)|(m|M))[0-9]{3}$";

    public formPermisosMenor: FormGroup = this.fb.group({
        conoce_acepta_terminos_convocatoria: ['', [Validators.required, Validators.requiredTrue]],
        ha_leido_aviso_privacidad: ['', [Validators.required, Validators.requiredTrue]],
        nombre_tutor: ['', [Validators.required, Validators.maxLength(100)]],
        curp_tutor: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18), Validators.pattern(this.regexElector)]],
        parentesco: ['', [Validators.required]],
        autoriza_uso_imagen: ['', [Validators.required, Validators.requiredTrue]]
    });

    public parentescoSel: any[] = [
        { parentesco: 1, descripcion_parentesco: 'Padre' },
        { parentesco: 2, descripcion_parentesco: 'Madre' },
        { parentesco: 3, descripcion_parentesco: 'Tutor' }
    ];

    public usuario!: Usuario;
    public permisosAutorizaciones!: PermisosAutorizaciones;

    constructor(private fb: FormBuilder, private usuarioService: UsuarioService,
        private permisosService: PermisosService,
        private router: Router) { }

    ngOnInit(): void {
        this.cargaInfo();
    }

    submitPermisos() {
        this.loading = true;
        this.submited = true;
        // console.log(this.formPermisos.value);
        this.permisosService.guardaPermisosYAutorizaciones(this.formPermisos.value)
            .subscribe((res: any) => {
                this.loading = false;
                this.submited = false;
                this.cierra_registro = true;
                if (res.ok) {
                    Swal.fire({
                        title: '¡Excelente!',
                        text: res.msg,
                        icon: 'success',
                        allowEscapeKey: false,
                        allowOutsideClick: false
                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                            // Swal.fire('Saved!', '', 'success')
                            // this.router.navigateByUrl('/main');
                            this.usuarioService.logOut();
                        } else if (result.isDenied) {
                            // Swal.fire('Changes are not saved', '', 'info')
                        }
                    })
                }
                console.log(res);
            }, (err: any) => {
                console.log(err);
                this.loading = false;
                let msg_new = 'Ocurrió un error, hable con el administrador';
                let title = 'Error';
                let icon: SweetAlertIcon = 'error';
                if (err.error) {
                    icon = 'warning'
                    if (!err.error.con_lugar) {
                        msg_new = err.error.msg;
                        title = 'Lo sentimos';
                    }
                }

                Swal.fire({ title, text: err.error.msg, icon, allowOutsideClick: false, allowEscapeKey: false })
                    .then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                            // Swal.fire('Saved!', '', 'success')
                            // this.router.navigateByUrl('/main/complementa-informacion');
                            window.location.reload();
                        } else if (result.isDenied) {
                            // Swal.fire('Changes are not saved', '', 'info')
                        }
                    });

            })

    }

    submitPermisosMenor() {
        this.loading = true;
        this.submited = true;
        // console.log(this.formPermisos.value);
        this.permisosService.guardaPermisosYAutorizacionesMenor(this.formPermisosMenor.value)
            .subscribe((res: any) => {
                this.loading = false;
                this.submited = false;
                this.cierra_registro = true;
                if (res.ok) {
                    Swal.fire({ title: '¡Excelente!', text: res.msg, icon: 'success', allowEscapeKey: false, allowOutsideClick: false })
                        .then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                                // Swal.fire('Saved!', '', 'success')
                                // this.router.navigateByUrl('/main');
                                this.usuarioService.logOut();

                            } else if (result.isDenied) {
                                // Swal.fire('Changes are not saved', '', 'info')
                            }
                        })
                }
                // console.log(res);
            }, (err: any) => {
                console.log(err);
                this.loading = false;
                let msg_new = 'Ocurrió un error';
                let title = 'Error';
                let icon: SweetAlertIcon = 'error';
                if (err.error) {
                    icon = 'warning'
                    if (!err.error.con_lugar) {
                        msg_new = err.error.msg;
                        title = 'Lo sentimos';
                    }
                }

                Swal.fire({ title, text: err.error.msg, icon, allowOutsideClick: false, allowEscapeKey: false })
                    .then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                            // Swal.fire('Saved!', '', 'success')
                            // this.router.navigateByUrl('/main/complementa-informacion');
                            window.location.reload();
                        } else if (result.isDenied) {
                            // Swal.fire('Changes are not saved', '', 'info')
                        }
                    })

            })

    }

    limpiaCampo(campo: 'nombre_tutor' | 'curp_tutor' | 'parentesco') {
        this.formPermisos.controls[campo].reset('');
    }

    verificaEsMenor(valor: boolean) {
        // console.log(valor);

        this.active_input = !this.active_input;

        if (valor) {

            this.habilita_o_no_input_text = true;
            this.colocaValidators('nombre_tutor');
            this.colocaValidators('curp_tutor');
            this.colocaValidators('parentesco');


        } else {
            this.remueveValidators('nombre_tutor');
            this.remueveValidators('curp_tutor');
            this.remueveValidators('parentesco');
            this.formPermisos.controls['nombre_tutor'].setValue('');
            this.formPermisos.controls['curp_tutor'].setValue('');
            this.formPermisos.controls['parentesco'].setValue('');
            this.habilita_o_no_input_text = false;
        }

    }

    remueveValidators(campo: string) {
        this.formPermisos.controls[campo].removeValidators(Validators.required);
        this.formPermisos.controls[campo].updateValueAndValidity();
    }
    colocaValidators(campo: string) {
        this.formPermisos.controls[campo].setValidators(Validators.required);
        this.formPermisos.controls[campo].updateValueAndValidity();

    }

    cargaInfo() {
        // this.blocked = true;
        this.usuario = this.usuarioService.usuario;

        const { edad } = this.usuario;
        this.mayor_edad = false;

        if (Number(edad) >= 18) {
            // Habilita priemros 3 checks
            this.mayor_edad = true;
            this.habilita_o_no_input_text = false;
        } else {
            this.habilita_o_no_input_text = true;

        }

        this.permisosService.obtenerPermisoCapturado()
            .subscribe((resp: any) => {
                // console.log(resp);
                if (resp) {
                    this.cierra_registro = true;

                }
                const { id_autorizacion,
                    conoce_acepta_terminos_convocatoria,
                    ha_leido_aviso_privacidad,
                    autoriza_uso_imagen,
                    nombre_tutor,
                    curp_tutor,
                    parentesco,
                    menor_edad } = resp.permisoDB;
                if (menor_edad) {

                    this.habilita_o_no_input_text = true
                    this.active_input = !this.active_input;
                    this.formPermisosMenor.setValue({
                        nombre_tutor,
                        curp_tutor,
                        parentesco, menor_edad, conoce_acepta_terminos_convocatoria, ha_leido_aviso_privacidad
                    });

                } else {
                    this.formPermisos.setValue({
                        conoce_acepta_terminos_convocatoria, ha_leido_aviso_privacidad,
                        autoriza_uso_imagen
                    });
                    this.active_input = !this.active_input;
                    this.habilita_o_no_input_text = false
                };

            }, (err: any) => {
                console.warn('aqui!!');

                console.log(err);

            })

        // this.formPermisos.setValue({ conoce_acepta_terminos_convocatoria, autoriza_uso_imagen, ha_leido_aviso_privacidad });

    }

}
