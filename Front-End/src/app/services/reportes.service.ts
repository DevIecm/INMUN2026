import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class ReportesService {

    get token(): string {
        return localStorage.getItem('tokenAdmin') || '';
    }

    get headers() {
        return {
            headers: {
                'x-token-admin': this.token
            }
        }
    }

    constructor(private http: HttpClient) { }

    rptRegistroUsuarios() {
        const url = `${base_url}/admin-reportes/rpt-registros`;
        return this.http.get(url, this.headers);
    }

    zipJustificantes() {
        const url = `${base_url}/admin-reportes/justificantes`;
        return this.http.get(url, { ...this.headers, responseType: 'blob' });

    }
}
