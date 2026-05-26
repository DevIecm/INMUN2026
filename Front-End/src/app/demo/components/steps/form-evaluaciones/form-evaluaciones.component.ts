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
  respuestasSeleccionadasGenerales: any = {};
  respuestasSeleccionadasInicial: any = {};


  preguntasInicial: any[] = [];
  respuestasInicial: any[] = [];
  respuestasSeleccionadasFinal: any = {};

  preguntasSatisfaccion: any[] = [];
  respuestasSatisfaccion: any[] = [];
  respuestasSeleccionadasSatisfaccion: any = {};

  preguntasFinal: any[] = [];
  respuestasFinal: any[] = [];


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

  obtenerRepuestasInicial(idPregunta: number) {
    return this.respuestasInicial?.filter(r => r.pregunta === idPregunta) || [];
  }

  obtenerRepuestasFinal(idPregunta: number) {
    return this.respuestasFinal?.filter(r => r.pregunta === idPregunta) || [];
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

  obtenerRespuestasPorPreguntaSatisfaccion(idPregunta: number) {
    return this.preguntasSatisfaccion?.filter(r => r.pregunta === idPregunta) || [];
  }

  // ===================== OBTENER DATOS GENERALES ===================== //

  obtenerRespuestasPorPreguntaGenerales(idPregunta: number) {
    return this.respuestasGenerales?.filter(r => r.pregunta === idPregunta) || [];
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

  // =====================  FIN OBTENER DATOS GENERALES ===================== //


  obtenerRespuestasInicial(nivel_escolar: number) {
    console.log("Obteniendo respuestas iniciales");
    this.cuestionariosService.obtenerRespuestas(nivel_escolar)
      .subscribe((resp: any) => {
        console.log("resp por nivel: ", resp);
        if (resp.ok == true) {
          console.log("resp.getRespuestasDB: ", resp.getRespuestasDB);
          this.respuestasInicial = resp.getRespuestasDB;
          this.respuestasFinal = resp.getRespuestasDB;
          this.respuestasSatisfaccion = resp.getRespuestasDB;
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
          this.preguntasFinal = resp.getPreguntasDB;
          this.preguntasSatisfaccion = resp.getPreguntasDB;

          console.log("resp.getRespuestasDB: ", resp.getPreguntasDB);
          console.log("this.preguntasFinal: ", this.preguntasFinal);
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

  limpiarVariables() {
    this.preguntasGenerales = [];
    this.respuestasGenerales = [];
    this.respuestasFinal = [];
    this.respuestasSeleccionadasInicial = {};
    this.respuestasInicial = [];
    this.respuestasSeleccionadasFinal = {};
    this.preguntasFinal = [];
    this.respuestasFinal = [];
    this.preguntasInicial = [];
    this.respuestasInicial = [];
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
    this.calcularCalificacionTab();
  }

  sendSatisfaccion(cuestionario: number) {
    this.tabSeleccionado = cuestionario;
    this.enviarSatisfaccion();
  }


  armarRespuestas(preguntas: any[], seleccionadas: any, respuestasCatalogo: any[], idCuestionario: number) {

    return preguntas
      .map(pregunta => {

        const idRespuesta = seleccionadas[pregunta.id];

        if (idRespuesta == null || idRespuesta == undefined) return null;

        const respuestaObj = respuestasCatalogo.find(r => r.id == idRespuesta);

        return {
          id_pregunta: pregunta.id,
          id_respuesta: idRespuesta,
          otro_texto: this.textoOtro[pregunta.id] || null,
          id_cuestionario: idCuestionario,
          calificacion: respuestaObj?.puntuacion ?? 0,
          usuario: Number(localStorage.getItem('keySession')),
        };

      })
      .filter(x => x !== null);
  }


  calcularCalificacion() {

    let totalPreguntas =
      this.preguntasInicial.length +
      this.preguntasGenerales.length;

    let preguntasRespondidas = 0;
    let suma = 0;

    this.preguntasGenerales.forEach(pregunta => {

      const seleccion =
        this.respuestasSeleccionadasGenerales[pregunta.id];

      if (seleccion != undefined && seleccion != null) {
        preguntasRespondidas++;
      }

    });

    this.preguntasInicial.forEach(pregunta => {

      const respuestasDePregunta =
        this.obtenerRepuestasInicial(pregunta.id);

      const seleccion =
        this.respuestasSeleccionadasInicial[pregunta.id];

      if (seleccion != undefined && seleccion != null) {

        preguntasRespondidas++;

        const respuestaObj =
          respuestasDePregunta.find(r => r.id == seleccion);

        if (respuestaObj) {
          suma += respuestaObj.puntuacion;
        }
      }

    });

    if (preguntasRespondidas < totalPreguntas) {

      Swal.fire({
        title: 'Faltan preguntas',
        text: `Faltan preguntas por responder, por favor contesta todas las preguntas.`,
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });

      return;
    }

    this.calificacion1Tab = suma;

    const payload = [
      ...this.armarRespuestas(
        this.preguntasGenerales,
        this.respuestasSeleccionadasGenerales,
        this.respuestasGenerales,
        1
      ),

      ...this.armarRespuestas(
        this.preguntasInicial,
        this.respuestasSeleccionadasInicial,
        this.respuestasInicial,
        1
      )
    ];

    console.log("PAYLOAD FINAL:", payload);

    Swal.fire({
      title: 'Gracias por tu participación',
      text: `Tu calificación es: ${this.calificacion1Tab}`,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      showCancelButton: false
    }).then((result) => {

      if (result.isConfirmed) {

        this.limpiarVariables();

        this.cuestionariosService.guardarRespuestas(payload)
          .subscribe(() => {


            Swal.fire({
              title: 'Gracias por su participación',
              text: 'Tu credencial con código QR ha sido enviada a la dirección de correo electrónico registrada.',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              showCancelButton: false,
              showCloseButton: false
            });

            this.enviarConstanciaQR();
          });

        this.disabledButtonEvaluacionInicial = true;
        this.c0p = true;
        this.c1p = false;
        this.activeIndex = 1;
        this.onTabOpen({ index: 1 });
      }
    });
  }

  calcularCalificacionTab() {

    let totalPreguntas =
      this.preguntasFinal.length +
      this.preguntasGenerales.length;

    console.log("this.preguntasFinal: ", this.preguntasFinal);
    console.log("this.preguntasGenerales: ", this.preguntasGenerales);

    console.log("totalPreguntas: ", totalPreguntas);

    let preguntasRespondidas = 0;
    let suma = 0;

    this.preguntasGenerales.forEach(pregunta => {
      console.log("pregunta: ", pregunta);
      console.log("this.respuestasSeleccionadasGenerales[pregunta.id]: ", this.respuestasSeleccionadasGenerales[pregunta.id]);
      const seleccion =
        this.respuestasSeleccionadasGenerales[pregunta.id];

      if (seleccion != undefined && seleccion != null) {
        preguntasRespondidas++;
      }

    });

    this.preguntasFinal.forEach(pregunta => {

      const respuestasDePregunta =
        this.obtenerRepuestasFinal(pregunta.id);

      const seleccion =
        this.respuestasSeleccionadasFinal[pregunta.id];

      if (seleccion != undefined && seleccion != null) {

        preguntasRespondidas++;

        const respuestaObj =
          respuestasDePregunta.find(r => r.id == seleccion);

        if (respuestaObj) {
          suma += respuestaObj.puntuacion;
        }
      }

    });

    console.log("preguntasRespondidas: ", preguntasRespondidas);

    if (preguntasRespondidas < totalPreguntas) {
      Swal.fire({
        title: 'Faltan preguntas',
        text: `Faltan preguntas por responder, por favor contesta todas las preguntas.`,
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return;
    }


    this.calificacion2Tab = suma;
    console.log(this.tabSeleccionado)

    const payload = [
      ...this.armarRespuestas(
        this.preguntasGenerales,
        this.respuestasSeleccionadasGenerales,
        this.respuestasGenerales,
        2
      ),

      ...this.armarRespuestas(
        this.preguntasInicial,
        this.respuestasSeleccionadasFinal,
        this.respuestasInicial,
        2
      )
    ];

    console.log("PAYLOAD FINAL:", payload);

    this.limpiarVariables();


    this.cuestionariosService.guardarRespuestas(payload)
      .subscribe(() => {
        Swal.fire({
          title: 'Gracias por tu participación',
          text: `Tu calificación es: ${this.calificacion2Tab}`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          showCancelButton: false
        })
      });

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

  isStars(preguntaId: number): boolean {
    return [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 43, 44, 46].includes(preguntaId);
  }


}

