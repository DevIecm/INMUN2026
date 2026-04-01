import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ValidatorService } from 'src/app/shared/validator/validator.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-recuperar-contrasena',
  templateUrl: './form-recuperar-contrasena.component.html',
  styleUrls: ['./form-recuperar-contrasena.component.scss']
})
export class FormRecuperarContrasenaComponent implements OnInit {

  public version: string = environment.version;

  public loading: boolean = false;

  public token_mail: string = '';


  public formCambiarContrasena: FormGroup = this.fb.group({
    correo_electronico: ['', [Validators.required, Validators.minLength(5), Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(8)]],
    repetir_contrasena: ['', [Validators.required, Validators.minLength(8)]],
    id_usuario: [, [Validators.required]],
    token_mail: [, [Validators.required]]
  }, {
    validators: [
      this.vs.camposIguales('contrasena', 'repetir_contrasena')
    ]
  });

  constructor( private fb: FormBuilder, private activatedroute: ActivatedRoute, private usuarioService: UsuarioService, private vs: ValidatorService, private router: Router) { }

  ngOnInit(): void {
    this.activatedroute.params.subscribe(( params: any ) => {
      const { token_mail, usuario } = params;
      if(token_mail && usuario){
        this.token_mail = token_mail;
        this.obtenerInformacionUsuario(token_mail)
      }
    });
  }

  recuperarContrasena() {

    this.loading = true;

    this.usuarioService.actualizarContrasena( this.formCambiarContrasena.value )
      .subscribe( (res: any) => {
          // console.log(res);

        Swal.fire({title: 'Excelente', text: 'La contraseña se actualizó correctamente', icon:'success', allowOutsideClick: false,
        allowEscapeKey: false}).then( (result) => {
          if(result.isConfirmed){
            this.router.navigateByUrl('/auth/login');
          }
        });
        
      }, (err: any) => {
        console.log(err);
        this.loading = false;
        if (!err.ok) {
          // this.messageService.add({ severity: 'success', summary: 'Success', detail: err.msg });
          let msg = 'Ocurrió un error, hable con el adminisrtador';
          if(err.error.msg){
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



  }

  obtenerInformacionUsuario( token_mail: string ){
    this.usuarioService.validarInfoRecuperarcontrasena( token_mail )
      .subscribe( (res: any) => {
        const { usuarioDB } = res;
        // console.log(usuarioDB);
        // const {  }
        this.formCambiarContrasena.controls['id_usuario'].patchValue(usuarioDB.id_usuario);
        this.formCambiarContrasena.controls['correo_electronico'].patchValue(usuarioDB.correo_electronico);
        this.formCambiarContrasena.controls['token_mail'].patchValue(token_mail);

        
      }, (err: any) => {
        Swal.fire('Ups', 'La información recibida no es válida. O el token generado para la actualización de la contraseña ya fue utilizado. Hable con el administrador.', 'error');
      })
    
  }

}
