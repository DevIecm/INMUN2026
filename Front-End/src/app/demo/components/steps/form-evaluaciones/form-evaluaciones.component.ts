import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-evaluaciones',
  templateUrl: './form-evaluaciones.component.html',
  styles: [
  ]
})
export class FormEvaluacionesComponent implements OnInit {

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
  }

  enviarConstancia() {

    this.usuarioService.enviarConstanciaParticipacion(new FormData())
      .subscribe({
        next: (resp) => {
          console.log(resp);
          Swal.fire({
            text: 'Se ha enviado la constancia de participación a tu cuenta de correo electrónico con que te registraste.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          console.log("Enviando constancia...");
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            text: 'Ocurrió un error al enviar la constancia de participación. Por favor, inténtalo nuevamente más tarde.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
  }

}
