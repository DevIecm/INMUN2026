import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AdminService } from './admin.service';

const base_url = environment.base_url;

interface EstadoSistema {
  ok:                 boolean;
  getEstadoSistemaDB: GetEstadoSistemaDB;
}

interface GetEstadoSistemaDB {
  id_etapa:               number;
  estado:                 number;
  id_admin_alta:          number;
  id_admin_cambia_estado: null | number;
  fecha_alta:             string;
  fecha_cambia_estado:    null | number;
}

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  constructor( private http: HttpClient, private adminService: AdminService ) { }

  getEstadoSystem(){
    const url = `${base_url}/estado-sistema`;
    return this.http.get< EstadoSistema >(url)
      .pipe(
        map(( resp: EstadoSistema ) => {
          // console.log(resp);
          /* const  { id_etapa, estado } = resp.sistemaDB;
          const  { fecha_actual, fecha_apertura } = resp.fechas;
          this.stateSystem = estado;
          return {estado, fecha_actual, fecha_apertura}; */

          return resp;
        })
      )
  }

  cambiarEstadoSistema( data: FormData ){
    const url = `${base_url}/estado-sistema`;
    return this.http.post(url, data, this.adminService.headers);
  }

  generarConstancias(){
    const url = `${base_url}/constancias/generar-constancias`;
    return this.http.post(url, {}, this.adminService.headers);
  }
  
  enviarConstancias(){
    const url = `${base_url}/constancias/enviar-constancias`;
    return this.http.post(url, {}, this.adminService.headers);
  }
}
