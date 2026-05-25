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

  preguntasGenerales: any[] = [];
  respuestasGenerales: any[] = [];

  preguntasInicial: any[] = [];
  respuestasInicial: any[] = [];

  preguntasFinal: any[] = [];
  respuestasFinal: any[] = [];





  respuestasMultiples: any = {};
  respuestasSeleccionadas: any = {};
  respuestasSeleccionadasFinal: any = {};

  textoOtro: any = {};

  tabSeleccionado: number = 0;
  calificacion1Tab: number = 0;
  calificacion2Tab: number = 0;
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
    this.iniciaFormulario();
    this.obtenerPreguntasGenerales();
  }

  onCheckboxChange(event: any, controlName: string, pregunta?: any, respuesta?: any) {

    console.log("Pregunta:", pregunta);
    console.log("Respuesta:", respuesta);

    if (pregunta.id == 66) {
      if (respuesta.id == 63 || respuesta.id == 64 || respuesta.id == 65 || respuesta.id == 66) {
        this.obtenerPreguntas(1);
      } else if (respuesta.id == 67 || respuesta.id == 68 || respuesta.id == 69) {
        this.obtenerPreguntas(2);
      } else if (respuesta.id == 70 || respuesta.id == 71 || respuesta.id == 72 || respuesta.id == 73 || respuesta.id == 74) {
        this.obtenerPreguntas(3);
      }
    }

    // const formArray = this.form.get(controlName) as FormArray;

    // if (!formArray) {
    //   console.error('No existe el control:', controlName);
    //   return;
    // }

    // const input = event.target as HTMLInputElement;
    // const value = Number(input.value);

    // if (input.checked) {
    //   if (!formArray.value.includes(value)) {
    //     formArray.push(this.fb.control(value));
    //   }
    // } else {
    //   const index = formArray.controls.findIndex(x => x.value === value);
    //   if (index !== -1) {
    //     formArray.removeAt(index);
    //   }
    // }
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
    return this.respuestasGenerales?.filter(r => r.pregunta === idPregunta) || [];
  }

  obtenerRepuestasInicial(idPregunta: number) {
    return this.respuestasInicial?.filter(r => r.pregunta === idPregunta) || [];
  }

  // obtenerRepuestasFinal(idPregunta: number) {
  //   return this.respuestasFinal?.filter(r => r.pregunta === idPregunta) || [];
  // }

  esOtro(respuesta: string): boolean {
    // console.log("respuesta: ", respuesta);
    return respuesta.includes('Otro');
  }

  esTextBox(preguntaId: number): boolean {
    return [45, 42].includes(preguntaId);
  }

  obtenerPreguntasGenerales() {
    console.log("Obteniendo preguntas generales");
    this.cuestionariosService.obtenerPreguntasGenerales()
      .subscribe((resp: any) => {
        if (resp.ok == true) {
          console.log("resp.getPreguntasGeneralesDB: ", resp.getPreguntasGeneralesDB);
          this.preguntasGenerales = resp.getPreguntasGeneralesDB;
        } else {
          Swal.fire({
            title: 'Error al obtener preguntas',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });

    this.obtenerRespuestasGenerales();
  }

  obtenerRespuestasGenerales() {
    console.log("Obteniendo respuestas generales");
    this.cuestionariosService.obtenerRespuestasGenerales()
      .subscribe((resp: any) => {
        console.log("resasasassp: ", resp);
        if (resp.ok == true) {
          console.log("resp.getRespuestasGeneralesDB: ", resp.getRespuestasGeneralesDB);
          this.respuestasGenerales = resp.getRespuestasGeneralesDB;
        } else {
          Swal.fire({
            title: 'Error al obtener respuestas',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
  }

  obtenerRespuestasInicial(nivel_escolar: number) {
    console.log("Obteniendo respuestas iniciales");
    this.cuestionariosService.obtenerRespuestas(nivel_escolar)
      .subscribe((resp: any) => {
        console.log("resp por nivel: ", resp);
        if (resp.ok == true) {
          console.log("resp.getRespuestasDB: ", resp.getRespuestasDB);
          this.respuestasInicial = resp.getRespuestasDB;
        } else {
          Swal.fire({
            title: 'Error al obtener respuestas',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
  }

  obtenerPreguntas(nivel_escolar: number) {
    this.cuestionariosService.obtenerPreguntas(nivel_escolar)
      .subscribe((resp: any) => {
        console.log("resp++++++++++++++++: ", resp);
        if (resp.ok == true) {
          this.preguntasInicial = resp.getPreguntasDB;
        } else {
          Swal.fire({
            title: 'Error al obtener preguntas',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });

    this.obtenerRespuestasInicial(nivel_escolar);
  }

  onTabOpen(event: any) {
    if (event.index === 0) {
      this.disabledButtonEvaluacionFinal = true;
      this.disabledButtonEncuestaSatisfaccion = true;
      this.obtenerPreguntasGenerales();
    } else if (event.index === 1) {
      this.c0p = true;
      this.disabledButtonEvaluacionFinal = false;
      this.disabledButtonEvaluacionInicial = true;
      this.disabledButtonEncuestaSatisfaccion = true;
      this.obtenerPreguntasGenerales();
    } else if (event.index === 2) {
      this.c1p = true;
      this.disabledButtonEvaluacionInicial = true;
      this.disabledButtonEvaluacionFinal = true;
      this.disabledButtonEncuestaSatisfaccion = false;
      this.obtenerPreguntasGenerales();
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

  sendEvaluacion(cuestionario: number) {
    this.tabSeleccionado = cuestionario;
    this.calcularCalificacion();
  }

  sendFinal(cuestionario: number) {
    this.tabSeleccionado = cuestionario;
  }

  sendSatisfaccion(cuestionario: number) {
    this.tabSeleccionado = cuestionario;
    this.enviarSatisfaccion();
  }

  limpiarRespuestas() {
    this.respuestasSeleccionadas = {};
    this.textoOtro = {};
  }

  calcularCalificacion() {

    // let totalPreguntas = this.preguntas.length;
    let preguntasRespondidas = 0;
    let suma = 0;

    // this.preguntas.forEach(pregunta => {
    //   const respuestasDePregunta = this.obtenerRespuestasPorPregunta(pregunta.id);
    //   console.log(respuestasDePregunta);

    //   // RADIO (una sola respuesta)
    //   if (!this.esMultiple(pregunta.id)) {

    //     const seleccion = this.respuestasSeleccionadas[pregunta.id];

    //     if (seleccion != undefined && seleccion != null) {
    //       preguntasRespondidas++;

    //       const respuestaObj = respuestasDePregunta.find(r => r.id == seleccion);

    //       if (respuestaObj) {
    //         suma += respuestaObj.puntuacion;
    //       }
    //     }
    //   }

    //   if (this.esMultiple(pregunta.id)) {

    //     const control = this.form.get('p' + pregunta.id);

    //     if (!control) return;

    //     const seleccionadas: any[] = control.value || [];

    //     // filtrar SOLO seleccionadas reales
    //     const seleccionadasReales = seleccionadas.filter(v => v !== null && v !== false);

    //     // si hay al menos una selección, cuenta como respondida
    //     if (seleccionadasReales.length > 0) {
    //       preguntasRespondidas++;
    //     }

    //     const respuestasCorrectas = respuestasDePregunta
    //       .filter(r => r.puntuacion === 1)
    //       .map(r => r.id);

    //     // correctas que sí seleccionó el usuario
    //     const correctasSeleccionadas = seleccionadasReales.filter((id: any) =>
    //       respuestasCorrectas.includes(id)
    //     );

    //     // incorrectas seleccionadas
    //     const incorrectasSeleccionadas = seleccionadasReales.filter((id: any) =>
    //       !respuestasCorrectas.includes(id)
    //     );

    //     const seleccionoTodasCorrectas =
    //       correctasSeleccionadas.length === respuestasCorrectas.length;

    //     const noSeleccionoIncorrectas =
    //       incorrectasSeleccionadas.length === 0;

    //     if (seleccionoTodasCorrectas && noSeleccionoIncorrectas) {
    //       suma += 1;
    //     }
    //   }

    //   console.log("suma: ", suma);

    // });

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
        // this.enviarConstanciaQR();
        this.disabledButtonEvaluacionInicial = true;
        this.c0p = true;
        this.c1p = false;
        this.activeIndex = 1;
        this.onTabOpen({ index: 1 });
      }
    });
  }

}


