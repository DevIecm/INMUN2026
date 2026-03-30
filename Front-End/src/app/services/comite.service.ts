import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormComite } from '../interfaces/comite';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { AdminService } from './admin.service';
import { Listado } from '../interfaces/listado-validacion';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class ComiteService {

  
  constructor( private http: HttpClient, private adminService: AdminService ) { }
  
  public headers = this.adminService.headers;
  
  registrarComite( data: FormComite ) {

    return this.http.post(`${base_url}/comite/crear-comite`, data, this.headers);

  }
  
  actualizarComite( data: FormComite, id_comite: number | null ) {

    return this.http.put(`${base_url}/comite/actualizar-comite/${id_comite}`, data, this.headers);

  }

  obtenerTodosComites(){
    return this.http.get(`${base_url}/comite/obtener-todos-comites`, this.headers);
  }

  obtenerComitesActivos(){
    return this.http.get(`${base_url}/comite/obtener-comites-activos`, this.headers);
  }
  
  publicarComite( id_comite: number ){
    return this.http.put(`${base_url}/comite/activar-comite/${id_comite}`, {}, this.headers);
  }

  obtenerInfoComite( id_comite: number ){
    return this.http.get(`${base_url}/comite/obtener-comite-editar/${id_comite}`, this.headers);
  }
  
  obtenerListadoReasignacionComite(){
    return this.http.get(`${base_url}/comite/obtener-usuarios-y-comite`, this.headers);
  }
  
  obtenerListadoValidacion(){
    return this.http.get<Listado>(`${base_url}/comite/obtener-listado-validacion`, this.headers);
  }
  
  reasignarComite( id_comite: number, id_usuario: number ){
    return this.http.put(`${base_url}/comite/actualizar-comite-seleccionado/${id_comite}/${id_usuario}`, {}, this.headers);
  }
  
  eliminarComite( id_comite: number ){
    return this.http.delete(`${base_url}/comite/eliminar-comite/${id_comite}`, this.headers);
  }
  
  eliminarCuentaUsuario( id_comite: number, id_usuario: number ){
    return this.http.delete(`${base_url}/usuarios/eliminar-cuenta-usuario/${id_comite}/${id_usuario}`, this.headers);
  }
}
