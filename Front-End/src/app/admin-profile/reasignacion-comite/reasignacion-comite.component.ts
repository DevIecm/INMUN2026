import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductService } from 'src/app/demo/service/product.service';
import { ListadoReasignacionComite } from 'src/app/interfaces/listado-reasignacion-comite';
import { ComiteService } from '../../services/comite.service';
import { Comite } from '../../interfaces/comite';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reasignacion-comite',
  templateUrl: './reasignacion-comite.component.html',
  styles: [
    `
    .sin-cupo{
      background-color: #e3e3e3;
    }
    `
  ],
  providers: [
    MessageService,ConfirmationService
  ]
})
export class ReasignacionComiteComponent implements OnInit {

  productDialog: boolean = false;

  public reasignaciones: ListadoReasignacionComite[] = [];
  public selComites: Comite[] = [];

  constructor( private comiteService: ComiteService) { }

  ngOnInit(): void {
    this.obtenerListadoReasignacion();
    this.obtenerComites();
  }

  obtenerListadoReasignacion(){
    this.comiteService.obtenerListadoReasignacionComite()
      .subscribe( (data: any) => {
        // console.log(data);
        this.reasignaciones = data.listadoReasignacion;
        
      })
  }

  obtenerComites(){
    this.comiteService.obtenerComitesActivos()
      .subscribe( (data: any) => {
        // console.log(data);
        this.selComites = data.getComitesActivosDB;        
      })
  }

  cambiarComite(id_usuario: number, nuevo_id_comite: any){

    // TODO: Actualizar lugares disponibles al reasignar comité

    Swal.fire({ title: '¿Estás seguro?', icon: 'question', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: true, confirmButtonText: 'Sí, reasignar comité', showCancelButton: true, cancelButtonText: 'Cerrar y cancelar movimiento' })
      .then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          // Swal.fire('Saved!', '', 'success')
          // this.router.navigateByUrl('/main');
          this.updating()
          // console.log({id_usuario, nuevo_id_comite});
      
          this.comiteService.reasignarComite( nuevo_id_comite, id_usuario )
            .subscribe( (res: any) => {
              this.updating( true, 'Reasignando comité...' );
      
              // console.log(res);
              
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Bien',
                text: res.msg,
                showConfirmButton: false,
                timer: 2000
              });
      
              this.obtenerListadoReasignacion();
              
            }, (err: Error) => {
              this.updating( true );
              console.log(err);
              // Swal.fire({})
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al actualizar la información, hable con el administrador',
                // showConfirmButton: false,
                // timer: 1500
              });
            })
        } else if (result.isDenied) {
          // Swal.fire('Changes are not saved', '', 'info')
        }
      })

    
  }

  updating( cierra: boolean = false, accion: string = '' ){

    Swal.fire({
      showConfirmButton: false,
      html: `<i class="pi pi-spin pi-spinner" style=""></i> Actualizando...`,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
    });

    if(cierra){
      Swal.close();
    }

  }

  editProduct(producto: any){}
  deleteProduct(reasignacion: any){
    Swal.fire({
      title: '¿Estás seguro?',
      icon: 'question',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: true,
      confirmButtonText: 'Sí, eliminar cuenta',
      showCancelButton: true,
      cancelButtonText: 'Cerrar y cancelar movimiento'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        // Swal.fire('Saved!', '', 'success')
        // this.router.navigateByUrl('/main');
        this.updating()
        // console.log({id_usuario, nuevo_id_comite});

        this.comiteService.eliminarCuentaUsuario(reasignacion.id_comite, reasignacion.id_usuario)
          .subscribe((res: any) => {
            this.updating(true, 'Eliminando cuenta...');

            // console.log(res);

            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Bien',
              text: res.msg,
              showConfirmButton: false,
              timer: 2000
            });

            this.obtenerListadoReasignacion();

          }, (err: Error) => {
            this.updating(true);
            console.log(err);
            // Swal.fire({})
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al eliminar la información, hable con el administrador',
              allowOutsideClick: false,
              allowEscapeKey: false
            });
          })
      } else if (result.isDenied) {
        // Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }


  hideDialog(){}
  saveProduct(){}

}
