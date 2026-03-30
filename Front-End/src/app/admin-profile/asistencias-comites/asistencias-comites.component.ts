import { Component, OnInit } from '@angular/core';
import { Listado, UsuariosConAsistenciaDB } from 'src/app/interfaces/listado-validacion';
import { ComiteService } from 'src/app/services/comite.service';

@Component({
  selector: 'app-asistencias-comites',
  templateUrl: './asistencias-comites.component.html',
  styles: [
  ]
})
export class AsistenciasComitesComponent implements OnInit {

  productDialog: boolean = false;

  // asistencias: ListadoValidacion[] = [];
  asistencias: UsuariosConAsistenciaDB[] = [];

  constructor( private comiteService: ComiteService ) { }

  ngOnInit(): void {
    this.obtenerListado();
  }

  obtenerListado(){

    this.comiteService.obtenerListadoValidacion()
      .subscribe( (data: Listado) => {
        console.log(data);
        this.asistencias = data.usuariosConAsistenciaDB;
        
      })

  }

}
