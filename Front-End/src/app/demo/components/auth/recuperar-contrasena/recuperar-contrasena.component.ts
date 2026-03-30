import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.scss']
})
export class RecuperarContrasenaComponent implements OnInit {

  public version: string = environment.version;

  public loading: boolean = false;

  blockSpace: RegExp = /[^\s]/; 


  public formOlvideContrasena: FormGroup = this.fb.group({
    correo_electronico: ['', [Validators.required, Validators.minLength(5), Validators.email]],
    usuario: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
  }

  recuperarContrasena() {

    this.loading = true;

    this.usuarioService.solicitarCambioContrasena(this.formOlvideContrasena.value)
      .subscribe((res: any) => {
        this.loading = false;

        Swal.fire({ icon: 'success', text: res.msg, allowOutsideClick: false, allowEnterKey: false, allowEscapeKey: false }).then( (result) => {
          if(result.isConfirmed){
            this.router.navigateByUrl('/auth/login');
          }
        });;
      }, (err: any) => {
        this.loading = false;

        console.log(err)
        if (err.error) {
          return Swal.fire('Ups', err.error.msg, 'error');
        }
        return Swal.fire('Ups', 'Habla con el administrador[F]', 'error');
      })

  }

}
