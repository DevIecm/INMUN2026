import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap, Observable, map, catchError, of } from 'rxjs';
// import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ComplementaInformacion } from '../interfaces/complementa-informacion-form';
import { PermisosYAutorizaciones } from '../interfaces/permisos-autorizaciones-from';
import { RegistroForm } from '../interfaces/registro-form';
import { PermisosAutorizaciones } from '../models/permisos-menores.model';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  public usuario!: Usuario;
  public permisosAutorizaciones!: PermisosAutorizaciones;

  constructor(private http: HttpClient,
    private router: Router) { }


  // Geters

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get perfil(): number {
    // console.log(this.usuario);

    // return 1;
    return this.usuario.perfil;
  }
  
  guardaPermisosYAutorizaciones( data: PermisosYAutorizaciones ) {

    return this.http.post(`${base_url}/usuarios/permisos-autorizaciones`, data, this.headers);

  }
  
  guardaPermisosYAutorizacionesMenor( data: any ) {

    return this.http.post(`${base_url}/usuarios/permisos-autorizaciones-menor`, data, this.headers);

  }

  obtenerPermisoCapturado(){
    return this.http.get(`${base_url}/usuarios/permisos-autorizaciones`, this.headers)
    /* .pipe(
      map((resp: any) => {

        console.log(resp);

        const { id_usuario, nombres, primer_apellido, segundo_apellido, edad, correo_electronico, curp, uuid, estado, perfil, genero, telefono_celular, telefono_casa, demarcacion_territorial, entidad_federativa, id_comite, folio, como_te_enteraste } = resp.usuarioDB;
        // const token = resp.token;

        this.usuario = new Usuario(id_usuario, nombres, primer_apellido, segundo_apellido, edad, correo_electronico, curp, uuid, estado, perfil, genero, telefono_celular, telefono_casa, demarcacion_territorial, entidad_federativa, id_comite, folio, como_te_enteraste);

        // this.guardarLocalStorage(resp.token, resp.menu);

        return true;
      }),
      catchError(error => of(false))
    ); */
  }

  // Se ejecuta en el guard, antes de abrir la ruta
  /* validarToken(): Observable<boolean> { // Regresa un observable que emite un boolean
    return this.http.get(`${base_url}/login/renew`, this.headers)
      .pipe(
        map((resp: any) => {

          console.log(resp);

          const { id_usuario, nombres, primer_apellido, segundo_apellido, edad, correo_electronico, curp, uuid, estado, perfil, genero, telefono_celular, telefono_casa, demarcacion_territorial, entidad_federativa, id_comite, folio, como_te_enteraste } = resp.usuarioDB;
          // const token = resp.token;

          this.usuario = new Usuario(id_usuario, nombres, primer_apellido, segundo_apellido, edad, correo_electronico, curp, uuid, estado, perfil, genero, telefono_celular, telefono_casa, demarcacion_territorial, entidad_federativa, id_comite, folio, como_te_enteraste);

          // this.guardarLocalStorage(resp.token, resp.menu);

          return true;
        }),
        catchError(error => of(false))
      );
  } */

}
