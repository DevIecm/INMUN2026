import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Admin } from '../models/admin.model';
import { map, catchError, of, Observable, tap } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    public admin!: Admin;

    constructor(private http: HttpClient,
        private router: Router) { }

    get headers() {
        return {
            headers: {
                'x-token-admin': this.tokenAdmin
            }
        }
    }

    get tokenAdmin(): string {
        return localStorage.getItem('tokenAdmin') || '';
    }

    get perfil(): number {
        // console.log(this.usuario);

        // return 1;
        return this.admin.perfil;
    }

    loginAdmin(formData: { usuario: '', contrasena: '' }) {

        return this.http.post(`${base_url}/admin-login`, formData)
            .pipe(
                tap((resp: any) => {
                    // console.log(resp);

                    this.guardarLocalStorageAdmin(resp.token, resp.menu);
                })
            )

    }

    guardarLocalStorageAdmin(token: string, menu?: any) {
        localStorage.setItem('tokenAdmin', token);
        localStorage.setItem('menu', JSON.stringify(menu));
    }

    logOutAdmin() {
        localStorage.removeItem('tokenAdmin');
        localStorage.removeItem('menu');
        this.router.navigateByUrl('/login-admin');
    }

    // Se ejecuta en el guard, antes de abrir la ruta
    validarTokenAdmin(): Observable<boolean> { // Regresa un observable que emite un boolean
        return this.http.get(`${base_url}/admin-login/renew`, this.headers)
            .pipe(
                map((resp: any) => {

                    console.log(resp);

                    const { id_admin, nombre_usuario, usuario, estado, perfil } = resp.adminDB;
                    // const token = resp.token;

                    this.admin = new Admin(id_admin, nombre_usuario, usuario, estado, perfil);

                    this.guardarLocalStorageAdmin(resp.token, resp.menu);

                    return true;
                }),
                catchError(error => of(false))
            );
    }

}
