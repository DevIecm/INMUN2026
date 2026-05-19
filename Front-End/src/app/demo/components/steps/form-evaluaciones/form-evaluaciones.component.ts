import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from "primeng/button";
import { FormGroup, FormBuilder, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CuestionariosService } from 'src/app/services/cuestionarios.service';

@Component({
  selector: 'app-form-evaluaciones',
  templateUrl: './form-evaluaciones.component.html',
  styles: [
  ],
  standalone: true,
  imports: [
    AccordionModule,
    ButtonModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ]
})
export class FormEvaluacionesComponent implements OnInit {

  c0p: boolean = false;
  c1p: boolean = true;
  c2p: boolean = true;
  c3p: boolean = true;
  disabledButtonEvaluacionInicial: boolean = false;
  disabledButtonEvaluacionFinal: boolean = false;
  disabledButtonEncuestaSatisfaccion: boolean = false;

  preguntas: any[] = [];
  respuestas: any[] = [];

  // preguntasInicial: any[] = [];
  preguntasFinal: any[] = [];
  preguntasSatisfaccion: any[] = [];

  respuestasFinal: any[] = [];
  respuestasSatisfaccion: any[] = [];

  respuestasMultiples: any = {};
  respuestasSeleccionadas: any = {};
  respuestasSeleccionadasFinal: any = {};
  textoOtro: any = {};

  tabSeleccionado: number = 0;
  calificacion1Tab: number = 0;
  calificacion2Tab: number = 0;
  // calificacion3Tab: number = 0;
  activeIndex: number | number[] = 0;

  form!: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private cuestionariosService: CuestionariosService,
    private fb: FormBuilder) { }

  iniciaFormulario() {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.cargaEvaluaciones();
    this.iniciaFormulario();
    this.obtenerPreguntasDiagnostico(1);
  }

  onCheckboxChange(event: any, controlName: string) {

    const formArray = this.form.get(controlName) as FormArray;

    if (!formArray) {
      console.error('No existe el control:', controlName);
      return;
    }

    const input = event.target as HTMLInputElement;
    const value = Number(input.value);

    if (input.checked) {
      if (!formArray.value.includes(value)) {
        formArray.push(this.fb.control(value));
      }
    } else {
      const index = formArray.controls.findIndex(x => x.value === value);
      if (index !== -1) {
        formArray.removeAt(index);
      }
    }
  }

  obtenerRespuestas(id_cuestionario: number) {
    this.cuestionariosService.obtenerRespuestas(id_cuestionario)
      .subscribe((resp: any) => {
        console.log(this.activeIndex)
        if (this.activeIndex == 0) {
          this.respuestas = resp.getRespuestasDB;
        } else if (this.activeIndex == 1) {
          this.respuestasFinal = resp.getRespuestasDB;
          console.log(this.respuestasFinal)
        } else if (this.activeIndex == 2) {
          this.respuestasSatisfaccion = resp.getRespuestasDB;
        }
      }, error => {
        Swal.fire({
          text: 'Ocurrió un error al obtener las respuestas del cuestionario. Por favor, inténtalo nuevamente más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
      );
  }

  calcularCalificacion() {

    let totalPreguntas = this.preguntas.length;
    let preguntasRespondidas = 0;
    let suma = 0;

    this.preguntas.forEach(pregunta => {
      const respuestasDePregunta = this.obtenerRespuestasPorPregunta(pregunta.id);
      console.log(respuestasDePregunta);

      // RADIO (una sola respuesta)
      if (!this.esMultiple(pregunta.id)) {

        const seleccion = this.respuestasSeleccionadas[pregunta.id];

        if (seleccion != undefined && seleccion != null) {
          preguntasRespondidas++;

          const respuestaObj = respuestasDePregunta.find(r => r.id == seleccion);

          if (respuestaObj) {
            suma += respuestaObj.puntuacion;
          }
        }
      }

      if (this.esMultiple(pregunta.id)) {

        const control = this.form.get('p' + pregunta.id);

        if (!control) return;

        const seleccionadas: any[] = control.value || [];

        // filtrar SOLO seleccionadas reales
        const seleccionadasReales = seleccionadas.filter(v => v !== null && v !== false);

        // si hay al menos una selección, cuenta como respondida
        if (seleccionadasReales.length > 0) {
          preguntasRespondidas++;
        }

        const respuestasCorrectas = respuestasDePregunta
          .filter(r => r.puntuacion === 1)
          .map(r => r.id);

        // correctas que sí seleccionó el usuario
        const correctasSeleccionadas = seleccionadasReales.filter((id: any) =>
          respuestasCorrectas.includes(id)
        );

        // incorrectas seleccionadas
        const incorrectasSeleccionadas = seleccionadasReales.filter((id: any) =>
          !respuestasCorrectas.includes(id)
        );

        const seleccionoTodasCorrectas =
          correctasSeleccionadas.length === respuestasCorrectas.length;

        const noSeleccionoIncorrectas =
          incorrectasSeleccionadas.length === 0;

        if (seleccionoTodasCorrectas && noSeleccionoIncorrectas) {
          suma += 1;
        }
      }

      console.log("suma: ", suma);

    });

    // if (preguntasRespondidas < 13) {
    //   Swal.fire({
    //     title: 'Faltan preguntas',
    //     text: `Debes contestar las 13 preguntas. Has respondido ${preguntasRespondidas}.`,
    //     icon: 'warning',
    //     confirmButtonText: 'Aceptar'
    //   });
    //   return;
    // }

    this.calificacion1Tab = suma;

    Swal.fire({
      title: 'Gracias por tu participación',
      text: `Tu calificación es: ${this.calificacion1Tab}`,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      showCancelButton: false
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Gracias por su participación',
          text: 'Tu credencial con código QR ha sido enviada a la dirección de correo electrónico registrada.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          showCancelButton: false,
          showCloseButton: false
        })
        this.enviarConstanciaQR();
        this.disabledButtonEvaluacionInicial = true;
        this.c0p = true;
        this.c1p = false;
        this.activeIndex = 1;
        this.onTabOpen({ index: 1 });
      }
    });
  }

  calcularCalificacionTab() {

    let totalPreguntas = this.preguntasFinal.length;
    let preguntasRespondidas = 0;
    let suma = 0;

    this.preguntasFinal.forEach(pregunta => {
      const respuestasDePregunta = this.obtenerRespuestasPorPreguntaFinal(pregunta.id);
      console.log(respuestasDePregunta);

      // RADIO (una sola respuesta)
      if (!this.esMultipleFinal(pregunta.id)) {

        const seleccion = this.respuestasSeleccionadasFinal[pregunta.id];

        if (seleccion != undefined && seleccion != null) {
          preguntasRespondidas++;

          const respuestaObj = respuestasDePregunta.find(r => r.id == seleccion);

          if (respuestaObj) {
            suma += respuestaObj.puntuacion;
          }
        }
      }

      if (this.esMultipleFinal(pregunta.id)) {

        const control = this.form.get('p' + pregunta.id);

        if (!control) return;

        const seleccionadas: any[] = control.value || [];

        // filtrar SOLO seleccionadas reales
        const seleccionadasReales = seleccionadas.filter(v => v !== null && v !== false);

        // si hay al menos una selección, cuenta como respondida
        if (seleccionadasReales.length > 0) {
          preguntasRespondidas++;
        }

        const respuestasCorrectas = respuestasDePregunta
          .filter(r => r.puntuacion === 1)
          .map(r => r.id);

        // correctas que sí seleccionó el usuario
        const correctasSeleccionadas = seleccionadasReales.filter((id: any) =>
          respuestasCorrectas.includes(id)
        );

        // incorrectas seleccionadas
        const incorrectasSeleccionadas = seleccionadasReales.filter((id: any) =>
          !respuestasCorrectas.includes(id)
        );

        const seleccionoTodasCorrectas =
          correctasSeleccionadas.length === respuestasCorrectas.length;

        const noSeleccionoIncorrectas =
          incorrectasSeleccionadas.length === 0;

        if (seleccionoTodasCorrectas && noSeleccionoIncorrectas) {
          suma += 1;
        }
      }

      console.log("suma: ", suma);

    });

    // if (preguntasRespondidas < 13) {
    //   Swal.fire({
    //     title: 'Faltan preguntas',
    //     text: `Debes contestar las 13 preguntas. Has respondido ${preguntasRespondidas}.`,
    //     icon: 'warning',
    //     confirmButtonText: 'Aceptar'
    //   });
    //   return;
    // }

    this.calificacion2Tab = suma;
    console.log(this.tabSeleccionado)
    Swal.fire({
      title: 'Gracias por tu participación',
      text: `Tu calificación es: ${this.calificacion2Tab}`,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      showCancelButton: false
    })

    this.disabledButtonEvaluacionInicial = true;
    this.c2p = true;
    this.c3p = false;
    this.activeIndex = 2;
    this.onTabOpen({ index: 2 });

  }

  enviarSatisfaccion() {
    Swal.fire({
      title: 'Gracias por tu participación',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      showCancelButton: false
    });

    this.c2p = true;
    this.c3p = false;
    this.activeIndex = 3;
    this.onTabOpen({ index: 3 });
    this.disabledButtonEvaluacionInicial = true;
  }

  obtenerRespuestasPorPregunta(idPregunta: number) {
    return this.respuestas?.filter(r => r.pregunta === idPregunta) || [];
  }

  obtenerRespuestasPorPreguntaFinal(idPregunta: number) {
    return this.respuestasFinal?.filter(r => r.pregunta === idPregunta) || [];
  }

  obtenerRespuestasPorPreguntaSatisfaccion(idPregunta: number) {
    return this.respuestasSatisfaccion?.filter(r => r.pregunta === idPregunta) || [];
  }

  esOtro(respuesta: string): boolean {
    return respuesta.includes('Otro:');
  }

  esMultiple(preguntaId: number): boolean {
    return [11, 12, 13].includes(preguntaId);
  }

  esMultipleFinal(preguntaId: number): boolean {
    return [24, 25, 26].includes(preguntaId);
  }

  esTextBox(preguntaId: number): boolean {
    return [45, 42].includes(preguntaId);
  }

  isStars(preguntaId: number): boolean {
    return [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 43, 44, 46].includes(preguntaId);
  }

  obtenerPreguntasDiagnostico(cuestionario: number) {
    this.cuestionariosService.obtenerEvaluacionDiagnostica(cuestionario)
      .subscribe((resp: any) => {
        // this.preguntas = resp.getPreguntasDB;
        if (resp.ok == true) {
          console.log(this.activeIndex)

          if (this.activeIndex == 0) {
            this.preguntas = resp.getPreguntasDB;

            this.preguntas.forEach(pregunta => {
              if (this.esMultiple(pregunta.id)) {
                this.form.addControl('p' + pregunta.id, this.fb.array([]));
              }
            });
            this.obtenerRespuestas(cuestionario);

          }

          if (this.activeIndex == 1) {
            this.preguntasFinal = resp.getPreguntasDB;

            this.preguntasFinal.forEach(pregunta => {
              if (this.esMultipleFinal(pregunta.id)) {
                this.form.addControl('p' + pregunta.id, this.fb.array([]));
              }
            });
            this.obtenerRespuestas(cuestionario);

          }

          if (this.activeIndex == 2) {
            this.preguntasSatisfaccion = resp.getPreguntasDB;

            this.preguntasSatisfaccion.forEach(pregunta => {
              if (this.esMultiple(pregunta.id)) {
                this.form.addControl('p' + pregunta.id, this.fb.array([]));
              }
            });
            this.obtenerRespuestas(cuestionario);

          }
        }
      }, error => {
        Swal.fire({
          text: 'Ocurrió un error al obtener las preguntas del cuestionario. Por favor, inténtalo nuevamente más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
      );
  }

  limpiarEvaluaciones() {
    this.respuestasSeleccionadas = {};
    this.textoOtro = {};
    this.form.reset();

    Object.keys(this.form.controls).forEach(key => {
      this.form.removeControl(key);
    });
  }

  onTabOpen(event: any) {
    this.limpiarEvaluaciones();

    if (event.index === 0) {
      this.obtenerPreguntasDiagnostico(1);
      this.disabledButtonEvaluacionFinal = true;
      this.disabledButtonEncuestaSatisfaccion = true;
    } else if (event.index === 1) {
      this.c0p = true;
      this.obtenerPreguntasDiagnostico(2);
      this.disabledButtonEvaluacionFinal = false;
      this.disabledButtonEvaluacionInicial = true;
      this.disabledButtonEncuestaSatisfaccion = true;
    } else if (event.index === 2) {
      this.c1p = true;
      this.obtenerPreguntasDiagnostico(3);
      this.disabledButtonEvaluacionInicial = true;
      this.disabledButtonEvaluacionFinal = true;
      this.disabledButtonEncuestaSatisfaccion = false;
    }
  }

  enviarConstancia() {
    this.usuarioService.enviarConstanciaParticipacion(new FormData())
      .subscribe({
        next: (resp) => {
          Swal.fire({
            text: 'Se ha enviado la constancia de participación a tu cuenta de correo electrónico con que te registraste.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
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


  enviarConstanciaQR() {
    this.usuarioService.enviarConstanciaParticipacionQR(new FormData())
      .subscribe({
        next: (resp) => {
          Swal.fire({
            text: 'Se ha enviado la Credencial y QR para acceso al INMUN 2026 a tu cuenta de correo electrónico con que te registraste.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            text: 'Ocurrió un error al enviar Credencial y QR para acceso al INMUN 2026. Por favor, inténtalo nuevamente más tarde.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
  }

  guardaRegistros() {

  }

  cargaEvaluaciones() {

  }

  sendEvaluacion(cuestionario: number) {
    this.tabSeleccionado = cuestionario;
    this.calcularCalificacion();
    this.limpiarEvaluaciones();
  }

  sendFinal(cuestionario: number) {
    this.tabSeleccionado = cuestionario;
    this.calcularCalificacionTab();
  }

  sendSatisfaccion(cuestionario: number) {
    this.tabSeleccionado = cuestionario;
    this.enviarSatisfaccion();
    // this.limpiarEvaluaciones();
  }
}
