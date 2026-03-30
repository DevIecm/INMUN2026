export interface FormComite {
    nombre_comite: string;
    cupo:          number;
    fecha:         string[];
}

export interface Comite {
    id_comite:              number;
    nombre_comite:          string;
    cupo?:                   number;
    lugares_disponibles?:    number | undefined;
    estado?:                 number;
    disabled?:              boolean;
}
