export class PermisosAutorizaciones {
    constructor(
        public id_autorizacion: number,
        public conoce_acepta_terminos_convocatoria: boolean,
        public ha_leido_aviso_privacidad: boolean,
        public autoriza_uso_imagen: boolean,
        public nombre_tutor: string,
        public curp_tutor: string,
        public parentesco: string,
        public id_usuario: number,
        public fecha_alta: number,
        public menor_edad: number
    ) { }
}
