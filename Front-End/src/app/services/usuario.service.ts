import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap, Observable, map, catchError, of } from 'rxjs';
// import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ComplementaInformacion } from '../interfaces/complementa-informacion-form';
import { PermisosYAutorizaciones } from '../interfaces/permisos-autorizaciones-from';
import { RegistroForm } from '../interfaces/registro-form';
import { Usuario } from '../models/usuario.model';
import { AdminService } from './admin.service';

const base_url = environment.base_url;

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    public usuario!: Usuario;

    constructor(private http: HttpClient,
        private router: Router,
        private adminService: AdminService) { }


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

    login(formData: { usuario: '', contrasena: '' }) {

        return this.http.post(`${base_url}/login`, formData)
            .pipe(
                tap((resp: any) => {
                    // console.log(resp);

                    this.guardarLocalStorage(resp.token, resp.menu);
                })
            )

    }

    guardarLocalStorage(token: string, menu?: any) {
        localStorage.setItem('token', token);
        localStorage.setItem('menu', JSON.stringify(menu));
    }

    logOut() {
        // localStorage.removeItem('token');
        // localStorage.removeItem('menu');

        if (this.adminService.tokenAdmin != '') {
            this.adminService.logOutAdmin();
        } else {
            this.router.navigateByUrl('/auth/login');
        }
    }

    crearUsuario(formData: RegistroForm) {

        return this.http.post(`${base_url}/usuarios`, formData)
            .pipe(
                tap((resp: any) => {

                    this.guardarLocalStorage(resp.token);
                    // this.guardarLocalStorage(resp.token, resp.menu);

                })
            )

    }

    activarCuenta(correo_electronico: string, token_mail: string, uuid: string) {
        return this.http.put(`${base_url}/login/active/${correo_electronico}/${token_mail}/${uuid}`, this.headers);
    }

    validarUsuario(id_usuario: number) {
        console.log({ id_usuario });

        return this.http.put(`${base_url}/usuarios/validar-usuario/${id_usuario}`, {}, this.adminService.headers);
    }

    obtenerListadoUsuariosValidacion() {
        return this.http.get(`${base_url}/usuarios/validacion-usuarios`, this.adminService.headers);
    }

    complementoInformacion(data: ComplementaInformacion) {

        return this.http.put(`${base_url}/usuarios/complementa-informacion`, data, this.headers);

    }

    validaCupoInscripcionComite(id_comite: number) {

        return this.http.get(`${base_url}/comite/obtener-lugares-disponibles/${id_comite}`, this.headers);

    }


    guardarInscripcionComite(formData: FormData) {
        return this.http.post(`${base_url}/usuarios/comite`, formData, this.headers);
    }

    // Se ejecuta en el guard, antes de abrir la ruta
    validarToken(): Observable<boolean> { // Regresa un observable que emite un boolean
        return this.http.get(`${base_url}/login/renew`, this.headers)
            .pipe(
                map((resp: any) => {

                    console.log(resp);

                    const { id_usuario, nombres, primer_apellido, segundo_apellido, edad, correo_electronico, curp, uuid, estado, perfil, genero, telefono_celular, telefono_casa, demarcacion_territorial, entidad_federativa, id_comite, folio, como_te_enteraste, discapacidad, cual_discapacidad, necesito_justificante, persona_dirigido, cargo_persona, institucion_persona } = resp.usuarioDB;
                    // const token = resp.token;

                    this.usuario = new Usuario(id_usuario, nombres, primer_apellido, segundo_apellido, edad, correo_electronico, curp, uuid, estado, perfil, genero, telefono_celular, telefono_casa, demarcacion_territorial, entidad_federativa, id_comite, folio, como_te_enteraste, discapacidad, cual_discapacidad, necesito_justificante, persona_dirigido, cargo_persona, institucion_persona);

                    this.guardarLocalStorage(resp.token, resp.menu);

                    return true;
                }),
                catchError(error => of(false))
            );
    }

    obtenerComitesActivos() {
        return this.http.get(`${base_url}/comite/obtener-comites-activos`);
    }

    obteneravanceRegistro() {
        return this.http.get(`${base_url}/usuarios/avance-registro`, this.headers);
    }

    validarInfoRecuperarcontrasena(token_mail: string) {
        return this.http.get(`${base_url}/login/obtener-info-de-token-mail/${token_mail}`);
    }

    actualizarContrasena(data: FormData) {
        return this.http.put(`${base_url}/login/reestablecer-contrasena`, data);
    }

    solicitarCambioContrasena(data: FormData) {
        return this.http.post(`${base_url}/login/olvide-contrasena`, data);
    }

}
