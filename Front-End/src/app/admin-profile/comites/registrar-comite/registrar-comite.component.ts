import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Location } from '@angular/common'

import { ComiteService } from 'src/app/services/comite.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-registrar-comite',
    templateUrl: './registrar-comite.component.html',
    styles: [
    ]
})
export class RegistrarComiteComponent implements OnInit {

    public formComite: FormGroup = this.fb.group({
        nombre_comite: ['', [Validators.required, Validators.maxLength(300)]],
        cupo: [, [Validators.required, Validators.min(1)]],
        fecha: ['', [Validators.maxLength(50), Validators.min(1)]]
    });

    // public usuario!: Usuario;
    public id_comite: number | null = null;


    constructor(private fb: FormBuilder,
        private comiteService: ComiteService,
        private router: Router,
        private location: Location,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {

        // this.cargaInfo();
        this.activatedRoute.params.subscribe((params: any) => {
            const { id_comite } = params;
            if (id_comite) {
                this.cargarInfoComite(id_comite);
            }
        });

    }

    cargarInfoComite(id_comite: number) {
        this.comiteService.obtenerInfoComite(id_comite)
            .subscribe((res: any) => {
                // console.log(res);
                const { getComitesEditarDB, fecha } = res;
                const { nombre_comite, cupo, estado } = getComitesEditarDB;
                if (estado !== 0) {
                    this.router.navigateByUrl('/admin/comites');
                }
                this.id_comite = id_comite;
                var fecha_toString = fecha.map(function (e: any) {
                    let date = new Date(e);
                    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                    return date;
                });
                // console.log(fecha_toString);


                this.formComite.setValue({ nombre_comite, cupo, fecha: fecha_toString });
            })

    }

    submit() {

        // TODO: Verificar si es edicion o registro

        if (!this.formComite.valid) {
            return;
        }

        let tipoService = null;

        if (this.id_comite) {
            // console.log('Existe id comité');

            tipoService = this.comiteService.actualizarComite(this.formComite.value, this.id_comite);
        } else {
            tipoService = this.comiteService.registrarComite(this.formComite.value);
            console.warn('NO EXISTE');
        }

        tipoService
            .subscribe((resp: any) => {

                Swal.fire({
                    title: resp.msg,
                    icon: 'success',
                    timer: 2500,
                    allowEscapeKey: false, allowOutsideClick: false,
                    showConfirmButton: false
                    // allowOutsideClick: false,
                });
                // this.router.navigate(['./comites']);
                this.location.back();

            })


    }
}
