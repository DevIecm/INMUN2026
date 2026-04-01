import { Component, OnInit } from '@angular/core';
import { ComiteService } from '../../services/comite.service';
import { Comite } from 'src/app/interfaces/comite';
import { ProductService } from 'src/app/demo/service/product.service';
import Swal from 'sweetalert2';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
    selector: 'app-validacion',
    templateUrl: './validacion.component.html',
    styles: [
    ],
    providers: [
        MessageService, ConfirmationService
    ]
})
export class ValidacionComponent implements OnInit {

    productDialog: boolean = false;

    public usuarios: Usuario[] = [];

    public estadosComite: string[] = ['No publicado', 'Publicado', 'Eliminado'];
    public severity: string[] = ['warning', 'success', 'danger'];

    products: any[] = [];

    constructor(private productService: ProductService, private usuarioService: UsuarioService) { }

    ngOnInit(): void {
        this.obtenerListado();
    }

    obtenerListado() {

        this.usuarioService.obtenerListadoUsuariosValidacion()
            .subscribe((res: any) => {
                // console.log(res);

                this.usuarios = res.usuariosValidacionDB;

            })

    }

    validarCuentaUsuario(id_usuario: number) {
        const usuario = this.usuarios.find(u => u.id_usuario === id_usuario);
        if (usuario) {
            usuario.loading = true;
        }
        Swal.fire(
            {
                title: '¿Estás seguro que desea validar el registro?',
                icon: 'question',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: true,
                confirmButtonText: 'Validar',
                showCancelButton: true,
                cancelButtonText: 'Cerrar y cancelar acción',
                reverseButtons: true
            }
        )
            .then((result) => {
                /* Read more about isConfirmed, isDenied below */
                const usuario = this.usuarios.find(u => u.id_usuario === id_usuario);
                if (usuario) {
                    usuario.loading = true;
                }
                if (result.isConfirmed) {
                    this.usuarioService.validarUsuario(id_usuario)
                        .subscribe((resp: any) => {
                            // console.log(resp);

                            Swal.fire({
                                title: resp.msg,
                                icon: 'success',
                                // timer: 2500,
                                allowEscapeKey: false,
                                allowOutsideClick: false,
                                showConfirmButton: true,
                                // allowOutsideClick: false,
                            });

                            this.obtenerListado();

                        })
                }
                if (result.isDenied || result.isDismissed) {

                    if (usuario) {
                        usuario.loading = false;
                    }
                }

            })
    }

    // hideDialog() { }
    // saveProduct() { }


}
