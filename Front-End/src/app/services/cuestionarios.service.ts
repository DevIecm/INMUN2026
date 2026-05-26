import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
    providedIn: 'root'
})

export class CuestionariosService {

    constructor(private http: HttpClient) { }

    obtenerPreguntasGenerales() {
        return this.http.get(`${base_url}/cuestionarios/obtener-preguntas-generales`);
    }

    obtenerRespuestasGenerales() {
        return this.http.get(`${base_url}/cuestionarios/obtener-respuestas-generales`);
    }

    obtenerPreguntas(nivel_escolar: number) {
        return this.http.get(`${base_url}/cuestionarios/obtener-preguntas?nivel_escolar=${nivel_escolar}`);
    }

    // obtenerEvaluacionDiagnostica(id_cuestionario: number) {
    //     return this.http.get(`${base_url}/cuestionarios/obtener-preguntas?id_cuestionario=${id_cuestionario}`);
    // }

    obtenerRespuestas(nivel_escolar: number) {
        return this.http.get(`${base_url}/cuestionarios/obtener-respuestas?nivel_escolar=${nivel_escolar}`);
    }

    // guardarRespuestas(data: any) {
    //     return this.http.post(`${base_url}/cuestionarios/guardar-respuestas`, data);
    // }


    get headers() {
        return {
            headers: {
                'x-token': localStorage.getItem('token') || ''
            }
        };
    }

    guardarRespuestas(data: any) {
        return this.http.post(
            `${base_url}/cuestionarios/guardar-respuestas-modulo`,
            data,
            this.headers
        );
    }

}