import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from "primeng/button";


@Component({
  selector: 'app-form-evaluaciones',
  templateUrl: './form-evaluaciones.component.html',
  styles: [
  ], 
  standalone: true,
  imports: [
    AccordionModule,
    ButtonModule
]
})
export class FormEvaluacionesComponent implements OnInit {

  c1p: boolean = true;
  c2p: boolean = true;
  c3p: boolean = true;
  disabledButtonEvaluacionInicial: boolean = false;
  disabledButtonEvaluacionFinal: boolean = false;
  disabledButtonEncuestaSatisfaccion: boolean = false;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
  }

  enviarConstancia() {
    if (this.c3p) {
      return;
    }

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

  sendEvaluacionInicial() {
    console.log("Enviando evaluación inicial...");
    this.c1p = false;
    this.disabledButtonEvaluacionInicial = true;
  }

  sendEvaluacionFinal() {
    this.c1p = false;
    this.c2p = false;
    this.disabledButtonEvaluacionFinal = true;
    console.log("Enviando evaluación final...");
  }

  sendEncuestaSatisfaccion() {
    this.c1p = false;
    this.c2p = false;
    this.c3p = false;
    this.disabledButtonEncuestaSatisfaccion = true;
    console.log("Enviando encuesta de satisfacción...");
  }
}
