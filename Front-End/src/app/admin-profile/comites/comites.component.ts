import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from 'src/app/demo/api/product';
import { Comite } from 'src/app/interfaces/comite';
import { ComiteService } from 'src/app/services/comite.service';
import { ProductService } from '../../demo/service/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comites',
  templateUrl: './comites.component.html',
  styles: [
    `
    .eliminado {
      text-decoration-line: line-through;
    }
    `
  ],
  providers: [
    MessageService,ConfirmationService
  ]
})
export class ComitesComponent implements OnInit {

  productDialog: boolean = false;

  public comites: Comite[] = [];

  public estadosComite: string[] = ['No publicado', 'Publicado', 'Eliminado'];
  public severity: string[] = ['warning', 'success', 'danger'];

  products: any[] = [];

  constructor( private productService: ProductService, private comiteService: ComiteService) { }

  ngOnInit(): void {
    this.obtenerComites();
  }

  obtenerComites(){
    this.comiteService.obtenerTodosComites()
      .subscribe( (data: any) => {
        console.log(data);
        this.comites = data.getComitesDB;
        
      })
  }

  publicarComite( id_comite: number ){
    console.log(id_comite);
    this.comiteService.publicarComite( id_comite )
      .subscribe( (resp: any) => {
        console.log(resp);
        
        Swal.fire({
          title: resp.msg,
          icon: 'success',
          timer: 2500,
          allowEscapeKey: false, allowOutsideClick: false
          // allowOutsideClick: false,
        });

        this.obtenerComites();
        
      })
    
  }

  deleteProduct(id_comite: number) {
    // console.log(id_comite);
    Swal.fire({ title: '¿Estás seguro?', icon: 'question', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: true, confirmButtonText: 'Sí, eliminar', showCancelButton: true, cancelButtonText: 'Cerrar y cancelar movimiento' })
      .then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.comiteService.eliminarComite( id_comite )
          .subscribe( (resp: any) => {
            console.log(resp);

            this.obtenerComites();
            
            Swal.fire({
              position: 'top-end',
              title: resp.msg,
              icon: 'success',
              timer: 2500,
              allowEscapeKey: false, allowOutsideClick: false
              // allowOutsideClick: false,
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
