import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SystemService } from 'src/app/services/system.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sistema',
  templateUrl: './sistema.component.html',
  styles: [
  ]
})
export class SistemaComponent implements OnInit {

  public formConfiguracionSistema: FormGroup = this.fb.group({
    estado: ['', [Validators.required]]
  });

  public estado_sistema!: number;
  public severity: string = 'info';
  public txt_estado: string = 'Cargando...';

  public justifyOptions = [
    { label: 'Cerrar sistema', value: 0, icon: 'pi pi-times' },
    { label: 'Activo', value: 1, icon: 'pi pi-check' },
    { label: 'Inscripciones cerradas antes de fecha de cierre', value: 2, icon: 'pi pi-ban' }
  ];

  public loadingGenerarConstancias: boolean = false;
  public loadingEnviarConstancias: boolean = false;

  constructor(private fb: FormBuilder,
    private systemService: SystemService) { }

  ngOnInit(): void {
    this.cargarEstadoSistema();
    this.danger()
  }

  submit() {

    // TODO: Verificar si es edicion o registro

    if (!this.formConfiguracionSistema.valid) {
      return;
    }


    Swal.fire({
      title: '¿Estás seguro?',
      icon: 'question',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: true,
      confirmButtonText: 'Sí, cambiar estado del sistema',
      showCancelButton: true,
      cancelButtonText: 'Cerrar y cancelar movimiento'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        this.cambiarEstado();

      }
    })


  }

  cargarEstadoSistema() {
    this.systemService.getEstadoSystem()
      .subscribe(({ getEstadoSistemaDB }) => {

        this.estado_sistema = getEstadoSistemaDB.estado;
        if (this.estado_sistema === 0 || this.estado_sistema === 2 || this.estado_sistema === 3 || this.estado_sistema === 4) {
          this.severity = 'warn';
          (this.estado_sistema === 0) ? this.txt_estado = ' CERRADO ' : (this.estado_sistema === 2) ? this.txt_estado = ' INSCRIPCIONES CERRADAS ANTES DE FECHA DE CIERRE ' : (this.estado_sistema === 3) ? this.txt_estado = 'SISTEMA CERRADO Y CONSTANCIAS GENERADAS' : this.txt_estado = 'SISTEMA CERRADO Y CONSTANCIAS ENVIADAS';
          if (this.estado_sistema === 4) {
            this.severity = 'success'
          }
        } else {
          this.severity = 'success'
          this.txt_estado = ' ACTIVO ';
        }

      }, err => {
        this.severity = 'error';

        // Problemas con el servidor
        this.estado_sistema = 4;

        console.log(err);


      })
  }

  cambiarEstado() {
    this.systemService.cambiarEstadoSistema(this.formConfiguracionSistema.value).subscribe((resp: any) => {

      Swal.fire({
        title: 'El estado del sistema se actualizó correctamente',
        icon: 'success',
        timer: 2000,
        allowEscapeKey: false, allowOutsideClick: false,
        showConfirmButton: false
        // allowOutsideClick: false,
      });
      this.formConfiguracionSistema.reset();
      this.cargarEstadoSistema();
      // this.router.navigate(['./comites']);
      // this.location.back();

    }, err => {
      console.log(err);

      Swal.fire('Error', 'El estado del sistema no fue actualizado', 'error');

    })
  }

  danger() {

    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: '¡Cuidado! zona peligrosa',
      showConfirmButton: false,
      timer: 2000
    });
  }

  generarConstancias() {

    this.loadingGenerarConstancias = true;

    Swal.fire({
      title: '¿Estás seguro?',
      icon: 'question',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: true,
      confirmButtonText: 'Sí, generar constancias',
      showCancelButton: true,
      cancelButtonText: 'Cerrar y cancelar movimiento'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        // this.loadingGenerarConstancias = true;
        this.systemService.generarConstancias()
          .subscribe((resp: any) => {
            console.log(resp);

            const { aGenerar, generados } = resp;

            Swal.fire({
              title: 'Las constancias se generaron correctamente.',
              icon: 'success',
              html: `De un total de <b>${aGenerar}</b> constancias a generar se generaron <b>${generados}</b>. <br> Se generó el <b> ${generados * 100 / aGenerar}% de las constancias</b>`,
              // html: `Se generó un total de ${generados} constancias  de ${aGenerar}`,
              // timer: 2000,
              allowEscapeKey: false, allowOutsideClick: false,
              // showConfirmButton: false
              // allowOutsideClick: false,
            }).then((confirmado) => {
              this.estado_sistema = 3;
              this.formConfiguracionSistema.controls['estado'].setValue(this.estado_sistema);
              this.cambiarEstado();
              this.loadingGenerarConstancias = false;

              this.formConfiguracionSistema.reset();
            });

          }, err => {
            this.loadingGenerarConstancias = false;

            console.log(err);

            Swal.fire('Error', 'Occurrió un error en la generación de las constancias. El estado del sistema no fue actualizado', 'error');

          });
      }
    });

  }
  enviarConstancias() {

    this.loadingEnviarConstancias = true;

    /********************/
    Swal.fire({
      title: '¿Estás seguro de enviar las constancias?',
      icon: 'question',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: true,
      confirmButtonText: 'Sí, enviar constancias',
      showCancelButton: true,
      cancelButtonText: 'Cerrar y cancelar movimiento'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        this.systemService.enviarConstancias()
          .subscribe((resp: any) => {
            console.log(resp);

            const { aEnviar, enviados } = resp;


            Swal.fire({
              title: 'Las constancias se enviaron correctamente',
              icon: 'success',
              html: `De un total de <b>${aEnviar}</b> constancias a enviar se enviaron <b>${enviados}</b>. <br> Se envió el <b> ${enviados * 100 / aEnviar}% de las constancias</b>`,
              // timer: 2000,
              allowEscapeKey: false, allowOutsideClick: false,
              // showConfirmButton: false
              // allowOutsideClick: false,
            }).then((confirmado) => {
              this.estado_sistema = 4;
              this.formConfiguracionSistema.controls['estado'].setValue(this.estado_sistema);
              this.cambiarEstado();
              
              this.loadingEnviarConstancias = false;

              this.formConfiguracionSistema.reset();
            });


          }, err => {
            this.loadingEnviarConstancias = false;

            console.log(err);

            Swal.fire('Error', 'Occurrió un error en el envío de las constancias. El estado del sistema no fue actualizado', 'error');

          });

      }
    });
    /********************/

  }

}
