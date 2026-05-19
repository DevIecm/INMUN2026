import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
    providedIn: 'root'
})

export class CuestionariosService {

    constructor(private http: HttpClient) { }

    obtenerEvaluacionDiagnostica(id_cuestionario: number) {
        return this.http.get(`${base_url}/cuestionarios/obtener-preguntas?id_cuestionario=${id_cuestionario}`);
    }

    obtenerRespuestas(id_cuestionario: number) {
        return this.http.get(`${base_url}/cuestionarios/obtener-respuestas?id_cuestionario=${id_cuestionario}`);
    }

    guardarRespuestas(data: any) {
        return this.http.post(`${base_url}/cuestionarios/guardar-respuestas`, data);
    }

}