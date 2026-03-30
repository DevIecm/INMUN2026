export class Admin {
    constructor(
        public id_admin: number,
        public nombre_usuario: string,
        public usuario: string,
        public estado: number,
        public perfil: number,
        private contrasena?: string,
    ) { }
}
